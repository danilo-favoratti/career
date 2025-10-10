# 📊 Career Contribution Graph

A GitHub-style contribution graph visualizing career timeline with years (1997-2025) horizontally and months vertically, featuring dynamic sizing, interactive tooltips, and 10 activity levels.

## 🚀 Getting Started

### Simple Setup - No Dependencies Required!

This is a pure HTML/CSS/JavaScript application that runs directly in any modern web browser.

1. **Open the page:**
   - Simply open `index.html` in your web browser
   - Or serve it from any web server (Apache, Nginx, GitHub Pages, etc.)

2. **That's it!** 🎉
   - No Node.js installation required
   - No build process needed
   - No package management

## 🌐 Data Source

The application loads career data from: `https://favoratti.com/career/data.json`

This makes the app portable - you can host the HTML file anywhere and it will always load the same data!

## 🎯 Features

### 📊 **Visualization**
- **Years**: 1997-2025 (horizontal axis) 
- **Months**: Jan-Dec (vertical axis)
- **Dynamic square sizing** based on screen height
- **GitHub-style color scheme** with **10 activity levels** (0-9)
- **Centered layout** with responsive design

### 🎨 **Interactions**
- **Hover tooltips** showing month, year, and detailed activities
- **Yellow highlighting** of month and year labels on hover
- **Keyboard navigation** with arrow keys
- **Horizontal scrolling** when content is wider than screen
- **Filter checkboxes** to show/hide different activity types

### 📱 **Responsive Design**
- **Auto-centering** when content fits the screen
- **Page-level scrolling** for wide content
- **Dynamic margins** (10vh top/bottom)
- **Mobile-friendly** touch interactions

### 🏷️ **Activity Categories**
- **Study** - Educational background
- **Work** - Employment history  
- **Client Projects** - Professional client work
- **Side Projects** - Personal development projects
- **Own Projects** - Entrepreneurial ventures
- **Freelancer** - Freelance work
- **GAP Year** - Career breaks

## 📁 Project Structure

```
├── index.html          # Main HTML file - just open this!
├── style.css           # Styles and responsive design
├── script.js           # Interactive functionality  
├── data.json           # Sample data structure (for reference)
└── README.md          # This file
```

## 🎛️ Configuration

### Data Structure
The remote `data.json` file contains career data with this structure:
```json
{
  "config": {
    "startYear": 1997,
    "endYear": 2025
  },
  "data": [
    {
      "type": "Work",
      "data": [
        {
          "name": "Android Senior Developer",
          "company": "Meta",
          "dates": [
            { "start": "Aug-2025", "end": null }
          ]
        }
      ]
    }
  ]
}
```

### Activity Levels (10 Levels)
- **Level 0**: No activity (dark)
- **Level 1-2**: Low activity (dark green shades)
- **Level 3-5**: Medium activity (green shades)
- **Level 6-8**: High activity (bright green shades)
- **Level 9**: Maximum activity (light blue-green)

### Customization
- **Data source**: Change the URL in `script.js` line 48
- **Colors**: Update CSS `.level-0` through `.level-9` classes
- **Years range**: Modify in the remote `data.json` config section
- **Square constraints**: Adjust min/max sizes in `calculateSquareSize()`

## 🌍 Deployment Options

### Static Hosting (Recommended)
- **GitHub Pages**: Just push to a repo and enable Pages
- **Netlify**: Drag and drop the files  
- **Vercel**: Deploy with zero configuration
- **Any web server**: Upload files to public folder

### Local Development
- **Simple**: Open `index.html` directly in browser
- **With server**: Use any local server (Live Server, Python's `http.server`, etc.)

## 📊 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎨 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Flexbox, CSS Grid, CSS Custom Properties
- **Interactions**: DOM API, Fetch API, Event Listeners
- **No frameworks**: Pure vanilla implementation
- **No build tools**: Direct browser execution

## 🔧 Key Features

### 🎯 **10-Level Activity System**
More granular representation than GitHub's 5 levels:
- 1 contribution = Level 1
- 2 contributions = Level 2  
- 3 contributions = Level 3
- 4 contributions = Level 4
- 5 contributions = Level 5
- 6-7 contributions = Level 6
- 8-10 contributions = Level 7
- 11-15 contributions = Level 8
- 16+ contributions = Level 9

### 📱 **Fully Responsive**
- Auto-adjusts square sizes based on screen height
- Horizontal scrolling for wide timelines
- Touch-friendly mobile interactions
- Centered layout with optimal spacing

---

**🚀 Just open `index.html` and start exploring your career timeline!**

Made with ❤️ for visualizing professional journeys