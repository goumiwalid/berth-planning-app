# 🚢 Vessel Berth Scheduler

A modern, web-based vessel scheduling application designed for port operators and terminal planners. This app provides an intuitive berth-based Gantt timeline for managing vessel calls, berth assignments, and terminal operations.

## ✨ Features

### 🎯 Core Functionality
- **Vessel Management**: Add, edit, and delete vessel calls with comprehensive details
- **Berth-Based Timeline**: Interactive Gantt chart showing vessels assigned to specific berths
- **Terminal Filtering**: Filter timeline and vessel table by terminal
- **Drag & Drop**: Move vessels between berths and time slots with visual feedback
- **Real-time Validation**: Automatic checking for berth capacity vs vessel LOA

### 📅 Timeline Views
- **Hourly Display**: Day view shows precise hourly scheduling (00:00, 01:00, 02:00, etc.)
- **Multiple Scales**: Switch between daily, weekly, and monthly views
- **Visual Indicators**: Color-coded vessel types and berth length visualization
- **Interactive Controls**: Zoom, pan, and navigate timeline with ease

### 🏗️ Berth Management
- **Visual Length Representation**: Berths displayed with proportional length indicators (1m = 2px)
- **Capacity Validation**: Prevents oversized vessels from being assigned to inadequate berths
- **Multi-Terminal Support**: Manage multiple terminals with different berth configurations

### 📊 Data Features
- **Comprehensive Vessel Data**: Voyage numbers, ETA/ETD, LOA, draft, operators, routes
- **Export Capabilities**: Future support for PDF and CSV exports
- **Sample Data**: Pre-loaded with realistic vessel scheduling examples

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Timeline Library**: [vis.js Timeline](https://visjs.github.io/vis-timeline/)
- **Data Storage**: Browser localStorage (development phase)
- **Architecture**: Client-side SPA with modular JavaScript

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vessel-berth-scheduler
   ```

2. **Open the application**
   
   **Option A: Direct file opening**
   ```bash
   open index.html
   ```
   
   **Option B: Local server (recommended)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have it)
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then navigate to `http://localhost:8000`

### Usage

1. **Add Vessel Calls**: Use the form to create new vessel schedules
2. **View Timeline**: Switch between day/week/month views using the dropdown
3. **Filter by Terminal**: Use the terminal filter to focus on specific areas
4. **Drag & Drop**: Move vessels between berths by dragging timeline items
5. **Edit Vessels**: Double-click timeline items or use table edit buttons

## 📁 Project Structure

```
vessel-berth-scheduler/
├── index.html              # Main application entry point
├── styles/
│   └── main.css            # Application styles and vis.js customizations
├── scripts/
│   ├── app.js              # Main application logic and UI management
│   ├── vessel-manager.js   # Vessel CRUD operations and data management
│   └── vis-timeline.js     # Timeline component and interaction handling
├── data/
│   └── mock-terminals.json # Terminal configuration data
├── CLAUDE.md               # Development notes and specifications
└── README.md               # This file
```

## 🎮 Key Interactions

### Vessel Form
- **Auto-validation**: Real-time field validation with visual feedback
- **Smart Dropdowns**: Berth options update based on selected terminal
- **Edit Mode**: Click edit buttons to modify existing vessels

### Timeline Interface
- **Mouse Controls**: Zoom with scroll wheel, pan by dragging
- **Context Menu**: Right-click vessels for edit/delete options
- **Scale Controls**: Use toolbar buttons for zoom and view changes
- **Touch Support**: Basic touch interactions for tablet use

### Table View
- **Sortable Columns**: Click headers to sort vessel data
- **Action Buttons**: Direct edit/delete access from table rows
- **Synchronized Filtering**: Table updates with timeline filter changes

## 🔧 Development

### Sample Data Generation
The app includes a sample data generator accessible via browser console:
```javascript
// Generate sample vessel data
generateSampleData()

// Reset app with fresh data
resetApp()

// Clear all data
clearAllData()
```

### Browser Console Functions
- `window.vesselManager` - Direct access to vessel management
- `window.visTimeline` - Timeline component instance
- Various utility functions for testing and debugging

## 🎨 Customization

### Adding New Terminals
Modify `data/mock-terminals.json` or update the berths object in `scripts/app.js`:

```javascript
berths = {
    "new-terminal": [
        { id: "new-term-berth1", name: "Berth X1", length: 300, terminal: "new-terminal" }
    ]
};
```

### Styling
- Main styles in `styles/main.css`
- vis.js timeline customizations included
- CSS custom properties for berth length visualization

## 🚧 Future Development

### Planned Features
- **Backend Integration**: Database storage and API development
- **Multi-user Support**: Real-time collaboration and user roles
- **Advanced Validation**: Tidal constraints and operational rules
- **Export Functions**: PDF reports and data export capabilities
- **Mobile Optimization**: Enhanced mobile and tablet experience

### Technical Roadmap
- Migration to modern framework (React/Vue)
- Backend API development (Node.js/Supabase)
- Real-time synchronization
- TOS system integration capabilities

## 📝 License

This project is in development. License details to be determined.

## 🤝 Contributing

This is currently a personal development project. Contribution guidelines will be established as the project evolves.

## 📞 Support

For questions or issues during development, refer to the `CLAUDE.md` file for detailed development notes and specifications.

---

**Status**: Active Development | **Version**: MVP v1.0 | **Last Updated**: 2024