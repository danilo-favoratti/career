const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 📁 Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// 📊 API endpoint to serve data.json
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync('./data.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data.json:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// 🏠 Serve the main HTML file for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`🎯 Contribution Graph Server running at:`);
    console.log(`📱 Local:   http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log(`\n📊 Available endpoints:`);
    console.log(`   GET /        - Main application`);
    console.log(`   GET /api/data - JSON data endpoint`);
    console.log(`\n🎨 Features:`);
    console.log(`   ✅ Static file serving`);
    console.log(`   ✅ API endpoint for data`);
    console.log(`   ✅ Hot reload ready (use npm run dev)`);
});

// 🔧 Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 Server shutting down gracefully...');
    process.exit(0);
});
