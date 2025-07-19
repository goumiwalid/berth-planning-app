/**
 * Main Application Logic
 * Handles UI interactions, form submissions, and table updates
 */

// Global variables
let vesselManager;
let terminals = [];
let berths = {};
let visTimeline;
let selectedTerminal = '';

// Initialize global functions immediately
console.log('🚢 Vessel Scheduling App - Loading...');

/**
 * Global reset function - available immediately
 */
function resetApp() {
    console.log('🔄 Resetting application...');
    
    try {
        // Clear localStorage
        localStorage.clear();
        console.log('✅ localStorage cleared');
        
        // Try to reinitialize if vesselManager exists
        if (window.vesselManager) {
            const result = window.vesselManager.generateSampleData();
            console.log('Sample data result:', result);
            
            if (result.success) {
                console.log('✅ Sample data generated:', result.message);
                
                // Refresh components if available
                if (window.renderVesselTable) window.renderVesselTable();
                if (window.updateVesselCount) window.updateVesselCount();
                if (window.visTimeline) {
                    try {
                        window.visTimeline.refresh();
                        console.log('✅ Timeline refreshed');
                    } catch (error) {
                        console.warn('⚠️ Timeline refresh failed:', error.message);
                    }
                }
                
                if (window.showMessage) {
                    window.showMessage('Application reset with fresh sample data!', 'success');
                }
                
                return result;
            } else {
                console.error('❌ Failed to generate sample data:', result.message);
                return result;
            }
        } else {
            console.warn('⚠️ VesselManager not available, try refreshing the page');
            location.reload();
            return { success: false, message: 'VesselManager not available' };
        }
    } catch (error) {
        console.error('❌ Error in resetApp:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Generate sample data - available immediately
 */
function generateSampleData() {
    console.log('📊 Generating sample data...');
    
    try {
        if (!window.vesselManager) {
            console.error('❌ VesselManager not available');
            // Try to initialize it
            if (typeof VesselManager !== 'undefined') {
                console.log('🔧 Attempting to initialize VesselManager...');
                window.vesselManager = new VesselManager();
            } else {
                console.error('❌ VesselManager class not loaded');
                return { success: false, message: 'VesselManager class not available' };
            }
        }
        
        const result = window.vesselManager.generateSampleData();
        console.log('Sample generation result:', result);
        
        if (result.success) {
            console.log('✅ Sample data generated successfully');
            
            // Refresh UI components if available
            if (window.renderVesselTable) {
                window.renderVesselTable();
                console.log('✅ Table refreshed');
            }
            
            if (window.updateVesselCount) {
                window.updateVesselCount();
            }
            
            if (window.visTimeline) {
                try {
                    window.visTimeline.refresh();
                    console.log('✅ Timeline refreshed');
                } catch (error) {
                    console.warn('⚠️ Timeline refresh failed:', error.message);
                }
            }
            
            if (window.showMessage) {
                window.showMessage(result.message, 'success');
            }
        } else {
            console.error('❌ Sample data generation failed:', result.message);
            if (window.showMessage) {
                window.showMessage('Failed to generate sample data: ' + result.message, 'error');
            }
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error in generateSampleData:', error);
        if (window.showMessage) {
            window.showMessage('Error generating sample data: ' + error.message, 'error');
        }
        return { success: false, message: error.message };
    }
}

/**
 * Clear all data - available immediately
 */
function clearAllData() {
    console.log('🗑️ Clearing all data...');
    
    try {
        localStorage.clear();
        console.log('✅ localStorage cleared');
        
        if (window.vesselManager) {
            const result = window.vesselManager.clearAllVessels();
            console.log('Clear vessels result:', result);
            
            // Refresh UI
            if (window.renderVesselTable) window.renderVesselTable();
            if (window.updateVesselCount) window.updateVesselCount();
            if (window.visTimeline) {
                try {
                    window.visTimeline.refresh();
                } catch (error) {
                    console.warn('Timeline refresh failed:', error.message);
                }
            }
            
            if (window.showMessage) {
                window.showMessage('All data cleared successfully', 'info');
            }
            
            return result;
        } else {
            console.warn('⚠️ VesselManager not available');
            return { success: true, message: 'localStorage cleared, refresh page to complete' };
        }
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        return { success: false, message: error.message };
    }
}

// Make functions globally available immediately
window.resetApp = resetApp;
window.generateSampleData = generateSampleData;
window.clearAllData = clearAllData;
window.getBerthsForTerminal = getBerthsForTerminal;
window.getBerthById = getBerthById;
window.getFilteredBerths = getFilteredBerths;

console.log('✅ Global functions registered:', {
    resetApp: typeof window.resetApp,
    generateSampleData: typeof window.generateSampleData,
    clearAllData: typeof window.clearAllData
});

/**
 * Initialize berth data structure
 */
function initializeBerthData() {
    berths = {
        "term1": [
            { id: "term1-berth1", name: "Berth A1", length: 300, terminal: "term1" },
            { id: "term1-berth2", name: "Berth A2", length: 250, terminal: "term1" },
            { id: "term1-berth3", name: "Berth A3", length: 350, terminal: "term1" }
        ],
        "term2": [
            { id: "term2-berth1", name: "Berth B1", length: 200, terminal: "term2" },
            { id: "term2-berth2", name: "Berth B2", length: 350, terminal: "term2" }
        ],
        "term3": [
            { id: "term3-berth1", name: "Berth C1", length: 275, terminal: "term3" },
            { id: "term3-berth2", name: "Berth C2", length: 400, terminal: "term3" },
            { id: "term3-berth3", name: "Berth C3", length: 320, terminal: "term3" }
        ]
    };
    
    console.log('🏭 Berth data initialized:', berths);
    return berths;
}

/**
 * Get berths for a specific terminal
 * @param {string} terminalId - Terminal ID
 * @returns {Array} Array of berths for the terminal
 */
function getBerthsForTerminal(terminalId) {
    return berths[terminalId] || [];
}

/**
 * Get berth by ID
 * @param {string} berthId - Berth ID
 * @returns {Object|null} Berth object or null if not found
 */
function getBerthById(berthId) {
    for (const terminalBerths of Object.values(berths)) {
        const berth = terminalBerths.find(b => b.id === berthId);
        if (berth) return berth;
    }
    return null;
}

/**
 * Get all berths for selected terminal or all terminals
 * @param {string} terminalFilter - Terminal ID to filter by (empty for all)
 * @returns {Array} Array of berths
 */
function getFilteredBerths(terminalFilter = '') {
    if (!terminalFilter) {
        // Return all berths
        return Object.values(berths).flat();
    }
    return getBerthsForTerminal(terminalFilter);
}

/**
 * Update berth dropdown based on selected terminal
 * @param {string} terminalId - Selected terminal ID
 */
function updateBerthDropdown(terminalId) {
    const berthSelect = document.getElementById('berth');
    if (!berthSelect) return;
    
    // Clear existing options
    berthSelect.innerHTML = '';
    
    if (!terminalId) {
        berthSelect.innerHTML = '<option value="">Select Terminal First</option>';
        return;
    }
    
    const terminalBerths = getBerthsForTerminal(terminalId);
    
    if (terminalBerths.length === 0) {
        berthSelect.innerHTML = '<option value="">No Berths Available</option>';
        return;
    }
    
    // Add placeholder option
    berthSelect.innerHTML = '<option value="">Select Berth</option>';
    
    // Add berth options
    terminalBerths.forEach(berth => {
        const option = document.createElement('option');
        option.value = berth.id;
        option.textContent = `${berth.name} (${berth.length}m)`;
        berthSelect.appendChild(option);
    });
    
    console.log(`🏗️ Updated berth dropdown for terminal ${terminalId}:`, terminalBerths);
}

/**
 * Populate terminal filter dropdown
 */
function populateTerminalFilterDropdown() {
    const terminalFilterSelect = document.getElementById('terminal-filter');
    if (!terminalFilterSelect) return;
    
    // Clear existing options except "All Terminals"
    terminalFilterSelect.innerHTML = '<option value="">All Terminals</option>';
    
    // Add terminal options
    terminals.forEach(terminal => {
        const option = document.createElement('option');
        option.value = terminal.id;
        option.textContent = terminal.name;
        terminalFilterSelect.appendChild(option);
    });
    
    console.log('🏭 Terminal filter dropdown populated');
}

/**
 * Filter timeline by terminal
 * @param {string} terminalId - Terminal ID to filter by (empty for all)
 */
function filterTimelineByTerminal(terminalId) {
    if (visTimeline && visTimeline.isInitialized) {
        try {
            console.log('🔄 Filtering timeline for terminal:', terminalId || 'All');
            
            // Update the timeline groups and items based on terminal filter
            visTimeline.updateGroupsAndItems(terminalId);
            
            // Also filter the vessel table
            renderVesselTable(terminalId);
            
            console.log('✅ Timeline and table filtered successfully');
        } catch (error) {
            console.error('❌ Error filtering timeline:', error);
        }
    } else {
        console.warn('⚠️ Timeline not initialized for filtering');
    }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM loaded, initializing application...');
    
    try {
        // Initialize vessel manager
        console.log('📦 Initializing VesselManager...');
        
        if (typeof VesselManager === 'undefined') {
            throw new Error('VesselManager class not loaded');
        }
        
        vesselManager = new VesselManager();
        window.vesselManager = vesselManager; // Make globally available
        console.log('✅ VesselManager initialized');
        
        // Initialize berth data
        console.log('🏗️ Initializing berth data...');
        initializeBerthData();
        console.log('✅ Berth data initialized');
        
        // Load terminal data first
        console.log('🏭 Loading terminal data...');
        await loadTerminals();
        console.log('✅ Terminal data loaded');
        
        // Setup event listeners
        console.log('🎧 Setting up event listeners...');
        setupEventListeners();
        console.log('✅ Event listeners setup complete');
        
        // Check for existing vessels
        const existingVessels = vesselManager.getAllVessels();
        console.log(`📊 Found ${existingVessels.length} existing vessels`);
        
        // Generate sample data if needed
        if (existingVessels.length === 0) {
            console.log('📝 No existing vessels found, generating sample data...');
            try {
                const sampleResult = vesselManager.generateSampleData();
                console.log('📊 Sample generation result:', sampleResult);
                
                if (sampleResult.success) {
                    console.log('✅ Sample data generated:', sampleResult.message);
                    showMessage(`${sampleResult.message} - Ready for testing!`, 'success');
                } else {
                    console.error('❌ Failed to generate sample data:', sampleResult.message);
                    showMessage('Failed to generate sample data: ' + sampleResult.message, 'error');
                }
            } catch (sampleError) {
                console.error('❌ Error during sample data generation:', sampleError);
                showMessage('Error generating sample data: ' + sampleError.message, 'error');
            }
        }
        
        // Initial render of vessel table
        console.log('📋 Rendering vessel table...');
        renderVesselTable();
        console.log('✅ Vessel table rendered');
        
        // Initialize vis.js Timeline with error handling
        console.log('📅 Initializing timeline...');
        setTimeout(() => {
            try {
                initializeVisTimeline();
                console.log('✅ Timeline initialization attempted');
            } catch (timelineError) {
                console.error('❌ Timeline initialization failed:', timelineError);
            }
        }, 100);
        
        // Expose additional functions globally
        window.renderVesselTable = renderVesselTable;
        window.showMessage = showMessage;
        window.populateFormForEdit = populateFormForEdit;
        window.highlightEditingVessel = highlightEditingVessel;
        window.clearEditHighlighting = clearEditHighlighting;
        window.updateVesselCount = updateVesselCount;
        window.visTimeline = visTimeline; // Will be set later
        
        console.log('🎉 Application initialized successfully!');
        console.log('🛠️  Available console functions:');
        console.log('   - resetApp() - Reset app with fresh sample data');
        console.log('   - generateSampleData() - Generate sample vessels');  
        console.log('   - clearAllData() - Clear all data');
        console.log('   - window.vesselManager - Direct access to vessel manager');
        
    } catch (error) {
        console.error('💥 Critical error initializing application:', error);
        console.error('Stack trace:', error.stack);
        
        // Try to show error message if function is available
        if (typeof showMessage === 'function') {
            showMessage('Failed to initialize application: ' + error.message, 'error');
        } else {
            // Fallback error display
            alert('Failed to initialize application: ' + error.message);
        }
        
        // Still make basic functions available
        window.resetApp = resetApp;
        window.generateSampleData = generateSampleData;
        window.clearAllData = clearAllData;
        
        console.log('🔧 Basic reset functions still available in console');
    }
});

/**
 * Load terminal data from JSON file
 */
async function loadTerminals() {
    try {
        const response = await fetch('data/mock-terminals.json');
        if (!response.ok) {
            throw new Error('Failed to load terminals data');
        }
        
        terminals = await response.json();
        populateTerminalDropdown();
        populateTerminalFilterDropdown();
    } catch (error) {
        console.error('Error loading terminals:', error);
        // Fallback terminal data if file loading fails
        terminals = [
            { id: 'term1', name: 'Container Terminal A', type: 'Container' },
            { id: 'term2', name: 'RoRo Terminal', type: 'RoRo' },
            { id: 'term3', name: 'Bulk Terminal', type: 'Bulk' }
        ];
        populateTerminalDropdown();
        populateTerminalFilterDropdown();
    }
}

/**
 * Populate the terminal dropdown with available terminals
 */
function populateTerminalDropdown() {
    const terminalSelect = document.getElementById('terminal');
    
    // Clear existing options (except the first one)
    terminalSelect.innerHTML = '<option value="">Select Terminal</option>';
    
    // Add terminal options
    terminals.forEach(terminal => {
        const option = document.createElement('option');
        option.value = terminal.id;
        option.textContent = terminal.name;
        terminalSelect.appendChild(option);
    });
}

/**
 * Setup all event listeners for the application
 */
function setupEventListeners() {
    // Form submission
    const vesselForm = document.getElementById('vessel-form');
    vesselForm.addEventListener('submit', handleFormSubmit);
    
    // Form reset
    vesselForm.addEventListener('reset', handleFormReset);
    
    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancel-edit');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', handleCancelEdit);
    }
    
    // Terminal selection change - update berth dropdown
    const terminalSelect = document.getElementById('terminal');
    if (terminalSelect) {
        terminalSelect.addEventListener('change', (e) => {
            updateBerthDropdown(e.target.value);
        });
    }
    
    // Terminal filter change - update timeline
    const terminalFilterSelect = document.getElementById('terminal-filter');
    if (terminalFilterSelect) {
        terminalFilterSelect.addEventListener('change', (e) => {
            selectedTerminal = e.target.value;
            console.log('🔍 Terminal filter changed to:', selectedTerminal || 'All Terminals');
            filterTimelineByTerminal(selectedTerminal);
        });
    }
    
    // Real-time form validation
    const formInputs = vesselForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateFormField);
        input.addEventListener('input', clearFieldError);
    });
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Get form data
        const formData = new FormData(event.target);
        const vesselData = Object.fromEntries(formData.entries());
        
        // Check if we're editing an existing vessel
        const editingId = event.target.dataset.editingId;
        
        // Validate form
        if (!validateForm(vesselData)) {
            return;
        }
        
        let result;
        if (editingId) {
            // Update existing vessel using the new updateVessel method
            console.log('Updating vessel with ID:', editingId);
            console.log('Update data:', vesselData);
            
            result = vesselManager.updateVessel(editingId, vesselData);
            console.log('Update result:', result);
            
            if (result.success) {
                showMessage('Vessel call updated successfully!', 'success');
            } else {
                console.error('Update failed:', result.error);
            }
        } else {
            // Create new vessel
            console.log('Creating new vessel:', vesselData);
            result = vesselManager.createVessel(vesselData);
            
            if (result.success) {
                showMessage('Vessel call added successfully!', 'success');
            }
        }
        
        if (result && result.success) {
            // Reset form and clear editing state
            event.target.reset();
            clearFormEditingState();
            
            // Update vessel table
            renderVesselTable();
            
            // Update vessel count
            updateVesselCount();
            
            // Update vis.js Timeline
            if (visTimeline) {
                try {
                    console.log('Refreshing timeline after form submission');
                    visTimeline.refresh();
                    console.log('Timeline refreshed successfully');
                } catch (error) {
                    console.error('Error refreshing vis.js Timeline:', error);
                    showMessage('Timeline refresh failed, but vessel was saved', 'warning');
                }
            } else {
                console.warn('visTimeline not available for refresh');
            }
        } else {
            // Show error message
            showMessage(result ? result.error : 'Failed to process vessel call', 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Failed to process vessel call', 'error');
    }
}

