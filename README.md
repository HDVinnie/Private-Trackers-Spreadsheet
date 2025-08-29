<div align="center">
<h1>🏴‍☠️ Private Trackers Spreadsheet</h1>

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-hdvinnie.github.io-e74c3c?style=for-the-badge)](https://hdvinnie.github.io/Private-Trackers-Spreadsheet/)
[![GitHub Stars](https://img.shields.io/github/stars/hdvinnie/Private-Trackers-Spreadsheet?style=for-the-badge&color=ffd700)](https://github.com/hdvinnie/Private-Trackers-Spreadsheet/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/hdvinnie/Private-Trackers-Spreadsheet?style=for-the-badge&color=3498db)](https://github.com/hdvinnie/Private-Trackers-Spreadsheet/network)

*"A interactive database of private BitTorrent tracker statistics with sorting and filtering capabilities. Built using AlpineJS, HTML5 and CSS3"*

</div>

---

## 📖 Overview

This project provides a user-friendly interface to explore and manage private BitTorrent tracker statistics. It allows users to sort, filter, and search through a wide range of trackers, making it easier to find the right one for their needs.
The UI is built with AlpineJS, ensuring a lightweight and responsive experience. There is a dark and light mode toggle as well as a accent color switcher, allowing users to customize their viewing experience.
The data is stored in a JSON format, making it easy to update and maintain.
The data is sourced from user contributions and regularly updated using Jackett, ensuring that the information remains current and relevant.

---

## 🏃‍♂️ Quick Start

### 🌐 **View Online**
Simply visit the [live site](https://hdvinnie.github.io/Private-Trackers-Spreadsheet/) to start exploring tracker data immediately.

### 💻 **Local Development**

```bash
# Clone the repository
git clone https://github.com/hdvinnie/Private-Trackers-Spreadsheet.git

# Navigate to project directory
cd Private-Trackers-Spreadsheet

# Install dependencies (for Jackett updates)
npm install

# Update Jackett tracker data (optional)
node read.js
# or via npm script
npm run update:jackett
```

> Optional: to increase GitHub API rate limits, set an access token:
>
> macOS/Linux
> ```bash
> export GITHUB_TOKEN=ghp_yourtoken
> ```
> Windows (PowerShell)
> ```powershell
> $Env:GITHUB_TOKEN = "ghp_yourtoken"
> ```

---

### 📝 **How to Contribute**

1. **🍴 Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub or use:
   gh repo fork hdvinnie/Private-Trackers-Spreadsheet
   ```

2. **🌿 Create a Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

3. **✨ Make Your Changes**
   - Add new tracker data to `trackers.json`
   - Improve the UI/UX
   - Fix bugs or enhance features
   - Update documentation


4. **🚀 Submit a Pull Request**
   ```bash
   git commit -m "add: amazing new feature"
   git push origin feature/your-amazing-feature
   ```

---

<div align="center">

**Made with ❤️ by the private tracker community**

*If you find this project useful, please consider giving it a ⭐ star on GitHub!*

</div>
