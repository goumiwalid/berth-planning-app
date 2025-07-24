/**
 * VisTimeline Class
 * Manages vis.js Timeline for vessel scheduling
 * Provides interactive drag & drop, zoom, and vessel management
 */
class VisTimeline {
    constructor(vesselManager, terminals) {
        this.vesselManager = vesselManager;
        this.terminals = terminals;
        this.timelineContainer = null;
        this.timeline = null;
        this.isInitialized = false;
        this.isExpanded = true; // Timeline starts expanded
        this.contextMenu = null;
        this.selectedVesselId = null;
        this.currentTerminalFilter = ''; // Track current filter
        
        // Timeline data
        this.groups = new vis.DataSet();
        this.items = new vis.DataSet();
    }

    /**
     * Initialize the vis.js Timeline
     */
    init() {
        try {
            this.timelineContainer = document.getElementById('timeline-container');
            if (!this.timelineContainer) {
                console.error('Timeline container not found');
                return false;
            }

            // Initialize groups (terminals)
            this.initializeGroups();
            
            // Configure timeline options
            const options = this.getTimelineOptions();
            
            // Create timeline
            this.timeline = new vis.Timeline(this.timelineContainer, this.items, this.groups, options);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize context menu
            this.initializeContextMenu();
            
            // Load vessel data
            this.loadVesselData();
            
            this.isInitialized = true;
            console.log('vis.js Timeline initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing vis.js Timeline:', error);
            return false;
        }
    }

    /**
     * Initialize berth groups
     */
    initializeGroups() {
        // Get all berths from the global berths object
        const allBerths = window.getFilteredBerths ? window.getFilteredBerths(this.currentTerminalFilter) : [];
        
        const groupsData = allBerths.map(berth => ({
            id: berth.id,
            content: `${berth.name} - ${berth.length}m`,
            className: `berth-group berth-length-${berth.length}`,
            style: `--berth-length: ${berth.length * 2}px`, // 1m = 2px scaling
            subgroupOrder: 'order'
        }));
        
        console.log('🏗️ Initializing berth groups:', groupsData);
        
        this.groups.clear();
        this.groups.add(groupsData);
    }

    /**
     * Get timeline configuration options
     */
    getTimelineOptions() {
        return {
            // Time axis configuration
            orientation: 'top',
            start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
            
            // Interaction settings
            editable: {
                add: false,         // Disable adding via timeline
                updateTime: true,   // Allow drag & drop time changes
                updateGroup: true,  // Allow moving between terminals
                remove: true        // Allow deletion
            },
            
            // Selection settings
            multiselect: false,
            selectable: true,
            
            // Timeline appearance
            height: '500px',
            margin: {
                item: {
                    horizontal: 10,
                    vertical: 5
                }
            },
            
            // Zoom settings
            zoomMin: 1000 * 60 * 60,        // 1 hour
            zoomMax: 1000 * 60 * 60 * 24 * 31, // 1 month
            
            // Time axis configuration for hourly display
            timeAxis: {
                scale: 'hour',
                step: 1
            },
            
            // Force display of minor labels
            showMinorLabels: true,
            showMajorLabels: true,
            
            // Time format - enhanced for hour-based views
            format: {
                minorLabels: {
                    millisecond: 'SSS',
                    second: 'ss',
                    minute: 'HH:mm',
                    hour: 'HH:mm',
                    weekday: 'ddd D',
                    day: 'HH:mm',  // Show hours in day view
                    week: 'D',
                    month: 'MMM',
                    year: 'YYYY'
                },
                majorLabels: {
                    millisecond: 'HH:mm:ss',
                    second: 'D MMMM HH:mm',
                    minute: 'ddd D MMMM',
                    hour: 'ddd D MMMM',
                    weekday: 'MMMM YYYY',
                    day: 'ddd D MMMM YYYY',  // Show date in day view
                    week: 'MMMM YYYY',
                    month: 'YYYY',
                    year: ''
                }
            },
            
            // Tooltip settings
            tooltip: {
                followMouse: true,
                overflowMethod: 'cap'
            },
            
            // Group settings
            groupOrder: 'content',
            
            // Snap settings for better UX
            snap: function (date, scale, step) {
                const hour = 60 * 60 * 1000;
                return Math.round(date / hour) * hour;
            }
        };
    }

