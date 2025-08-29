const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { fetch } = require('undici');

const OWNER = 'Jackett';
const REPO = 'Jackett';
const BRANCH = 'master';
const GITHUB_API = 'https://api.github.com';
const RAW_BASE = 'https://raw.githubusercontent.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

let trackers = {};
trackers.trackers = []

// list of trackers to ignore from Jackett
const mainJson = JSON.parse(fs.readFileSync('trackers.json'));
const mainIgnore = [];

mainJson.trackers.forEach(function(obj) {
	mainIgnore.push(obj.Name.toLowerCase());
});

const customIgnore = [
	'beyond-hd (oneurl)',
	'efecto doppler',
	'empornium2fa',
	'hdbits (api)',
	'hon3y hd',
	'insane tracker',
	'jptv',
	'm-team - tp',
	'mteamtp2fa',
	'racing4everyone (r4e)',
	'snowpt',
	'the geeks',
	'the place',
	'the vault',
	'totheglorycookie',
	'xwtorrents',
]

const jackettIgnoreList = mainIgnore.concat(customIgnore);

// clean up duplicate types
// see Jackett/src/Jackett.Common/Models/TorznabCatType.generated.cs
const cleanTypes = {
	"audioaudiobook": "Audiobooks",
	"audioforeign": "Audio",
	"audiolossless": "Audio",
	"audiomp3": "Audio",
	"audioother": "Audio",
	"audiovideo": "Audio",
	"bookscomics": "Comics",
	"booksebook": "Books",
	"booksforeign": "Books",
	"booksmagazines": "Magazines",
	"booksmags": "Magazines",
	"booksother": "Books",
	"bookstechnical": "Books",
	"console3ds": "Console",
	"consolends": "Console",
	"consoleother": "Console",
	"consoleps3": "Console",
	"consoleps4": "Console",
	"consolepsp": "Console",
	"consolepsvita": "Console",
	"consolewii": "Console",
	"consolewiiu": "Console",
	"consolewiiwarevc": "Console",
	"consolexbox": "Console",
	"consolexbox360": "Console",
	"consolexbox360dlc": "Console",
	"consolexboxone": "Console",
	"movies3d": "Movies",
	"moviesbluray": "Movies",
	"moviesdvd": "Movies",
	"moviesforeign": "Movies",
	"movieshd": "Movies",
	"moviesother": "Movies",
	"moviessd": "Movies",
	"moviesuhd": "Movies",
	"movieswebdl": "Movies",
	"other": "General",
	"otherhashed": "General",
	"othermisc": "General",
	"pc0day": "PC",
	"pcgames": "Games",
	"pciso": "PC",
	"pcmac": "Mac Software",
	"pcmobileandroid": "Android",
	"pcmobileios": "iOS",
	"pcmobileother": "Phone",
	"pcphoneandroid": "Android",
	"pcphoneios": "iOS",
	"pcphoneother": "Phone",
	"tvanime": "Anime",
	"tvdocumentary": "TV",
	"tvforeign": "TV",
	"tvhd": "TV",
	"tvother": "TV",
	"tvsd": "TV",
	"tvsport": "Sports",
	"tvuhd": "TV",
	"tvwebdl": "TV",
	"xxxdvd": "XXX",
	"xxximageset": "XXX",
	"xxxother": "XXX",
	"xxxpack": "XXX",
	"xxxpacks": "XXX",
	"xxxsd": "XXX",
	"xxxuhd": "XXX",
	"xxxwmv": "XXX",
	"xxxx264": "XXX",
	"xxxxvid": "XXX",
}

function cleanTypeDefinition(type) {
	let types = new Map([
		['Other', 'General'],
	])

	return types.get(type) || type
}

