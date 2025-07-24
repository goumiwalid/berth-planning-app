import React, { useState } from 'react';
import { message } from 'antd';
import VesselTable from '../components/vessels/VesselTable';
import VesselForm from '../components/vessels/VesselForm';
import { Vessel, VesselFormData } from '../types';
import { MockDataService } from '../services/mockData';

interface VesselManagementProps {
  selectedTerminalId?: string;
}

const VesselManagement: React.FC<VesselManagementProps> = ({ selectedTerminalId }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddVessel = () => {
    setEditingVessel(null);
    setIsFormVisible(true);
  };

  const handleEditVessel = (vessel: Vessel) => {
    setEditingVessel(vessel);
    setIsFormVisible(true);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingVessel(null);
  };

  const handleFormSubmit = async (vesselData: VesselFormData) => {
    try {
      if (editingVessel) {
        // Update existing vessel
        await MockDataService.updateVessel(editingVessel.id, vesselData);
        message.success('Vessel updated successfully');
      } else {
        // Create new vessel
        await MockDataService.createVessel(vesselData);
        message.success('Vessel created successfully');
      }

      setIsFormVisible(false);
      setEditingVessel(null);
      
      // Trigger table refresh
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save vessel:', error);
      message.error('Failed to save vessel');
      throw error; // Re-throw to keep modal open
    }
  };

  return (
    <div>
      <VesselTable
        key={refreshKey}
        onAddVessel={handleAddVessel}
        onEditVessel={handleEditVessel}
        selectedTerminalId={selectedTerminalId}
      />

      <VesselForm
        visible={isFormVisible}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        editingVessel={editingVessel}
        selectedTerminalId={selectedTerminalId}
      />
    </div>
  );
};

export default VesselManagement;