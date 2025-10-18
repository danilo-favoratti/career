// 📊 Years & Months Contribution Graph JavaScript

class ContributionGraph {
    constructor() {
        this.startYear = 1990; // Default fallback
        this.endYear = 2025;   // Default fallback
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.monthsShort = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        this.contributionData = {};
        this.rawData = [];
        this.activeFilters = new Set();
        this.tooltip = document.getElementById('tooltip');
        this.squareSize = 15; // Default size
        this.needsHorizontalScroll = true;
        
        this.init();
    }
    
    async init() {
        await this.loadRealData();
        this.generateContributionData();
        this.createFilterCheckboxes();
        this.calculateSquareSize();
        this.createYearLabels();
        this.createContributionGrid();
        this.setupEventListeners();
        this.setupResizeListener();
        
        // Set initial month label heights
        this.updateSquareSizes();
        
        // Scroll to recent years (2020s) only if horizontal scroll is needed
        setTimeout(() => {
            if (this.needsHorizontalScroll) {
                this.scrollToRecentYears();
            }
        }, 100);
    }
    
    async loadRealData() {
        try {
            // Try to load from remote URL first
            let response;
            let jsonData;
            
            try {
                response = await fetch('https://favoratti.com/career/data.json');
                jsonData = await response.json();
            } catch (corsError) {
                console.warn('⚠️ CORS error loading remote data, falling back to local data.json');
                // Fallback to local file
                response = await fetch('./data.json');
                jsonData = await response.json();
            }
            
            // Extract configuration if available
            if (jsonData.config) {
                this.startYear = jsonData.config.startYear || this.startYear;
                this.endYear = jsonData.config.endYear || this.endYear;
                console.log(`📅 Using configured years: ${this.startYear} - ${this.endYear}`);
            }
            
            // Extract data array
            this.rawData = jsonData.data || jsonData; // Support both new and old format
            
            // Initialize all active filters
            this.rawData.forEach(category => {
                this.activeFilters.add(category.type);
            });
            
            console.log('📊 Loaded real data:', this.rawData);
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            this.rawData = [];
        }
    }
    
    generateContributionData() {
        // Initialize empty contribution data
        for (let year = this.startYear; year <= this.endYear; year++) {
            this.contributionData[year] = {};
            for (let month = 0; month < 12; month++) {
                this.contributionData[year][month] = {
                    level: 0,
                    count: 0,
                    activities: []
                };
            }
        }
        
        // Process real data
        this.rawData.forEach(category => {
            if (!this.activeFilters.has(category.type)) return;
            
            category.data.forEach(item => {
                item.dates.forEach(dateRange => {
                    this.addContributions(dateRange.start, dateRange.end, item.name, category.type);
                });
            });
        });
        
        // Calculate levels based on contribution counts (0-9)
        for (let year = this.startYear; year <= this.endYear; year++) {
            for (let month = 0; month < 12; month++) {
                const data = this.contributionData[year][month];
                if (data.count === 0) {
                    data.level = 0;
                } else if (data.count === 1) {
                    data.level = 1;
                } else if (data.count === 2) {
                    data.level = 2;
                } else if (data.count === 3) {
                    data.level = 3;
                } else if (data.count === 4) {
                    data.level = 4;
                } else if (data.count === 5) {
                    data.level = 5;
                } else if (data.count <= 7) {
                    data.level = 6;
                } else if (data.count <= 10) {
                    data.level = 7;
                } else if (data.count <= 15) {
                    data.level = 8;
                } else {
                    data.level = 9;
                }
            }
        }
    }
    
