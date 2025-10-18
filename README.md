# 📊 Career Contribution Graph

A GitHub-style contribution graph visualizing career timeline with years (1997-2025) horizontally and months vertically, featuring dynamic sizing, interactive tooltips, and 10 activity levels.

## 🚀 Getting Started

### Option 1: Simple Setup - No Dependencies Required!

This is a pure HTML/CSS/JavaScript application that runs directly in any modern web browser.

1. **Open the page:**
   - Simply open `index.html` in your web browser
   - Or serve it from any web server (Apache, Nginx, GitHub Pages, etc.)

2. **That's it!** 🎉
   - No Node.js installation required
   - No build process needed
   - No package management

### Option 2: Node.js Server (Recommended for Development) 🔧

For enhanced development experience with API endpoints and hot reload:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   # Production mode
   npm start
   
   # Development mode with hot reload
   npm run dev
   ```

3. **Access the application:**
   - 🏠 Main app: `http://localhost:5050`
   - ⏰ Timeline view: `http://localhost:5050/timeline.html`
   - 📊 API data: `http://localhost:5050/api/data`

## 🌐 Data Source

The application loads career data from: `https://favoratti.com/career/data.json`

This makes the app portable - you can host the HTML file anywhere and it will always load the same data!

## 🎯 Features

### 📊 **Main Contribution Graph (index.html)**
- **Years**: 1997-2025 (horizontal axis) 
- **Months**: Jan-Dec (vertical axis)
- **Dynamic square sizing** based on screen height
- **GitHub-style color scheme** with **10 activity levels** (0-9)
- **Centered layout** with responsive design

### ⏰ **Timeline View (timeline.html)** - NEW! 
- **Chronological timeline** with metro-style design
- **Interactive filtering** by project type
- **Rich project cards** with icons, descriptions, and tags
- **Screenshot galleries** with modal carousel viewer
- **Responsive mobile design** with touch interactions
- **GitHub-style dark theme** with smooth animations

### 🎨 **Interactions**
- **Hover tooltips** showing month, year, and detailed activities
- **Yellow highlighting** of month and year labels on hover
- **Keyboard navigation** with arrow keys
- **Horizontal scrolling** when content is wider than screen
- **Filter checkboxes** to show/hide different activity types
- **Modal image viewer** with carousel navigation (timeline view)

### 📱 **Responsive Design**
- **Auto-centering** when content fits the screen
- **Page-level scrolling** for wide content
- **Dynamic margins** (10vh top/bottom)
- **Mobile-friendly** touch interactions
- **Adaptive layouts** for both grid and timeline views

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
├── index.html          # 📊 Main contribution graph view
├── timeline.html       # ⏰ Timeline/project view (NEW!)
├── style.css           # 🎨 Styles and responsive design
├── script.js           # ⚡ Interactive functionality  
├── server.js           # 🔧 Express.js server (NEW!)
├── package.json        # 📦 Node.js dependencies (NEW!)
├── data.json           # 📋 Sample data structure (for reference)
├── images/             # 🖼️ Project icons and screenshots
│   ├── screenshots/    # 📸 Project screenshot gallery
│   └── *.png          # 🏢 Company/project icons
└── README.md          # 📖 This file
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

### Static Hosting (Recommended for Production)
- **GitHub Pages**: Just push to a repo and enable Pages
- **Netlify**: Drag and drop the files  
- **Vercel**: Deploy with zero configuration
- **Any web server**: Upload files to public folder

### Node.js Hosting (For API Features)
- **Heroku**: `git push heroku main` with Procfile
- **Railway**: Connect GitHub repo for auto-deploy
- **DigitalOcean App Platform**: Node.js app deployment
- **AWS/GCP/Azure**: Container or serverless deployment

### Local Development
- **Simple**: Open `index.html` directly in browser
- **With Node.js**: Use `npm start` or `npm run dev` for full features
- **With server**: Use any local server (Live Server, Python's `http.server`, etc.)

## 🔌 API Endpoints (Node.js Mode)

When running with the Node.js server, these endpoints are available:

- **`GET /`** - Serves the main contribution graph (`index.html`)
- **`GET /timeline.html`** - Serves the timeline view
- **`GET /api/data`** - Returns career data as JSON
- **Static files** - All assets served automatically

## 📊 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎨 Technologies Used

### Frontend
- **HTML5, CSS3, Vanilla JavaScript** - Core web technologies
- **Flexbox, CSS Grid** - Modern layout systems
- **CSS Custom Properties** - Dynamic theming
- **DOM API, Fetch API** - Native browser APIs
- **No frameworks** - Pure vanilla implementation

### Backend (Optional)
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **Static file serving** - Automatic asset delivery
- **JSON API** - RESTful data endpoints

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

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd <your-project>

# Option 1: Direct browser (no setup)
open index.html

# Option 2: Node.js server
npm install
npm start          # Production mode
npm run dev        # Development with hot reload
```

**🎯 Two ways to explore your career:**
- **📊 Grid View**: Open `index.html` - GitHub-style contribution graph
- **⏰ Timeline View**: Visit `/timeline.html` - Detailed project timeline

Made with ❤️ for visualizing professional journeys