function authHeaders(extra) {
	const headers = {
		'User-Agent': 'private-trackers-spreadsheet/1.0',
		'Accept': 'application/vnd.github+json'
	};
	if (GITHUB_TOKEN) {
		headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
	}
	return Object.assign(headers, extra || {});
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options = {}, maxAttempts = 6) {
	let attempt = 0;
	let lastError;
	while (attempt < maxAttempts) {
		attempt++;
		const res = await fetch(url, options);
		if (res.ok) {
			return res;
		}
		const status = res.status;
		const body = await res.text();
		// Respect Retry-After header if present
		const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
		if (status === 429 || status === 502 || status === 503 || status === 504 || (status === 403 && body.includes('abuse detection'))) {
			const baseDelay = retryAfter > 0 ? retryAfter * 1000 : Math.min(60000, 500 * Math.pow(2, attempt));
			const jitter = Math.floor(Math.random() * 250);
			await sleep(baseDelay + jitter);
			continue;
		}
		lastError = new Error(`HTTP ${status}: ${body}`);
		break;
	}
	if (!lastError) {
		lastError = new Error('Max retry attempts exceeded');
	}
	throw lastError;
}

async function githubJson(url) {
	const res = await fetchWithRetry(url, { headers: authHeaders() });
	return res.json();
}

async function githubRawByPath(owner, repo, branch, filePath) {
	const url = `${RAW_BASE}/${owner}/${repo}/${branch}/${filePath}`;
	// raw host ignores GitHub API Accept headers; send a UA only
	const res = await fetchWithRetry(url, { headers: { 'User-Agent': 'private-trackers-spreadsheet/1.0' } });
	return res.text();
}

async function getBranchSha(owner, repo, branch) {
	const url = `${GITHUB_API}/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`;
	const data = await githubJson(url);
	if (!data || !data.commit || !data.commit.sha) {
		throw new Error('Invalid branch response from GitHub');
	}
	return data.commit.sha;
}