    addContributions(startDate, endDate, activityName, activityType) {
        const start = this.parseDate(startDate);
        const end = endDate === null ? { year: this.endYear, month: 11 } : this.parseDate(endDate); // null = Dec of endYear
        
        if (endDate === null) {
            console.log(`🔄 Ongoing activity: ${activityName} (${activityType}) - ends Dec ${this.endYear}`);
        }
        
        if (!start || !end) return;
        
        let currentYear = start.year;
        let currentMonth = start.month;
        
        while (currentYear < end.year || (currentYear === end.year && currentMonth <= end.month)) {
            if (currentYear >= this.startYear && currentYear <= this.endYear) {
                const data = this.contributionData[currentYear][currentMonth];
                data.count++;
                data.activities.push({
                    name: activityName,
                    type: activityType
                });
            }
            
            // Move to next month
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    }
    
    parseDate(dateString) {
        // Parse "Jan-1990" format
        const [monthStr, yearStr] = dateString.split('-');
        const monthIndex = this.monthsShort.indexOf(monthStr);
        const year = parseInt(yearStr);
        
        if (monthIndex === -1 || isNaN(year)) {
            console.warn('Invalid date format:', dateString);
            return null;
        }
        
        return { year, month: monthIndex };
    }
    
    highlightLabels(year, month) {
        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight month label
        const monthLabels = document.querySelectorAll('.month-label');
        if (monthLabels[month]) {
            monthLabels[month].classList.add('highlighted');
        }
        
        // Highlight year label
        const yearIndex = parseInt(year) - this.startYear;
        const yearLabels = document.querySelectorAll('.year-label');
        if (yearLabels[yearIndex]) {
            yearLabels[yearIndex].classList.add('highlighted');
        }
    }
    
    clearHighlights() {
        // Remove highlights from labels only
        document.querySelectorAll('.month-label.highlighted').forEach(label => {
            label.classList.remove('highlighted');
        });
        document.querySelectorAll('.year-label.highlighted').forEach(label => {
            label.classList.remove('highlighted');
        });
    }
    
    
    createFilterCheckboxes() {
        const container = document.getElementById('filterCheckboxes');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Get unique types from raw data
        const types = [...new Set(this.rawData.map(item => item.type))];
        
        types.forEach(type => {
            const filterItem = document.createElement('div');
            filterItem.className = 'filter-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-${type}`;
            checkbox.checked = this.activeFilters.has(type);
            
            const label = document.createElement('label');
            label.htmlFor = `filter-${type}`;
            label.textContent = type;
            
            // Add event listener for filtering
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.activeFilters.add(type);
                } else {
                    this.activeFilters.delete(type);
                }
                
                // Regenerate data and update visualization
                this.generateContributionData();
                this.updateContributionGrid();
                
                console.log(`🎯 Filter ${type}: ${e.target.checked ? 'ON' : 'OFF'}`);
            });
            
            filterItem.appendChild(checkbox);
            filterItem.appendChild(label);
            container.appendChild(filterItem);
        });
    }
    
    updateContributionGrid() {
        // Update existing squares with new data
        const squares = document.querySelectorAll('.contribution-square');
        squares.forEach((square, index) => {
            const year = parseInt(square.dataset.year);
            const month = parseInt(square.dataset.month);
            const data = this.contributionData[year][month];
            
            // Remove old level classes
            square.className = square.className.replace(/level-\d/g, '');
            
            // Add new level class
            square.classList.add(`level-${data.level}`);
            
            // Update data attributes
            square.dataset.count = data.count;
            square.dataset.level = data.level;
        });
    }
    
    calculateSquareSize() {
        // Use a fixed, larger square size for consistency
        const isMobile = window.innerWidth <= 768;
        
        // Set consistent square sizes
        if (isMobile) {
            this.squareSize = 16; // Good size for mobile
        } else {
            this.squareSize = 32; // Larger, consistent size for desktop
        }
        
        // Check if horizontal scroll is needed
        this.checkHorizontalScrollNeed();
        
        console.log(`📐 Fixed square size: ${this.squareSize}px`);
    }
    
    updateSquareSizes() {
        const squares = document.querySelectorAll('.contribution-square');
        squares.forEach(square => {
            square.style.width = `${this.squareSize}px`;
            square.style.height = `${this.squareSize}px`;
        });
        
        // Update year label spacing to match squares
        const yearLabels = document.querySelectorAll('.year-label');
        yearLabels.forEach(label => {
            label.style.width = `${this.squareSize}px`;
            label.style.marginRight = '2px';
        });
        
        // Update month label height to match squares with consistent spacing
        const monthLabels = document.querySelectorAll('.month-label');
        monthLabels.forEach(label => {
            label.style.height = `${this.squareSize}px`;
            label.style.marginBottom = '2px';
        });
        
        // Align month labels with contribution grid
        this.alignMonthLabels();
    }
    
    alignMonthLabels() {
        const yearLabels = document.querySelector('.year-labels');
        const monthLabelsContainer = document.querySelector('.month-labels');
        
        if (yearLabels && monthLabelsContainer) {
            // Get the actual height of year labels + minimal margin
            const yearLabelsHeight = yearLabels.offsetHeight + 2; // Reduced from +10 to +2
            monthLabelsContainer.style.marginTop = `${yearLabelsHeight}px`;
        }
    }
    
    checkHorizontalScrollNeed() {
        const graphScroll = document.querySelector('.graph-scroll');
        const monthLabels = document.querySelector('.month-labels');
        
        if (!graphScroll || !monthLabels) return;
        
        // Calculate total content width
        const yearsCount = this.endYear - this.startYear + 1;
        const squareWidth = this.squareSize + 3; // square + margin
        const contentWidth = yearsCount * squareWidth;
        const yearLabelsHeight = 30;
        
        // Available width for content
        const containerWidth = graphScroll.clientWidth;
        
        // Check if we need horizontal scroll
        this.needsHorizontalScroll = contentWidth > containerWidth;
        
        // Apply centering if no scroll needed
        this.applyCentering();
    }
    
    applyCentering() {
        // Page-level scrolling is now handled by CSS
        // No need to manage overflow on individual elements
        if (this.needsHorizontalScroll) {
            // Content is wider than screen - page will scroll horizontally
            document.body.style.overflowX = 'auto';
        } else {
            // Content fits - no horizontal scroll needed
            document.body.style.overflowX = 'hidden';
        }
    }
    
    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateSquareSize();
                this.updateSquareSizes();
                // Only scroll to recent years if horizontal scroll is needed
                if (this.needsHorizontalScroll) {
                    setTimeout(() => this.scrollToRecentYears(), 50);
                }
            }, 100);
        });
    }
    
    scrollToRecentYears() {
        const targetYear = 2020;
        const yearIndex = targetYear - this.startYear;
        const scrollPosition = yearIndex * (this.squareSize + 3); // square size + margin
        
        // Scroll the entire page horizontally
        window.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
    
    createYearLabels() {
        const yearLabelsContainer = document.getElementById('yearLabels');
        
        for (let year = this.startYear; year <= this.endYear; year++) {
            const yearLabel = document.createElement('div');
            yearLabel.className = 'year-label';
            
            // Set dynamic width to match squares
            yearLabel.style.width = `${this.squareSize}px`;
            yearLabel.style.marginRight = '3px';
            
            // Show all years, but highlight major ones
            yearLabel.textContent = year.toString();
            
            // Highlight major years (decades)
            if (year % 10 === 0) {
                yearLabel.classList.add('major');
            }
            
            yearLabelsContainer.appendChild(yearLabel);
        }
    }
    
    createContributionGrid() {
        const gridContainer = document.getElementById('contributionGrid');
        
        // Create 12 rows (one for each month)
        for (let month = 0; month < 12; month++) {
            const monthRow = document.createElement('div');
            monthRow.className = 'month-row';
            
            // Create squares for each year
            for (let year = this.startYear; year <= this.endYear; year++) {
                const square = document.createElement('div');
                square.className = 'contribution-square';
                
                const data = this.contributionData[year][month];
                square.classList.add(`level-${data.level}`);
                
                // Add data attributes for tooltip
                square.dataset.year = year;
                square.dataset.month = month;
                square.dataset.count = data.count;
                square.dataset.level = data.level;
                
                // Set dynamic size
                square.style.width = `${this.squareSize}px`;
                square.style.height = `${this.squareSize}px`;
                
                // Make it focusable for accessibility
                square.tabIndex = 0;
                
                monthRow.appendChild(square);
            }
            
            gridContainer.appendChild(monthRow);
        }
    }
    
    setupEventListeners() {
        const squares = document.querySelectorAll('.contribution-square');
        
        squares.forEach(square => {
            // Mouse events
            square.addEventListener('mouseenter', (e) => this.showTooltip(e));
            square.addEventListener('mouseleave', () => this.hideTooltip());
            square.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            
            // Keyboard events for accessibility
            square.addEventListener('focus', (e) => this.showTooltip(e));
            square.addEventListener('blur', () => this.hideTooltip());
            
            // Click event for additional interactions
            square.addEventListener('click', (e) => this.onSquareClick(e));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }
    
    showTooltip(event) {
        const square = event.target;
        const year = square.dataset.year;
        const month = parseInt(square.dataset.month);
        const count = parseInt(square.dataset.count);
        const level = square.dataset.level;
        
        const monthName = this.months[month];
        const data = this.contributionData[year][month];
        
        let tooltipContent = `<strong>${monthName} ${year}</strong><br>`;
        
        if (count === 0) {
            tooltipContent += 'No activity';
        } else {
            tooltipContent += `${count} contribution${count > 1 ? 's' : ''}`;
            
            // Show activities if there are any
            if (data.activities && data.activities.length > 0) {
                tooltipContent += '<br><br>';
                const activityGroups = {};
                
                // Group activities by type
                data.activities.forEach(activity => {
                    if (!activityGroups[activity.type]) {
                        activityGroups[activity.type] = [];
                    }
                    activityGroups[activity.type].push(activity.name);
                });
                
                // Display grouped activities
                Object.keys(activityGroups).forEach(type => {
                    tooltipContent += `<div style="margin-bottom: 4px;">`;
                    tooltipContent += `<strong style="color: #58a6ff;">${type}:</strong><br>`;
                    activityGroups[type].forEach(name => {
                        tooltipContent += `• ${name}<br>`;
                    });
                    tooltipContent += `</div>`;
                });
            }
        }
        
        this.tooltip.innerHTML = tooltipContent;
        
        // Highlight corresponding month and year labels
        this.highlightLabels(year, month);
        
        this.updateTooltipPosition(event);
        this.tooltip.classList.add('show');
    }
    
    hideTooltip() {
        this.tooltip.classList.remove('show');
        // Remove all highlights
        this.clearHighlights();
    }
    
    updateTooltipPosition(event) {
        // Simple, reliable positioning
        this.tooltip.style.left = `${event.pageX + 10}px`;
        this.tooltip.style.top = `${event.pageY - 40}px`;
    }
    
    onSquareClick(event) {
        const square = event.target;
        const year = square.dataset.year;
        const month = parseInt(square.dataset.month);
        
        // Add a subtle click animation
        square.style.transform = 'scale(0.9)';
        setTimeout(() => {
            square.style.transform = '';
        }, 150);
        
        // You can add more interactive features here
        console.log(`Clicked: ${this.months[month]} ${year}`);
    }
    
    handleKeyNavigation(event) {
        const focusedElement = document.activeElement;
        if (!focusedElement.classList.contains('contribution-square')) return;
        
        const squares = Array.from(document.querySelectorAll('.contribution-square'));
        const currentIndex = squares.indexOf(focusedElement);
        let newIndex = currentIndex;
        
        const yearsCount = this.endYear - this.startYear + 1;
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = Math.min(squares.length - 1, currentIndex + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                newIndex = Math.max(0, currentIndex - yearsCount);
                break;
            case 'ArrowDown':
                event.preventDefault();
                newIndex = Math.min(squares.length - 1, currentIndex + yearsCount);
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = squares.length - 1;
                break;
        }
        
        if (newIndex !== currentIndex) {
            squares[newIndex].focus();
            
            // Scroll into view if necessary (page-level scrolling)
            const targetSquare = squares[newIndex];
            const squareRect = targetSquare.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            if (squareRect.left < 0 || squareRect.right > viewportWidth) {
                targetSquare.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }
}

// 🚀 Initialize the contribution graph when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contributionGraph = new ContributionGraph();
    
    // Initialize timeline if the elements exist
    if (document.getElementById('timeline')) {
        new Timeline();
    }
});

// 🎯 Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add a subtle loading animation
    const squares = document.querySelectorAll('.contribution-square');
    squares.forEach((square, index) => {
        square.style.animationDelay = `${(index % 100) * 10}ms`;
    });
    
    // Add scroll position indicator for page-level scrolling
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        // Show current year range in console (for debugging)
        scrollTimeout = setTimeout(() => {
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const squareWidth = window.contributionGraph ? window.contributionGraph.squareSize + 3 : 18;
            const startYearIndex = Math.floor(scrollLeft / squareWidth);
            const endYearIndex = Math.min(35, startYearIndex + Math.floor(window.innerWidth / squareWidth));
            
            console.log(`📅 Viewing: ${1990 + startYearIndex} - ${1990 + endYearIndex}`);
        }, 500);
    });
});

