const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

// joining path of directory
const directoryPath = path.join(__dirname, 'Jackett/src/Jackett.Common/Definitions');
// passsing directoryPath and callback function

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

/*const categoriesPath = path.join(__dirname, 'Jackett/src/Jackett.Common/Models/TorznabCatType.generated.cs');

try {
    const fileContents = fs.readFileSync(path.join(categoriesPath, file), 'utf8');
    // SubCategories
} catch (err) {
    //
}*/

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

fs.readdir(directoryPath, function (err, files) {
    // handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    // listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        try {
            let fileContents = fs.readFileSync(path.join(directoryPath, file), 'utf8');
            // "json: true" helps with duplicated keys
            let data = yaml.safeLoad(fileContents, {skipInvalid: true, json: true});

            if (data.type === 'private') {
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
                    // remove duplicates
                    type = Array.from(new Set(type))
                    tracker.type = type.join(", ")
                } else if (data.caps.categories && data.caps.categorymappings) {
                    data.caps.categorymappings.forEach(function(category) {
                        //console.log(category)
                        type.push(cleanTypeDefinition(category.cat.split("/")[0]))
                    })
                    console.log(type)
                    // remove duplicates
                    type = Array.from(new Set(type))
                    tracker.type = type.join(", ")
                    //console.log(tracker.type)
                }
                //console.log(tracker)
                trackers.trackers.push(tracker)
            }
        } catch (err) {
            // YAMLException
            console.log(err);
        }
    });

    console.log('Without indexers: ' + trackers.trackers.length);

    const indexersPath = path.join(__dirname, 'Jackett/src/Jackett.Common/Indexers');

    fs.readdir(indexersPath, function (err, files) {
        // handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // listing all files using forEach
        files.forEach(function (file) {
            // Skip directories
            if (!file.endsWith('.cs')) {
                return;
            }
            // Do whatever you want to do with the file
            try {
                const fileContents = fs.readFileSync(path.join(indexersPath, file), 'utf8');
                const typePrivate = /Type\s+=\s+"private"/i
                const typeAvistaz = /AvistazTracker/i
                const isPrivate = typePrivate.test(fileContents) || typeAvistaz.test(fileContents)
                if (isPrivate) {
                    let tracker = {
                        name: '',
                        description: '',
                        type: ''
                    }

                    const res = fileContents.match(/:\s+base\([^{]*"/s)
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
                    // remove duplicates
                    type = Array.from(new Set(type))
                    tracker.type = type.join(", ")

                    trackers.trackers.push(tracker)
                }
            } catch (err) {
                console.log(err);
            }
        });

        console.log('With indexers: ' + trackers.trackers.length);

        trackers.trackers = trackers.trackers.filter((t) => !jackettIgnoreList.includes(t.name.toLowerCase()))
        trackers.trackers.sort(function(a, b) {
            return a.name.localeCompare(b.name)
        });

        let data = JSON.stringify(trackers);
        fs.writeFileSync('trackers2.json', data);
    })
});
