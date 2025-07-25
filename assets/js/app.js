// Theme switcher component
function themeSwitcher() {
    return {
        isDark: true,
        accentColor: '#6366f1', // Default indigo
        showColorPicker: false,
        accentColors: [
            { name: 'Red', value: '#e74c3c' },
            { name: 'Blue', value: '#3498db' },
            { name: 'Green', value: '#27ae60' },
            { name: 'Purple', value: '#9b59b6' },
            { name: 'Orange', value: '#f39c12' },
            { name: 'Teal', value: '#1abc9c' },
            { name: 'Pink', value: '#e91e63' },
            { name: 'Indigo', value: '#6366f1' }
        ],
        init() {
            // Check for saved preferences
            const savedTheme = localStorage.getItem('theme');
            const savedAccent = localStorage.getItem('accentColor');

            this.isDark = savedTheme ? savedTheme === 'dark' : true;
            this.accentColor = savedAccent || '#6366f1'; // Default to indigo

            this.applyTheme();
            this.applyAccentColor();
        },
        toggleTheme() {
            this.isDark = !this.isDark;
            this.applyTheme();
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        },
        setAccentColor(color) {
            this.accentColor = color;
            this.applyAccentColor();
            localStorage.setItem('accentColor', color);
            this.showColorPicker = false;
        },
        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        },
        applyAccentColor() {
            document.documentElement.style.setProperty('--accent-primary', this.accentColor);

            // Calculate complementary colors based on the accent
            const hex = this.accentColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            // Create rgba variants for gradients and hover effects
            document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
            document.documentElement.style.setProperty('--hover-bg', `rgba(${r}, ${g}, ${b}, 0.05)`);

            // Update all gradient variants
            document.documentElement.style.setProperty('--gradient-red',
                `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.1) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%)`);
            document.documentElement.style.setProperty('--gradient-header',
                `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.1) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%)`);

            // Update icon glow effect
            document.documentElement.style.setProperty('--icon-glow',
                `drop-shadow(0 0 10px rgba(${r}, ${g}, ${b}, 0.5))`);

            // Update text shadow effects
            document.documentElement.style.setProperty('--text-glow',
                `0 0 10px rgba(${r}, ${g}, ${b}, 0.5)`);
        }
    }
}

// AlpineJS component for main tracker table
function trackerTable() {
    return {
        trackers: [],
        search: '',
        sortColumn: '',
        sortDirection: 'asc',
        tooltip: {
            show: false,
            text: '',
            x: 0,
            y: 0
        },
        get filteredTrackers() {
            let filtered = this.trackers;

            if (this.search) {
                const s = this.search.toLowerCase();
                filtered = this.trackers.filter(tracker =>
                    Object.values(tracker).some(v => String(v).toLowerCase().includes(s))
                );
            }

            if (this.sortColumn) {
                filtered.sort((a, b) => {
                    let aVal = a[this.sortColumn] || '';
                    let bVal = b[this.sortColumn] || '';

                    // Always put "-" values at the end regardless of sort direction
                    if (aVal === '-' && bVal !== '-') return 1;
                    if (bVal === '-' && aVal !== '-') return -1;
                    if (aVal === '-' && bVal === '-') return 0;

                    // Special handling for Mozilla Observatory grades
                    if (this.sortColumn === 'Observatory Grade') {
                        aVal = this.parseGrade(aVal);
                        bVal = this.parseGrade(bVal);
                    }
                    // Special handling for numeric values with commas (Users, Torrents, Peers)
                    else if (['Users', 'Torrents', 'Peers'].includes(this.sortColumn)) {
                        aVal = this.parseNumber(aVal);
                        bVal = this.parseNumber(bVal);
                    }
                    // Handle other numeric values
                    else if (!isNaN(aVal) && !isNaN(bVal) && aVal !== '' && bVal !== '') {
                        aVal = parseFloat(aVal);
                        bVal = parseFloat(bVal);
                    } else {
                        aVal = String(aVal).toLowerCase();
                        bVal = String(bVal).toLowerCase();
                    }

                    if (this.sortDirection === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }

            return filtered;
        },
        showTooltip(event, text) {
            const rect = event.target.getBoundingClientRect();
            this.tooltip.text = text;
            this.tooltip.x = rect.left + rect.width / 2;
            this.tooltip.y = rect.top - 10;
            this.tooltip.show = true;
        },
        hideTooltip() {
            this.tooltip.show = false;
        },
        parseNumber(value) {
            if (!value || value === '-' || value === 'N/A') return Number.NEGATIVE_INFINITY;
            // Remove commas and convert to number
            const cleaned = String(value).replace(/,/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) ? Number.NEGATIVE_INFINITY : num;
        },
        parseGrade(grade) {
            if (!grade || grade === '-' || grade === 'N/A') return Number.POSITIVE_INFINITY;

            // Remove spaces and convert to uppercase for consistent parsing
            const cleanGrade = String(grade).replace(/\s+/g, '').toUpperCase();

            const gradeMap = {
                'A+': 1,
                'A': 2,
                'A-': 3,
                'B+': 4,
                'B': 5,
                'B-': 6,
                'C+': 7,
                'C': 8,
                'C-': 9,
                'D+': 10,
                'D': 11,
                'D-': 12,
                'F': 13
            };

            return gradeMap[cleanGrade] || Number.POSITIVE_INFINITY;
        },
        sortBy(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
        },
        async init() {
            try {
                const res = await fetch('./trackers.json');
                const data = await res.json();
                this.trackers = data.trackers || [];
            } catch (error) {
                console.error('Error loading trackers:', error);
            }
        }
    }
}

// AlpineJS component for Jackett table
function jackettTable() {
    return {
        jackettTrackers: [],
        search: '',
        sortColumn: '',
        sortDirection: 'asc',
        get filteredJackettTrackers() {
            let filtered = this.jackettTrackers;

            if (this.search) {
                const s = this.search.toLowerCase();
                filtered = this.jackettTrackers.filter(tracker =>
                    Object.values(tracker).some(v => String(v).toLowerCase().includes(s))
                );
            }

            if (this.sortColumn) {
                filtered.sort((a, b) => {
                    let aVal = a[this.sortColumn] || '';
                    let bVal = b[this.sortColumn] || '';
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();

                    if (this.sortDirection === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }

            return filtered;
        },
        sortJackettBy(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
        },
        async init() {
            try {
                const res = await fetch('./trackers2.json');
                const data = await res.json();
                this.jackettTrackers = data.trackers || [];
            } catch (error) {
                console.error('Error loading Jackett trackers:', error);
            }
        }
    }
}