// Timeline Class for the embedded timeline section
class Timeline {
    constructor() {
        this.data = [];
        this.activeFilters = new Set();
        this.allItems = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.createFilters();
        this.createTimeline();
        this.hideLoading();
        this.setupModalEventListeners();
    }

    async loadData() {
        try {
            // Try to load from remote URL first
            let response;
            let jsonData;
            
            try {
                response = await fetch('https://favoratti.com/career/data.json');
                jsonData = await response.json();
            } catch (corsError) {
                console.warn('⚠️ CORS error loading remote data, falling back to local data.json');
                // Fallback to local file
                response = await fetch('./data.json');
                jsonData = await response.json();
            }
            
            this.data = jsonData.data || jsonData;
            
            // Filter out Study and Work categories
            this.data = this.data.filter(category => 
                category.type !== 'Study' && category.type !== 'Work'
            );
            
            // Flatten all items with their categories
            this.allItems = [];
            this.data.forEach(category => {
                category.data.forEach(item => {
                    // Handle multiple date ranges
                    if (item.dates && item.dates.length > 0) {
                        item.dates.forEach(dateRange => {
                            this.allItems.push({
                                ...item,
                                type: category.type,
                                startDate: dateRange.start,
                                endDate: dateRange.end,
                                dateRange: dateRange
                            });
                        });
                    }
                });
            });

            // Sort by start date (newest first)
            this.allItems.sort((a, b) => {
                const dateA = this.parseDate(a.startDate);
                const dateB = this.parseDate(b.startDate);
                return dateB.year - dateA.year || dateB.month - dateA.month;
            });

            // Initialize all filters as active
            this.data.forEach(category => {
                this.activeFilters.add(category.type);
            });

            console.log('📊 Loaded timeline data:', this.allItems);
        } catch (error) {
            console.error('❌ Failed to load timeline data:', error);
            this.showError();
        }
    }

