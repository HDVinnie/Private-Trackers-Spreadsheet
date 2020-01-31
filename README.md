### Information

[Private Trackers Spreadsheet](https://hdvinnie.github.io/Private-Trackers-Spreadsheet/) - This comparative table of torrent trackers originates from discussions on [Reddit](https://www.reddit.com/r/trackers/comments/ehd7oy/new_private_trackers_spreadsheet/). 

It is based on [GitHub Page](https://pages.github.com) and has the ability to sort and filter data through the use of [jQuery](https://jquery.com) and [DataTables](https://datatables.net).

If you own a tracker and want to exclude it from this list, please contact us.

### Contributions

* Fork this repository

Clicking on the `Fork` button on the top of this page. This will create a copy of this repository in your account.

* Clone the repository

Go to your GitHub account, open the forked repository, click on the `Clone or download` button and then click the copy to clipboard icon. Open a terminal and run the following git command:

`git clone <url_repository>`

* Open a project in IDE or text editor

Recommendations: [IntelliJ IDEA Community](https://www.jetbrains.com/idea/), [Visual Studio Code](https://code.visualstudio.com) or [Sublime Text](https://www.sublimetext.com)

* Make changes to the file `trackers.json`, for example:

`
{"Name": "32pages", "Abbreviation": "32P", "Type": "Comics", "Codebase": "Gazelle", "Observatory Grade": "B", "Users": "5,163", "Torrents": "45,544", "Peers": "280,094", "Ratio": "No", "Ratio Diff": "N/A", "Freeleech": "Yes", "Points": "Yes", "Hit & Run": "No", "Birthdate": "2010", "Join": "Application, Invite, Recruitment", "Join Diff": "-", "Updated": "01-30-2020"},
`
* Commit the changes and push

`git commit -m "Add <name_tracker>"`

* Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

You will get a notification email once the changes have been merged.

* Synchronize your branch with this repository

Add the url of my repository to the field `upstream <remote url>`:

`git remote add upstream git@github.com:HDVinnie/Private-Trackers-Spreadsheet.git`

Download the latest changes from my repository.

`git fetch upstream`

We are merging a new version of my repository with your master branch.

`git rebase upstream/master`

Pushing these changes to your GitHub repository.

`git push origin master`

* Profit

Keep track of the project and make new issue, changes.

### Contacts

Email `hdinnovations@protonmail.com` or Reddit `u/-HDVinnie-`