/**
 * Handle form reset
 * @param {Event} event - Form reset event
 */
function handleFormReset(event) {
    // Clear any validation messages
    clearAllFieldErrors();
    
    // Clear editing state
    clearFormEditingState();
    
    showMessage('Form cleared', 'info');
}

/**
 * Validate entire form
 * @param {Object} vesselData - Form data object
 * @returns {boolean} True if form is valid
 */
function validateForm(vesselData) {
    let isValid = true;
    
    // Clear previous errors
    clearAllFieldErrors();
    
    // Required field validation
    const requiredFields = ['voyageNumber', 'vesselName', 'eta', 'etd', 'loa', 'draft', 'terminal', 'berthId', 'vesselType'];
    requiredFields.forEach(field => {
        if (!vesselData[field] || vesselData[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Date validation
    if (vesselData.eta && vesselData.etd) {
        const eta = new Date(vesselData.eta);
        const etd = new Date(vesselData.etd);
        
        if (eta >= etd) {
            showFieldError('etd', 'ETD must be after ETA');
            isValid = false;
        }
    }
    
    // Numeric validation
    if (vesselData.loa && (isNaN(vesselData.loa) || parseFloat(vesselData.loa) <= 0)) {
        showFieldError('loa', 'LOA must be a positive number');
        isValid = false;
    }
    
    if (vesselData.draft && (isNaN(vesselData.draft) || parseFloat(vesselData.draft) <= 0)) {
        showFieldError('draft', 'Draft must be a positive number');
        isValid = false;
    }
    
    // Berth validation - check if vessel fits
    if (vesselData.berthId && vesselData.loa) {
        const berth = getBerthById(vesselData.berthId);
        const vesselLoa = parseFloat(vesselData.loa);
        
        if (berth && vesselLoa > berth.length) {
            showFieldError('loa', `Vessel LOA (${vesselLoa}m) exceeds berth length (${berth.length}m)`);
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Validate individual form field
 * @param {Event} event - Field blur event
 */
function validateFormField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Clear previous error
    clearFieldError(field.name);
    
    // Required field check
    if (field.required && !value) {
        showFieldError(field.name, 'This field is required');
        return;
    }
    
    // Specific field validations
    switch (field.name) {
        case 'voyageNumber':
            if (value) {
                const voyagePattern = /^[0-9]{4}-[0-9]{3}-[EWNS]$/;
                if (!voyagePattern.test(value)) {
                    showFieldError(field.name, 'Format: YYYY-###-[E|W|N|S] (e.g., 2024-001-E)');
                }
            }
            break;
        case 'loa':
        case 'draft':
            if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                showFieldError(field.name, 'Must be a positive number');
            }
            break;
        case 'etd':
            const etaField = document.getElementById('eta');
            if (value && etaField.value) {
                const eta = new Date(etaField.value);
                const etd = new Date(value);
                if (eta >= etd) {
                    showFieldError('etd', 'ETD must be after ETA');
                }
            }
            break;
    }
}

/**
 * Show field-specific error message
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message
 */
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Add error class to field
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field-specific error
 * @param {string|Event} fieldNameOrEvent - Field name or input event
 */
function clearFieldError(fieldNameOrEvent) {
    let fieldName;
    if (typeof fieldNameOrEvent === 'string') {
        fieldName = fieldNameOrEvent;
    } else {
        fieldName = fieldNameOrEvent.target.name;
    }
    
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Clear all field errors
 */
function clearAllFieldErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

/**
 * Render the vessel table with current data
 * @param {Array|string} vesselsOrFilter - Either array of vessels or terminal filter string
 */
function renderVesselTable(vesselsOrFilter = '') {
    const tableBody = document.getElementById('vessel-table-body');
    let vessels;
    
    // Handle both array of vessels and terminal filter
    if (Array.isArray(vesselsOrFilter)) {
        vessels = vesselsOrFilter;
    } else {
        // Traditional terminal filter approach
        vessels = vesselManager.getAllVessels();
        if (vesselsOrFilter) {
            vessels = vessels.filter(vessel => vessel.terminal === vesselsOrFilter);
            console.log(`🔍 Filtered vessels for terminal ${vesselsOrFilter}:`, vessels.length);
        }
    }
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (vessels.length === 0) {
        // Show no data message
        const row = document.createElement('tr');
        row.className = 'no-vessels';
        row.innerHTML = '<td colspan="11" class="no-data">No vessel calls scheduled</td>';
        tableBody.appendChild(row);
    } else {
        // Render vessel rows
        vessels.forEach(vessel => {
            const row = createVesselRow(vessel);
            tableBody.appendChild(row);
        });
    }
    
    // Update vessel count
    updateVesselCount();
}

/**
 * Create a table row for a vessel
 * @param {Object} vessel - Vessel data object
 * @returns {HTMLElement} Table row element
 */
function createVesselRow(vessel) {
    const row = document.createElement('tr');
    
    // Format dates for display
    const etaFormatted = formatDateTime(vessel.eta);
    const etdFormatted = formatDateTime(vessel.etd);
    
    // Get terminal name
    const terminal = terminals.find(t => t.id === vessel.terminal);
    const terminalName = terminal ? terminal.name : vessel.terminal;
    
    // Get berth name
    const berth = getBerthById(vessel.berthId);
    const berthName = berth ? `${berth.name} (${berth.length}m)` : (vessel.berthId || '-');
    
    row.innerHTML = `
        <td><strong>${escapeHtml(vessel.voyageNumber)}</strong></td>
        <td><strong>${escapeHtml(vessel.vesselName)}</strong></td>
        <td><span class="vessel-type ${vessel.vesselType.toLowerCase()}">${vessel.vesselType}</span></td>
        <td>${escapeHtml(terminalName)}</td>
        <td>${escapeHtml(berthName)}</td>
        <td>${etaFormatted}</td>
        <td>${etdFormatted}</td>
        <td>${vessel.loa}m</td>
        <td>${vessel.draft}m</td>
        <td>${escapeHtml(vessel.operator || '-')}</td>
        <td>
            <button class="btn-edit" onclick="editVessel('${vessel.voyageNumber}')" title="Edit vessel">
                Edit
            </button>
            <button class="btn-delete" onclick="deleteVessel('${vessel.voyageNumber}')" title="Delete vessel">
                Delete
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Edit a vessel by voyage number
 * @param {string} voyageNumber - Voyage number of vessel to edit
 */
function editVessel(voyageNumber) {
    console.log('editVessel called with voyageNumber:', voyageNumber);
    
    const vessel = vesselManager.getVesselByVoyageNumber(voyageNumber);
    console.log('Found vessel:', vessel);
    
    if (!vessel) {
        console.error('Vessel not found for voyage number:', voyageNumber);
        showMessage('Vessel not found', 'error');
        return;
    }
    
    // Clear any existing edit highlighting
    clearEditHighlighting();
    
    // Highlight the vessel being edited
    highlightEditingVessel(voyageNumber);
    
    // Use the existing populateFormForEdit function
    populateFormForEdit(vessel);
    
    // Scroll to form
    document.getElementById('vessel-form').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    showMessage(`Editing vessel: ${vessel.vesselName}`, 'info');
}

/**
 * Delete a vessel by voyage number
 * @param {string} voyageNumber - Voyage number of vessel to delete
 */
function deleteVessel(voyageNumber) {
    // Show confirmation dialog
    const vessel = vesselManager.getVesselByVoyageNumber(voyageNumber);
    if (!vessel) {
        showMessage('Vessel not found', 'error');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete the vessel "${vessel.vesselName}"?`;
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Delete vessel
    const result = vesselManager.deleteVessel(voyageNumber);
    
    if (result.success) {
        showMessage('Vessel deleted successfully', 'success');
        renderVesselTable();
        
        // Update vis.js Timeline
        if (visTimeline) {
            try {
                console.log('Refreshing timeline after vessel deletion');
                visTimeline.refresh();
                console.log('Timeline refreshed successfully after deletion');
            } catch (error) {
                console.error('Error refreshing vis.js Timeline after delete:', error);
            }
        } else {
            console.warn('visTimeline not available for refresh after delete');
        }
    } else {
        showMessage(result.message, 'error');
    }
}

/**
 * Update the vessel count display
 */
function updateVesselCount() {
    const countElement = document.getElementById('vessel-count');
    const count = vesselManager.getAllVessels().length;
    countElement.textContent = count;
}

/**
 * Show a message to the user
 * @param {string} message - Message text
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#e74c3c';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#f39c12';
            break;
        case 'info':
        default:
            messageDiv.style.backgroundColor = '#3498db';
            break;
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Format datetime for display
 * @param {string} datetime - ISO datetime string
 * @returns {string} Formatted datetime string
 */
function formatDateTime(datetime) {
    const date = new Date(datetime);
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize vis.js Timeline
 */
function initializeVisTimeline() {
    try {
        // Check if vis.js Timeline is loaded
        if (typeof vis === 'undefined') {
            console.error('vis.js Timeline library not loaded');
            showMessage('Timeline library not loaded - please check your internet connection', 'error');
            return;
        }
        
        // Check if Timeline class is available
        if (!vis.Timeline) {
            console.error('vis.Timeline class not found');
            showMessage('Timeline class not available', 'error');
            return;
        }
        
        // Check if DataSet is available
        if (!vis.DataSet) {
            console.error('vis.DataSet class not found');
            showMessage('DataSet class not available', 'error');
            return;
        }
        
        console.log('vis.js library loaded successfully, version:', vis.version || 'unknown');
        
        // Initialize vis.js Timeline
        visTimeline = new VisTimeline(vesselManager, terminals);
        const success = visTimeline.init();
        
        if (success) {
            console.log('vis.js Timeline initialized successfully');
            showMessage('Timeline ready!', 'success');
        } else {
            console.error('Failed to initialize vis.js Timeline');
            showMessage('Timeline view unavailable', 'error');
        }
    } catch (error) {
        console.error('Error initializing vis.js Timeline:', error);
        showMessage('Timeline error: ' + error.message, 'error');
    }
}

/**
 * Handle cancel edit action
 */
function handleCancelEdit() {
    // Clear form editing state
    clearFormEditingState();
    
    // Clear form
    const form = document.getElementById('vessel-form');
    if (form) {
        form.reset();
    }
    
    // Clear all field errors
    clearAllFieldErrors();
    
    // Clear edit highlighting
    clearEditHighlighting();
    
    showMessage('Edit cancelled', 'info');
}

/**
 * Clear form editing state
 */
function clearFormEditingState() {
    const form = document.getElementById('vessel-form');
    if (!form) return;
    
    // Remove editing dataset
    delete form.dataset.editingId;
    
    // Reset submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Add Vessel Call';
        submitBtn.classList.remove('editing');
    }
    
    // Hide cancel button
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
    
    // Remove editing class from form
    form.classList.remove('editing');
    
    // Remove form header
    const formHeader = form.querySelector('.form-header');
    if (formHeader) {
        formHeader.remove();
    }
}

/**
 * Export vessel data (for future enhancement)
 */
function exportVesselData() {
    const vessels = vesselManager.getAllVessels();
    const dataStr = JSON.stringify(vessels, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'vessel-schedule.json';
    link.click();
}

/**
 * Populate form with vessel data for editing (used by timeline)
 * @param {Object} vessel - Vessel object
 */
function populateFormForEdit(vessel) {
    const form = document.getElementById('vessel-form');
    if (!form) return;
    
    // Format dates for datetime-local input
    const formatForInput = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
    };
    
    // Populate form fields
    form.elements['voyageNumber'].value = vessel.voyageNumber;
    form.elements['vesselName'].value = vessel.vesselName;
    form.elements['eta'].value = formatForInput(vessel.eta);
    form.elements['etd'].value = formatForInput(vessel.etd);
    form.elements['loa'].value = vessel.loa;
    form.elements['draft'].value = vessel.draft;
    form.elements['terminal'].value = vessel.terminal;
    form.elements['vesselType'].value = vessel.vesselType;
    form.elements['operator'].value = vessel.operator || '';
    
    // Update berth dropdown based on terminal, then set berth value
    if (vessel.terminal) {
        updateBerthDropdown(vessel.terminal);
        // Wait a brief moment for dropdown to populate
        setTimeout(() => {
            if (form.elements['berthId'] && vessel.berthId) {
                form.elements['berthId'].value = vessel.berthId;
            }
        }, 10);
    }
    
    // Change form button text to indicate editing
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Update Vessel Call';
        submitBtn.classList.add('editing');
        
        // Store vessel voyage number for update
        form.dataset.editingId = vessel.voyageNumber;
    }
    
    // Show cancel button
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.style.display = 'inline-block';
    }
    
    // Add editing class to form
    form.classList.add('editing');
    
    // Add form header if not exists
    let formHeader = form.querySelector('.form-header');
    if (!formHeader) {
        formHeader = document.createElement('div');
        formHeader.className = 'form-header';
        form.insertBefore(formHeader, form.firstChild);
    }
    formHeader.innerHTML = `<h3>✏️ Editing Vessel: ${vessel.vesselName} (${vessel.voyageNumber})</h3>`;
    
    // Show message
    if (window.showMessage) {
        window.showMessage(`Editing vessel: ${vessel.vesselName}`, 'info');
    }
}

/**
 * Highlight vessel being edited in table
 * @param {string} voyageNumber - Voyage number of vessel being edited
 */
function highlightEditingVessel(voyageNumber) {
    // Clear existing highlights
    clearEditHighlighting();
    
    // Find and highlight the table row
    const tableRows = document.querySelectorAll('#vessel-table-body tr');
    tableRows.forEach(row => {
        const firstCell = row.querySelector('td');
        if (firstCell && firstCell.textContent.trim() === voyageNumber) {
            row.classList.add('vessel-editing');
        }
    });
}

/**
 * Clear edit highlighting from table
 */
function clearEditHighlighting() {
    const editingRows = document.querySelectorAll('.vessel-editing');
    editingRows.forEach(row => {
        row.classList.remove('vessel-editing');
    });
}

// Note: Global functions are now defined at the top of the file