    parseDate(dateString) {
        const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [monthStr, yearStr] = dateString.split('-');
        return {
            month: monthsShort.indexOf(monthStr),
            year: parseInt(yearStr)
        };
    }

    formatDate(dateString) {
        if (!dateString) return 'Present';
        const [month, year] = dateString.split('-');
        return `${month} ${year}`;
    }

    createFilters() {
        const filtersContainer = document.getElementById('timelineFilters');
        if (!filtersContainer) return;
        
        const types = [...new Set(this.data.map(category => category.type))];

        types.forEach(type => {
            // Create filter item container (like activity filters)
            const filterItem = document.createElement('div');
            filterItem.className = 'filter-item';
            
            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `timeline-filter-${type.replace(/\s+/g, '-').toLowerCase()}`;
            checkbox.checked = true; // Start with all filters active
            checkbox.dataset.type = type;
            
            // Create label
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = type;
            
            // Add event listener
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    this.activeFilters.add(type);
                } else {
                    this.activeFilters.delete(type);
                }
                
                this.filterTimeline();
            });
            
            // Append elements
            filterItem.appendChild(checkbox);
            filterItem.appendChild(label);
            filtersContainer.appendChild(filterItem);
        });
    }

    createTimeline() {
        const timelineContainer = document.getElementById('timeline');
        if (!timelineContainer) return;
        
        this.allItems.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.dataset.type = item.type;
            
            const isOngoing = item.endDate === null;
            const startDate = this.formatDate(item.startDate);
            const endDate = this.formatDate(item.endDate);
            const dateRange = isOngoing ? `${startDate} - Present` : `${startDate} - ${endDate}`;
            
            const typeClass = item.type.toLowerCase().replace(/\s+/g, '-');
            
            const iconHtml = item.icon ? `<img src="${item.icon}" alt="${item.name}" class="timeline-icon" onerror="this.style.display='none'">` : '';
            
            const descriptionHtml = item.description ? `<div class="timeline-description">${item.description}</div>` : '';
            const linkHtml = item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="timeline-link">${item.link}</a>` : '';
            const tagsHtml = item.tags && item.tags.length > 0 ? `
                <div class="timeline-tags">
                    ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                </div>
            ` : '';
            const screenshots = item.screenshots || item.images || [];
            const screenshotsHtml = screenshots && screenshots.length > 0 ? `
                <div class="timeline-screenshots ${screenshots.length === 1 ? 'single-image' : screenshots.length === 2 ? 'two-images' : ''}">
                    ${screenshots.map((screenshot, idx) => `
                        <div class="timeline-screenshot" onclick="openScreenshotCarousel(${JSON.stringify(screenshots).replace(/"/g, '&quot;')}, ${idx}, '${item.name}')">
                            <img src="${screenshot}" alt="${item.name} Screenshot ${idx + 1}" loading="lazy">
                            <div class="timeline-screenshot-overlay">
                                <span>🔍 View Full Size</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '';
            
            timelineItem.innerHTML = `
                <div class="timeline-content ${isOngoing ? 'ongoing' : ''}">
                    <div class="timeline-header">
                        <div class="timeline-info">
                            ${iconHtml}
                            <div class="timeline-text">
                                <div class="timeline-title">${item.name}</div>
                                ${item.company ? `<div class="timeline-company">${item.company}</div>` : ''}
                                ${item.description ? `<div class="timeline-description-header">${item.description}</div>` : ''}
                                ${linkHtml}
                            </div>
                        </div>
                        <div class="timeline-dates">${dateRange}</div>
                    </div>
                    ${screenshotsHtml}
                    <div class="timeline-footer">
                        ${tagsHtml}
                        <div class="timeline-type type-${typeClass}">${item.type}</div>
                    </div>
                </div>
            `;

            timelineContainer.appendChild(timelineItem);
        });
    }

    filterTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach(item => {
            const type = item.dataset.type;
            
            if (this.activeFilters.has(type)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    hideLoading() {
        const loading = document.getElementById('timelineLoading');
        const timeline = document.getElementById('timeline');
        if (loading) loading.style.display = 'none';
        if (timeline) timeline.style.display = 'block';
    }

    showError() {
        const loading = document.getElementById('timelineLoading');
        const error = document.getElementById('timelineError');
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'block';
    }

    setupModalEventListeners() {
        // Modal event listeners
        const modal = document.getElementById('screenshotModal');
        const modalClose = document.getElementById('modalClose');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');
        
        if (modalClose) modalClose.addEventListener('click', closeScreenshotModal);
        if (modalPrev) modalPrev.addEventListener('click', prevModalSlide);
        if (modalNext) modalNext.addEventListener('click', nextModalSlide);
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeScreenshotModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    closeScreenshotModal();
                } else if (e.key === 'ArrowLeft') {
                    prevModalSlide();
                } else if (e.key === 'ArrowRight') {
                    nextModalSlide();
                }
            }
        });
    }
}

// Modal carousel state
let modalCarouselState = {
    images: [],
    currentSlide: 0,
    totalSlides: 0
};

// Screenshot modal functionality
function openScreenshotCarousel(images, startIndex = 0, projectName = '') {
    modalCarouselState.images = images;
    modalCarouselState.currentSlide = startIndex;
    modalCarouselState.totalSlides = images.length;

    const modal = document.getElementById('screenshotModal');
    const track = document.getElementById('modalCarouselTrack');
    const indicators = document.getElementById('modalIndicators');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    if (!modal || !track || !indicators) return;

    // Generate carousel slides
    track.innerHTML = images.map((img, idx) => `
        <div class="modal-carousel-slide">
            <img src="${img}" alt="${projectName} Screenshot ${idx + 1}">
        </div>
    `).join('');

    // Generate indicators
    indicators.innerHTML = images.map((_, idx) => `
        <div class="modal-carousel-indicator ${idx === startIndex ? 'active' : ''}" onclick="goToModalSlide(${idx})"></div>
    `).join('');

    // Show/hide navigation for single images
    if (images.length > 1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        indicators.style.display = 'flex';
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        indicators.style.display = 'none';
    }

    // Set initial position
    updateModalCarousel();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateModalCarousel() {
    const track = document.getElementById('modalCarouselTrack');
    const indicators = document.querySelectorAll('.modal-carousel-indicator');
    
    if (track) {
        track.style.transform = `translateX(-${modalCarouselState.currentSlide * 100}%)`;
    }
    
    indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === modalCarouselState.currentSlide);
    });
}

function nextModalSlide() {
    modalCarouselState.currentSlide = (modalCarouselState.currentSlide + 1) % modalCarouselState.totalSlides;
    updateModalCarousel();
}

function prevModalSlide() {
    modalCarouselState.currentSlide = modalCarouselState.currentSlide === 0 ? 
        modalCarouselState.totalSlides - 1 : modalCarouselState.currentSlide - 1;
    updateModalCarousel();
}

function goToModalSlide(slideIndex) {
    modalCarouselState.currentSlide = slideIndex;
    updateModalCarousel();
}

function closeScreenshotModal() {
    const modal = document.getElementById('screenshotModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