    /**
     * Setup event listeners for timeline interactions
     */
    setupEventListeners() {
        // Handle item updates (drag & drop)
        this.timeline.on('onMove', (item, callback) => {
            this.handleVesselUpdate(item, callback);
        });
        
        // Handle double-click to edit
        this.timeline.on('doubleClick', (properties) => {
            if (properties.item) {
                this.handleVesselEdit(properties.item);
            }
        });
        
        // Handle right-click context menu
        this.timeline.on('contextmenu', (properties) => {
            if (properties.item) {
                properties.event.preventDefault();
                this.showContextMenu(properties.event, properties.item);
            } else {
                this.hideContextMenu();
            }
        });
        
        // Handle selection for visual feedback
        this.timeline.on('select', (properties) => {
            if (properties.items.length > 0) {
                console.log('Selected vessel:', properties.items[0]);
            }
        });
        
        // Timeline control buttons
        const zoomInBtn = document.getElementById('timeline-zoom-in');
        const zoomOutBtn = document.getElementById('timeline-zoom-out');
        const scaleSelect = document.getElementById('timeline-scale');
        const todayBtn = document.getElementById('timeline-today');
        const toggleBtn = document.getElementById('timeline-toggle');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }
        
        if (scaleSelect) {
            scaleSelect.addEventListener('change', (e) => {
                this.changeScale(e.target.value);
                this.updateTimelineFormat(e.target.value);
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
        }
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        // Hide context menu on click elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.vessel-context-menu')) {
                this.hideContextMenu();
            }
        });
        
        // Hide context menu on timeline interaction
        this.timeline.on('click', () => {
            this.hideContextMenu();
        });
    }

    /**
     * Load vessel data into timeline
     */
    loadVesselData() {
        const vessels = this.vesselManager.getAllVessels();
        const timelineItems = this.convertVesselsToTimelineData(vessels);
        
        this.items.clear();
        this.items.add(timelineItems);
        
        // Auto-fit timeline if there are vessels
        if (vessels.length > 0) {
            setTimeout(() => {
                this.timeline.fit();
            }, 100);
        }
    }

    /**
     * Convert vessel data to vis.js Timeline format
     * @param {Array} vessels - Array of vessel objects
     * @returns {Array} Timeline items array
     */
    convertVesselsToTimelineData(vessels) {
        return vessels.map(vessel => {
            // Get berth information
            const berth = window.getBerthById ? window.getBerthById(vessel.berthId) : null;
            const berthName = berth ? berth.name : 'Unknown Berth';
            
            // Get terminal name
            const terminal = this.terminals.find(t => t.id === vessel.terminal);
            const terminalName = terminal ? terminal.name : vessel.terminal;
            
            // Create tooltip content
            const tooltipContent = this.createTooltipContent(vessel, terminalName, berthName);
            
            return {
                id: vessel.voyageNumber,
                group: vessel.berthId, // Use berth ID instead of terminal ID
                start: new Date(vessel.eta),
                end: new Date(vessel.etd),
                content: `${vessel.vesselName} (${vessel.loa}m)`, // Show vessel length
                title: tooltipContent,
                className: `vessel-item vessel-type-${vessel.vesselType.toLowerCase()}`,
                type: 'range',
                editable: {
                    updateTime: true,
                    updateGroup: true,
                    remove: true
                },
                // Store vessel data for easy access
                vesselData: vessel
            };
        });
    }

    /**
     * Create tooltip content for vessel
     * @param {Object} vessel - Vessel data
     * @param {string} terminalName - Terminal name
     * @param {string} berthName - Berth name
     * @returns {string} HTML tooltip content
     */
    createTooltipContent(vessel, terminalName, berthName) {
        const duration = Math.round((new Date(vessel.etd) - new Date(vessel.eta)) / (1000 * 60 * 60));
        
        return `
            <div class="timeline-tooltip">
                <h4>${vessel.vesselName}</h4>
                <p><strong>Voyage:</strong> ${vessel.voyageNumber}</p>
                <p><strong>Type:</strong> ${vessel.vesselType}</p>
                <p><strong>Terminal:</strong> ${terminalName}</p>
                <p><strong>Berth:</strong> ${berthName}</p>
                <p><strong>Operator:</strong> ${vessel.operator || 'Not specified'}</p>
                <p><strong>LOA:</strong> ${vessel.loa}m</p>
                <p><strong>Draft:</strong> ${vessel.draft}m</p>
                <p><strong>Duration:</strong> ${duration} hours</p>
                <p><strong>ETA:</strong> ${new Date(vessel.eta).toLocaleString()}</p>
                <p><strong>ETD:</strong> ${new Date(vessel.etd).toLocaleString()}</p>
                <small>Double-click to edit • Right-click to delete</small>
            </div>
        `;
    }

    /**
     * Handle vessel update from timeline interaction
     * @param {Object} item - Updated item object
     * @param {Function} callback - Callback function
     */
    handleVesselUpdate(item, callback) {
        try {
            const vessel = this.vesselManager.getVesselByVoyageNumber(item.id);
            if (!vessel) {
                console.error('Vessel not found for update:', item.id);
                callback(null); // Cancel the move
                return;
            }
            
            // Get berth information to determine terminal
            const berth = window.getBerthById ? window.getBerthById(item.group) : null;
            
            // Prepare update data
            const updateData = {
                eta: item.start.toISOString().slice(0, 16), // Format for datetime-local
                etd: item.end.toISOString().slice(0, 16),
                berthId: item.group, // New berth ID if moved between groups
                terminal: berth ? berth.terminal : vessel.terminal // Update terminal based on berth
            };
            
            // Use updateVessel method with voyage number
            const result = this.vesselManager.updateVessel(item.id, updateData);
            
            if (result.success) {
                console.log('Vessel updated from timeline:', vessel.vesselName);
                callback(item); // Confirm the move
                
                // Trigger table refresh
                if (window.renderVesselTable) {
                    window.renderVesselTable();
                }
                
                if (window.showMessage) {
                    window.showMessage(`Updated ${vessel.vesselName}`, 'success');
                }
            } else {
                console.error('Failed to update vessel:', result.error);
                callback(null); // Cancel the move
                
                if (window.showMessage) {
                    window.showMessage('Failed to update vessel: ' + result.error, 'error');
                }
            }
        } catch (error) {
            console.error('Error handling vessel update:', error);
            callback(null); // Cancel the move
            
            if (window.showMessage) {
                window.showMessage('Error updating vessel from timeline', 'error');
            }
        }
    }

    /**
     * Initialize context menu functionality
     */
    initializeContextMenu() {
        this.contextMenu = document.getElementById('vessel-context-menu');
        if (!this.contextMenu) {
            console.error('Context menu element not found');
            return;
        }
        
        // Add click handlers for menu items
        this.contextMenu.addEventListener('click', (e) => {
            console.log('Context menu clicked', e.target);
            
            const menuItem = e.target.closest('.menu-item');
            console.log('Menu item found:', menuItem);
            console.log('Selected vessel ID:', this.selectedVesselId);
            
            if (!menuItem || !this.selectedVesselId) {
                console.warn('No menu item or selected vessel ID');
                return;
            }
            
            const action = menuItem.dataset.action;
            console.log('Action to perform:', action);
            
            switch (action) {
                case 'edit':
                    console.log('Calling handleVesselEdit with:', this.selectedVesselId);
                    this.handleVesselEdit(this.selectedVesselId);
                    break;
                case 'delete':
                    console.log('Calling handleVesselDelete with:', this.selectedVesselId);
                    this.handleVesselDelete(this.selectedVesselId);
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
            
            this.hideContextMenu();
        });
    }
    
    /**
     * Show context menu at cursor position
     * @param {Event} event - Mouse event
     * @param {string} itemId - Vessel ID
     */
    showContextMenu(event, itemId) {
        console.log('showContextMenu called with itemId:', itemId);
        
        if (!this.contextMenu) {
            console.error('Context menu element not found');
            return;
        }
        
        this.selectedVesselId = itemId;
        console.log('Selected vessel ID set to:', this.selectedVesselId);
        
        // Position menu at cursor
        this.contextMenu.style.left = event.pageX + 'px';
        this.contextMenu.style.top = event.pageY + 'px';
        this.contextMenu.style.display = 'block';
        
        console.log('Context menu positioned at:', event.pageX, event.pageY);
        
        // Adjust position if menu goes off screen
        const rect = this.contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (rect.right > viewportWidth) {
            this.contextMenu.style.left = (event.pageX - rect.width) + 'px';
        }
        
        if (rect.bottom > viewportHeight) {
            this.contextMenu.style.top = (event.pageY - rect.height) + 'px';
        }
        
        console.log('Context menu displayed successfully');
    }
    
    /**
     * Hide context menu
     */
    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
            this.selectedVesselId = null;
        }
    }
    
    /**
     * Highlight vessel being edited
     * @param {string} itemId - Vessel ID
     */
    highlightEditingVessel(itemId) {
        // Clear existing highlights
        this.clearEditHighlighting();
        
        // Add editing class to timeline item
        const timelineItem = this.items.get(itemId);
        if (timelineItem) {
            timelineItem.className = (timelineItem.className || '') + ' vessel-editing';
            this.items.update(timelineItem);
        }
        
        // Trigger table highlighting via global function
        if (window.highlightEditingVessel) {
            window.highlightEditingVessel(itemId);
        }
    }
    
    /**
     * Clear edit highlighting
     */
    clearEditHighlighting() {
        // Remove editing class from all timeline items
        const allItems = this.items.get();
        allItems.forEach(item => {
            if (item.className && item.className.includes('vessel-editing')) {
                item.className = item.className.replace('vessel-editing', '').trim();
                this.items.update(item);
            }
        });
        
        // Clear table highlighting via global function
        if (window.clearEditHighlighting) {
            window.clearEditHighlighting();
        }
    }

    /**
     * Handle vessel edit request from double-click or context menu
     * @param {string} itemId - Item ID
     */
    handleVesselEdit(itemId) {
        console.log('handleVesselEdit called with itemId:', itemId);
        
        const vessel = this.vesselManager.getVesselByVoyageNumber(itemId);
        console.log('Found vessel for edit:', vessel);
        
        if (!vessel) {
            console.error('Vessel not found for itemId:', itemId);
            if (window.showMessage) {
                window.showMessage('Vessel not found for editing', 'error');
            }
            return;
        }
        
        if (!window.populateFormForEdit) {
            console.error('populateFormForEdit function not available');
            return;
        }
        
        console.log('Starting edit process for vessel:', vessel.vesselName);
        
        // Clear any existing edit highlighting
        this.clearEditHighlighting();
        
        // Highlight the vessel being edited
        this.highlightEditingVessel(itemId);
        
        window.populateFormForEdit(vessel);
        
        // Scroll to form
        document.getElementById('vessel-form').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        this.hideContextMenu();
        
        console.log('Edit process completed successfully');
    }

    /**
     * Handle vessel deletion request
     * @param {string} itemId - Item ID
     */
    handleVesselDelete(itemId) {
        const vessel = this.vesselManager.getVesselByVoyageNumber(itemId);
        if (!vessel) return;
        
        const confirmMessage = `Delete vessel "${vessel.vesselName}" from the timeline?`;
        if (confirm(confirmMessage)) {
            const result = this.vesselManager.deleteVessel(itemId);
            if (result.success) {
                // Remove from timeline
                this.items.remove(itemId);
                
                // Trigger table refresh
                if (window.renderVesselTable) {
                    window.renderVesselTable();
                }
                if (window.showMessage) {
                    window.showMessage('Vessel deleted from timeline', 'success');
                }
            } else {
                if (window.showMessage) {
                    window.showMessage('Failed to delete vessel', 'error');
                }
            }
        }
    }

    /**
     * Refresh timeline with current vessel data
     */
    refresh() {
        if (this.isInitialized) {
            this.loadVesselData();
        }
    }

    /**
     * Zoom in timeline
     */
    zoomIn() {
        if (this.timeline) {
            this.timeline.zoomIn(0.5);
        }
    }

    /**
     * Zoom out timeline
     */
    zoomOut() {
        if (this.timeline) {
            this.timeline.zoomOut(0.5);
        }
    }

    /**
     * Change timeline scale
     * @param {string} scale - Scale type (day, week, month)
     */
    changeScale(scale) {
        if (!this.timeline) return;
        
        const now = new Date();
        let start, end;
        
        switch (scale) {
            case 'day':
                // Show current day with some padding for better hour visualization
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0);
                break;
            case 'week':
                start = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
                end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                return;
        }
        
        console.log(`📅 Changing timeline scale to ${scale}:`, { start, end });
        
        // Set the time window
        this.timeline.setWindow(start, end);
        
        // Apply appropriate zoom level for the scale
        setTimeout(() => {
            if (scale === 'day') {
                // For day view, zoom to show hours clearly
                this.timeline.fit();
            }
        }, 100);
    }

    /**
     * Navigate to today
     */
    goToToday() {
        if (this.timeline) {
            const now = new Date();
            this.timeline.moveTo(now);
        }
    }

    /**
     * Toggle timeline visibility (collapse/expand)
     */
    toggle() {
        const container = document.getElementById('timeline-container');
        const button = document.getElementById('timeline-toggle');
        
        if (!container || !button) {
            console.error('Timeline container or toggle button not found');
            return;
        }
        
        if (this.isExpanded) {
            // Collapse timeline
            container.classList.add('collapsed');
            button.textContent = 'Show Timeline';
            button.classList.remove('active');
            this.isExpanded = false;
            console.log('Timeline collapsed');
        } else {
            // Expand timeline
            container.classList.remove('collapsed');
            button.textContent = 'Hide Timeline';
            button.classList.add('active');
            this.isExpanded = true;
            console.log('Timeline expanded');
            
            // Redraw timeline after expanding
            setTimeout(() => {
                if (this.timeline) {
                    try {
                        this.timeline.redraw();
                        console.log('Timeline redrawn after expansion');
                    } catch (error) {
                        console.error('Error redrawing timeline:', error);
                    }
                }
            }, 350); // Wait for CSS transition to complete
        }
    }

    /**
     * Update timeline format based on scale
     * @param {string} scale - Timeline scale (day, week, month)
     */
    updateTimelineFormat(scale) {
        if (!this.timeline) return;
        
        const scaleOptions = {
            day: {
                timeAxis: {
                    scale: 'hour',
                    step: 1
                },
                showMinorLabels: true,
                showMajorLabels: true,
                format: {
                    minorLabels: {
                        hour: 'HH:mm'
                    },
                    majorLabels: {
                        hour: 'ddd D MMMM'
                    }
                }
            },
            week: {
                timeAxis: {
                    scale: 'day',
                    step: 1
                },
                showMinorLabels: true,
                showMajorLabels: true,
                format: {
                    minorLabels: {
                        day: 'D'
                    },
                    majorLabels: {
                        day: 'MMMM YYYY'
                    }
                }
            },
            month: {
                timeAxis: {
                    scale: 'week',
                    step: 1
                },
                showMinorLabels: true,
                showMajorLabels: true,
                format: {
                    minorLabels: {
                        week: 'D'
                    },
                    majorLabels: {
                        week: 'MMMM YYYY'
                    }
                }
            }
        };
        
        const options = scaleOptions[scale];
        if (options) {
            console.log(`🕐 Updating timeline format for ${scale} view:`, options);
            this.timeline.setOptions(options);
            
            // Force redraw to apply changes
            setTimeout(() => {
                this.timeline.redraw();
            }, 50);
        }
    }

    /**
     * Update groups and items based on current terminal filter
     * @param {string} terminalFilter - Selected terminal ID or empty for all
     */
    updateGroupsAndItems(terminalFilter = '') {
        console.log('🔄 Updating groups and items with filter:', terminalFilter);
        
        // Store the current filter
        this.currentTerminalFilter = terminalFilter;
        
        // Update groups (berths)
        this.initializeGroups();
        
        // Get all vessels and filter them
        const allVessels = this.vesselManager.getAllVessels();
        const filteredVessels = terminalFilter ? 
            allVessels.filter(vessel => vessel.terminal === terminalFilter) : 
            allVessels;
        
        console.log(`📊 Filtering vessels: ${filteredVessels.length}/${allVessels.length} vessels displayed`);
        
        // Convert to timeline format
        const timelineItems = this.convertVesselsToTimelineData(filteredVessels);
        
        // Update timeline items
        this.items.clear();
        this.items.add(timelineItems);
        
        // Also update the table if available
        if (window.renderVesselTable) {
            window.renderVesselTable(filteredVessels);
        }
        
        console.log('✅ Groups and items updated successfully');
    }

    /**
     * Destroy timeline instance
     */
    destroy() {
        if (this.timeline) {
            this.timeline.destroy();
            this.timeline = null;
        }
        this.isInitialized = false;
    }
}