async function getRepoTreeRecursive(owner, repo, branch) {
	const branchSha = await getBranchSha(owner, repo, branch);
	const url = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branchSha}?recursive=1`;
	const data = await githubJson(url);
	if (!data || !data.tree) {
		throw new Error('Invalid tree response from GitHub');
	}
	return data.tree;
}

async function mapWithConcurrency(items, limit, mapper) {
	const results = new Array(items.length);
	let index = 0;
	let active = 0;
	return new Promise((resolve, reject) => {
		const next = () => {
			if (index >= items.length && active === 0) {
				resolve(results);
				return;
			}
			while (active < limit && index < items.length) {
				const current = index++;
				active++;
				Promise.resolve()
					.then(() => mapper(items[current], current))
					.then((value) => { results[current] = value; })
					.catch(reject)
					.finally(() => { active--; next(); });
			}
		};
		next();
	});
}

async function main() {
	try {
		console.log('Fetching Jackett repository tree…');
		const tree = await getRepoTreeRecursive(OWNER, REPO, BRANCH);

		const definitions = tree.filter((t) => t.type === 'blob' &&
			t.path.startsWith('src/Jackett.Common/Definitions/') &&
			(t.path.endsWith('.yml') || t.path.endsWith('.yaml')));

		const indexers = tree.filter((t) => t.type === 'blob' &&
			t.path.startsWith('src/Jackett.Common/Indexers/') &&
			t.path.endsWith('.cs'));

		console.log(`Found ${definitions.length} definitions and ${indexers.length} indexers`);

		let defsProcessed = 0;
		// Parse Definitions YAML (low concurrency to avoid throttling)
		await mapWithConcurrency(definitions, 3, async (entry) => {
			try {
				const content = await githubRawByPath(OWNER, REPO, BRANCH, entry.path);
				let data = yaml.safeLoad(content, {skipInvalid: true, json: true});
				if (data && data.type === 'private') {
					let tracker = {
						name: '',
						description: '',
						type: ''
					}
					tracker.name = data.name
					tracker.description = data.description
					let type = []
					if (data.caps && data.caps.categorymappings) {
						data.caps.categorymappings.forEach(function(category) {
							type.push(cleanTypeDefinition(category.cat.split("/")[0]))
						})
						type = Array.from(new Set(type))
						tracker.type = type.join(", ")
					} else if (data.caps && data.caps.categories && data.caps.categorymappings) {
						data.caps.categorymappings.forEach(function(category) {
							type.push(cleanTypeDefinition(category.cat.split("/")[0]))
						})
						type = Array.from(new Set(type))
						tracker.type = type.join(", ")
					}
					if (tracker.name && tracker.name.trim().length) {
						trackers.trackers.push(tracker)
					}
				}
			} catch (err) {
				console.log(err);
			} finally {
				defsProcessed++;
				if (defsProcessed % 25 === 0 || defsProcessed === definitions.length) {
					console.log(`Definitions processed: ${defsProcessed}/${definitions.length}`);
				}
			}
		});

		console.log('Without indexers: ' + trackers.trackers.length);

		let idxProcessed = 0;
		// Parse Indexers C# files (low concurrency)
		await mapWithConcurrency(indexers, 2, async (entry) => {
			try {
				const fileContents = await githubRawByPath(OWNER, REPO, BRANCH, entry.path);
				const typePrivate = /Type\s+=\s+"private"/i
				const typeAvistaz = /AvistazTracker/i
				const isPrivate = typePrivate.test(fileContents) || typeAvistaz.test(fileContents)
				if (isPrivate) {
					let tracker = {
						name: '',
						description: '',
						type: ''
					}
					const res = fileContents.match(/:\s+base\([^{}]*"/s)
					if (res !== null) {
						const lines = res[0].match(/[^\r\n]+/g);
						for (const line of lines) {
							const name = line.match(/.*name:\s+"([\w\s.\-()]+)"/i)
							if (name) {
								tracker.name = name[1]
							}
							else {
								let name2 = line.match(/.*base\("([\w\s.\-()]+)"/i)
								if (name2) {
									tracker.name = name2[1]
								}
							}
							const description = line.match(/.*(?:desc|description):\s+"([^"]+)"/i)
							if (description) {
								tracker.description = description[1]
							}
						}
					}
					let type = []
					const fileLines = fileContents.match(/[^\r\n]+/g)
					for (const line of fileLines) {
						if (line && line.includes("AddCategoryMapping")) {
							const category = line.match(/TorznabCatType\.([^,]+),/i)
							if (category) {
								const toReplace = cleanTypes.hasOwnProperty(category[1].toLowerCase())
								if (toReplace) {
									type.push(cleanTypes[category[1].toLowerCase()])
								} else {
									type.push(category[1])
								}
							}
						}
					}
					type = Array.from(new Set(type))
					tracker.type = type.join(", ")
					if (tracker.name && tracker.name.trim().length) {
						trackers.trackers.push(tracker)
					}
				}
			} catch (err) {
				console.log(err);
			} finally {
				idxProcessed++;
				if (idxProcessed % 25 === 0 || idxProcessed === indexers.length) {
					console.log(`Indexers processed: ${idxProcessed}/${indexers.length}`);
				}
			}
		});

		console.log('With indexers: ' + trackers.trackers.length);

		trackers.trackers = trackers.trackers.filter((t) => t.name && t.name.trim().length && !jackettIgnoreList.includes(t.name.toLowerCase()))
		trackers.trackers.sort(function(a, b) {
			return a.name.localeCompare(b.name)
		});

		const newJson = JSON.stringify(trackers, null, 2) + '\n';
		let oldJson = null;
		try {
			oldJson = fs.readFileSync('trackers2.json', 'utf8');
		} catch {}
		if (oldJson === newJson) {
			console.log('No changes; trackers2.json is up to date.');
		} else {
			fs.writeFileSync('trackers2.json', newJson);
			console.log('Updated trackers2.json');
		}
	} catch (e) {
		console.log('Unable to fetch from GitHub API: ' + e.message);
		if (!GITHUB_TOKEN) {
			console.log('Hint: set GITHUB_TOKEN to increase rate limits and avoid 403 errors.');
		}
		process.exitCode = 1;
	}
}

main();
