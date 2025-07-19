/**
 * VesselManager Class
 * Handles all vessel-related operations including CRUD functionality
 * Uses localStorage as a mock database for this prototype
 */
class VesselManager {
    constructor() {
        this.storageKey = 'vesselSchedulingData';
        this.vessels = this.loadVessels();
    }

    /**
     * Load vessels from localStorage
     * @returns {Array} Array of vessel objects
     */
    loadVessels() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading vessels from localStorage:', error);
            return [];
        }
    }

    /**
     * Save vessels to localStorage
     */
    saveVessels() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.vessels));
        } catch (error) {
            console.error('Error saving vessels to localStorage:', error);
            throw new Error('Failed to save vessel data');
        }
    }

    /**
     * Generate unique ID for new vessel
     * @returns {string} Unique vessel ID
     */
    generateId() {
        return 'vessel_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate voyage number format
     * @param {string} voyageNumber - Voyage number to validate
     * @returns {Object} Validation result
     */
    validateVoyageNumber(voyageNumber) {
        const voyagePattern = /^[0-9]{4}-[0-9]{3}-[EWNS]$/;
        
        if (!voyageNumber || voyageNumber.trim() === '') {
            return { isValid: false, error: 'Voyage number is required' };
        }
        
        if (!voyagePattern.test(voyageNumber)) {
            return { 
                isValid: false, 
                error: 'Voyage number must follow format YYYY-###-[E|W|N|S] (e.g., 2024-001-E)' 
            };
        }
        
        return { isValid: true };
    }

    /**
     * Check if voyage number already exists
     * @param {string} voyageNumber - Voyage number to check
     * @param {string} excludeVoyage - Voyage to exclude from check (for updates)
     * @returns {boolean} True if voyage number exists
     */
    voyageNumberExists(voyageNumber, excludeVoyage = null) {
        return this.vessels.some(vessel => 
            vessel.voyageNumber === voyageNumber && vessel.voyageNumber !== excludeVoyage
        );
    }

    /**
     * Validate vessel data before creation/update
     * @param {Object} vesselData - Vessel data to validate
     * @param {boolean} isUpdate - Whether this is an update operation
     * @param {string} originalVoyageNumber - Original voyage number for updates
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validateVessel(vesselData, isUpdate = false, originalVoyageNumber = null) {
        const errors = [];
        
        // Voyage number validation
        if (!vesselData.voyageNumber || vesselData.voyageNumber.trim() === '') {
            errors.push('Voyage number is required');
        } else {
            const voyageValidation = this.validateVoyageNumber(vesselData.voyageNumber);
            if (!voyageValidation.isValid) {
                errors.push(voyageValidation.error);
            } else if (!isUpdate && this.voyageNumberExists(vesselData.voyageNumber)) {
                errors.push('Voyage number already exists');
            } else if (isUpdate && this.voyageNumberExists(vesselData.voyageNumber, originalVoyageNumber)) {
                errors.push('Voyage number already exists');
            }
        }
        
        // Required field validation
        if (!vesselData.vesselName || vesselData.vesselName.trim() === '') {
            errors.push('Vessel name is required');
        }
        
        if (!vesselData.eta) {
            errors.push('ETA is required');
        }
        
        if (!vesselData.etd) {
            errors.push('ETD is required');
        }
        
        if (!vesselData.terminal) {
            errors.push('Terminal selection is required');
        }
        
        if (!vesselData.vesselType) {
            errors.push('Vessel type is required');
        }

        // Numeric validation
        if (!vesselData.loa || isNaN(vesselData.loa) || parseFloat(vesselData.loa) <= 0) {
            errors.push('LOA must be a positive number');
        }
        
        if (!vesselData.draft || isNaN(vesselData.draft) || parseFloat(vesselData.draft) <= 0) {
            errors.push('Draft must be a positive number');
        }

        // Date validation - ETA should be before ETD
        if (vesselData.eta && vesselData.etd) {
            const etaDate = new Date(vesselData.eta);
            const etdDate = new Date(vesselData.etd);
            
            if (etaDate >= etdDate) {
                errors.push('ETA must be before ETD');
            }

            // Check if ETA is in the past (optional warning)
            const now = new Date();
            if (etaDate < now) {
                console.warn('ETA is in the past for voyage:', vesselData.voyageNumber);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Create a new vessel call
     * @param {Object} vesselData - Vessel data object
     * @returns {Object} Result object with success boolean and data/error
     */
    createVessel(vesselData) {
        try {
            // Validate vessel data
            const validation = this.validateVessel(vesselData, false);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: 'Validation failed: ' + validation.errors.join(', ')
                };
            }

            // Create vessel object with voyage number as primary key
            const vessel = {
                voyageNumber: vesselData.voyageNumber.trim(),
                vesselName: vesselData.vesselName.trim(),
                eta: vesselData.eta,
                etd: vesselData.etd,
                loa: parseFloat(vesselData.loa),
                draft: parseFloat(vesselData.draft),
                terminal: vesselData.terminal,
                berthId: vesselData.berthId,
                vesselType: vesselData.vesselType,
                operator: vesselData.operator ? vesselData.operator.trim() : '',
                routeInfo: vesselData.routeInfo ? vesselData.routeInfo.trim() : '',
                createdAt: new Date().toISOString(),
                status: 'Planned' // Default status
            };

            // Add to vessels array
            this.vessels.push(vessel);
            
            // Save to localStorage
            this.saveVessels();

            return {
                success: true,
                data: vessel
            };
        } catch (error) {
            console.error('Error creating vessel:', error);
            return {
                success: false,
                error: 'Failed to create vessel: ' + error.message
            };
        }
    }

    /**
     * Get all vessels
     * @returns {Array} Array of all vessels
     */
    getAllVessels() {
        return [...this.vessels]; // Return copy to prevent direct modification
    }

    /**
     * Get vessel by voyage number
     * @param {string} voyageNumber - Voyage number
     * @returns {Object|null} Vessel object or null if not found
     */
    getVesselByVoyageNumber(voyageNumber) {
        return this.vessels.find(vessel => vessel.voyageNumber === voyageNumber) || null;
    }

    /**
     * Get vessel by ID (legacy method for compatibility)
     * @param {string} id - Vessel ID (treated as voyage number)
     * @returns {Object|null} Vessel object or null if not found
     */
    getVesselById(id) {
        return this.getVesselByVoyageNumber(id);
    }

    /**
     * Update an existing vessel
     * @param {string} voyageNumber - Voyage number to update
     * @param {Object} updateData - Updated vessel data
     * @returns {Object} Result object with success boolean and data/error
     */
    updateVessel(voyageNumber, updateData) {
        try {
            console.log('VesselManager.updateVessel called with:', voyageNumber, updateData);
            
            const existingVessel = this.getVesselByVoyageNumber(voyageNumber);
            if (!existingVessel) {
                console.error('Vessel not found for voyage number:', voyageNumber);
                return {
                    success: false,
                    error: 'Vessel with voyage number ' + voyageNumber + ' not found'
                };
            }

            console.log('Found existing vessel:', existingVessel);

            // Merge existing vessel with update data, preserving voyage number and metadata
            const updatedVesselData = {
                ...existingVessel,
                ...updateData,
                voyageNumber: updateData.voyageNumber || voyageNumber, // Allow voyage number updates
                createdAt: existingVessel.createdAt // Preserve creation time
            };

            console.log('Merged vessel data:', updatedVesselData);

            // Validate updated vessel data
            const validation = this.validateVessel(updatedVesselData, true, voyageNumber);
            if (!validation.isValid) {
                console.error('Validation failed:', validation.errors);
                return {
                    success: false,
                    error: 'Validation failed: ' + validation.errors.join(', ')
                };
            }

            // Remove old vessel
            this.vessels = this.vessels.filter(vessel => vessel.voyageNumber !== voyageNumber);
            
            // Create updated vessel object
            const updatedVessel = {
                voyageNumber: updatedVesselData.voyageNumber.trim(),
                vesselName: updatedVesselData.vesselName.trim(),
                eta: updatedVesselData.eta,
                etd: updatedVesselData.etd,
                loa: parseFloat(updatedVesselData.loa),
                draft: parseFloat(updatedVesselData.draft),
                terminal: updatedVesselData.terminal,
                berthId: updatedVesselData.berthId,
                vesselType: updatedVesselData.vesselType,
                operator: updatedVesselData.operator ? updatedVesselData.operator.trim() : '',
                routeInfo: updatedVesselData.routeInfo ? updatedVesselData.routeInfo.trim() : '',
                createdAt: existingVessel.createdAt,
                status: updatedVesselData.status || existingVessel.status || 'Planned'
            };

            console.log('Final updated vessel:', updatedVessel);

            // Add updated vessel
            this.vessels.push(updatedVessel);

            // Save to localStorage
            this.saveVessels();

            console.log('Vessel updated successfully');
            return {
                success: true,
                data: updatedVessel
            };
        } catch (error) {
            console.error('Error updating vessel:', error);
            return {
                success: false,
                error: 'Failed to update vessel: ' + error.message
            };
        }
    }

    /**
     * Delete vessel by voyage number
     * @param {string} voyageNumber - Voyage number to delete
     * @returns {Object} Result object with success boolean and message
     */
    deleteVessel(voyageNumber) {
        try {
            const initialLength = this.vessels.length;
            this.vessels = this.vessels.filter(vessel => vessel.voyageNumber !== voyageNumber);
            
            if (this.vessels.length === initialLength) {
                return {
                    success: false,
                    message: 'Vessel with voyage number ' + voyageNumber + ' not found'
                };
            }
            
            // Save updated data
            this.saveVessels();
            
            return {
                success: true,
                message: 'Vessel deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting vessel:', error);
            return {
                success: false,
                message: 'Failed to delete vessel: ' + error.message
            };
        }
    }

    /**
     * Get vessels filtered by terminal
     * @param {string} terminal - Terminal ID to filter by
     * @returns {Array} Filtered array of vessels
     */
    getVesselsByTerminal(terminal) {
        return this.vessels.filter(vessel => vessel.terminal === terminal);
    }

    /**
     * Get vessels filtered by type
     * @param {string} type - Vessel type to filter by
     * @returns {Array} Filtered array of vessels
     */
    getVesselsByType(type) {
        return this.vessels.filter(vessel => vessel.vesselType === type);
    }

    /**
     * Get vessels within a date range
     * @param {string} startDate - Start date (ISO string)
     * @param {string} endDate - End date (ISO string)
     * @returns {Array} Filtered array of vessels
     */
    getVesselsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.vessels.filter(vessel => {
            const eta = new Date(vessel.eta);
            return eta >= start && eta <= end;
        });
    }

    /**
     * Clear all vessel data (for testing/reset purposes)
     * @returns {Object} Result object
     */
    clearAllVessels() {
        try {
            this.vessels = [];
            this.saveVessels();
            return {
                success: true,
                message: 'All vessels cleared successfully'
            };
        } catch (error) {
            console.error('Error clearing vessels:', error);
            return {
                success: false,
                message: 'Failed to clear vessels: ' + error.message
            };
        }
    }

    /**
     * Get statistics about vessels
     * @returns {Object} Statistics object
     */
    getVesselStats() {
        const totalVessels = this.vessels.length;
        const vesselsByType = {};
        const vesselsByTerminal = {};
        
        this.vessels.forEach(vessel => {
            // Count by type
            vesselsByType[vessel.vesselType] = (vesselsByType[vessel.vesselType] || 0) + 1;
            
            // Count by terminal
            vesselsByTerminal[vessel.terminal] = (vesselsByTerminal[vessel.terminal] || 0) + 1;
        });
        
        return {
            total: totalVessels,
            byType: vesselsByType,
            byTerminal: vesselsByTerminal
        };
    }
    
    /**
     * Generate sample vessel data for testing
     * @returns {Object} Result object
     */
    generateSampleData() {
        console.log('🏭 VesselManager.generateSampleData() called');
        
        try {
            // Clear existing data first
            console.log('🗑️ Clearing existing vessels...');
            const clearResult = this.clearAllVessels();
            console.log('Clear result:', clearResult);
            
            const currentYear = new Date().getFullYear();
            console.log('📅 Using year:', currentYear);
            const sampleVessels = [
                {
                    voyageNumber: `${currentYear}-001-E`,
                    vesselName: 'MSC GENEVA',
                    eta: this.generateDateTime(1, 8, 0),
                    etd: this.generateDateTime(2, 14, 0),
                    loa: 280.0,
                    draft: 14.5,
                    terminal: 'term1',
                    berthId: 'term1-berth1',
                    vesselType: 'Container',
                    operator: 'MSC Mediterranean Shipping',
                    routeInfo: 'Asia-Europe'
                },
                {
                    voyageNumber: `${currentYear}-002-W`,
                    vesselName: 'ATLANTIC STAR',
                    eta: this.generateDateTime(2, 6, 0),
                    etd: this.generateDateTime(3, 18, 0),
                    loa: 180.0,
                    draft: 7.2,
                    terminal: 'term2',
                    berthId: 'term2-berth1',
                    vesselType: 'RoRo',
                    operator: 'Atlantic Shipping Lines',
                    routeInfo: 'North Atlantic'
                },
                {
                    voyageNumber: `${currentYear}-003-N`,
                    vesselName: 'BULK CARRIER OSLO',
                    eta: this.generateDateTime(3, 10, 0),
                    etd: this.generateDateTime(5, 16, 0),
                    loa: 260.0,
                    draft: 12.8,
                    terminal: 'term3',
                    berthId: 'term3-berth1',
                    vesselType: 'Bulk',
                    operator: 'Nordic Bulk Shipping',
                    routeInfo: 'Scandinavia-Mediterranean'
                },
                {
                    voyageNumber: `${currentYear}-004-E`,
                    vesselName: 'MAERSK EDINBURGH',
                    eta: this.generateDateTime(4, 12, 0),
                    etd: this.generateDateTime(5, 8, 0),
                    loa: 330.0,
                    draft: 16.0,
                    terminal: 'term1',
                    berthId: 'term1-berth3',
                    vesselType: 'Container',
                    operator: 'Maersk Line',
                    routeInfo: 'Far East-Europe'
                },
                {
                    voyageNumber: `${currentYear}-005-S`,
                    vesselName: 'PACIFIC VOYAGER',
                    eta: this.generateDateTime(6, 9, 0),
                    etd: this.generateDateTime(7, 15, 0),
                    loa: 320.0,
                    draft: 6.8,
                    terminal: 'term2',
                    berthId: 'term2-berth2',
                    vesselType: 'RoRo',
                    operator: 'Pacific Ferry Lines',
                    routeInfo: 'Pacific Islands'
                },
                {
                    voyageNumber: `${currentYear}-006-W`,
                    vesselName: 'IRON ORE CHAMPION',
                    eta: this.generateDateTime(7, 14, 0),
                    etd: this.generateDateTime(9, 10, 0),
                    loa: 380.0,
                    draft: 18.2,
                    terminal: 'term3',
                    berthId: 'term3-berth2',
                    vesselType: 'Bulk',
                    operator: 'Global Bulk Carriers',
                    routeInfo: 'Australia-Europe'
                },
                {
                    voyageNumber: `${currentYear}-007-E`,
                    vesselName: 'CMA CGM MARSEILLE',
                    eta: this.generateDateTime(8, 16, 0),
                    etd: this.generateDateTime(9, 20, 0),
                    loa: 240.0,
                    draft: 15.5,
                    terminal: 'term1',
                    berthId: 'term1-berth2',
                    vesselType: 'Container',
                    operator: 'CMA CGM',
                    routeInfo: 'Mediterranean-Asia'
                }
            ];
            
            console.log(`🚢 Creating ${sampleVessels.length} sample vessels...`);
            
            // Add each sample vessel
            let successCount = 0;
            sampleVessels.forEach((vesselData, index) => {
                console.log(`📦 Creating vessel ${index + 1}/${sampleVessels.length}: ${vesselData.voyageNumber}`);
                
                const result = this.createVessel(vesselData);
                if (result.success) {
                    successCount++;
                    console.log(`✅ Created: ${vesselData.vesselName}`);
                } else {
                    console.error(`❌ Failed to create ${vesselData.voyageNumber}:`, result.error);
                }
            });
            
            console.log(`🎉 Sample data generation complete: ${successCount}/${sampleVessels.length} vessels created`);
            
            return {
                success: true,
                message: `Generated ${successCount} sample vessels successfully`,
                count: successCount
            };
        } catch (error) {
            console.error('Error generating sample data:', error);
            return {
                success: false,
                message: 'Failed to generate sample data: ' + error.message
            };
        }
    }
    
    /**
     * Generate datetime string for sample data
     * @param {number} daysFromNow - Days from current date
     * @param {number} hour - Hour of day (0-23)
     * @param {number} minute - Minute (0-59)
     * @returns {string} ISO datetime string
     */
    generateDateTime(daysFromNow, hour, minute) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        date.setHours(hour, minute, 0, 0);
        return date.toISOString();
    }
}