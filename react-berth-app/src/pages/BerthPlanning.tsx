import React, { useState } from 'react';
import { Row, Col, Card, Space, Button, Typography, Modal, Drawer } from 'antd';
import {
  ScheduleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import BerthTimeline from '../components/timeline/BerthTimeline';
import VesselForm from '../components/vessels/VesselForm';
import { Vessel, VesselFormData } from '../types';
import { MockDataService } from '../services/mockData';
import { message } from 'antd';

const { Title, Paragraph } = Typography;

interface BerthPlanningProps {
  selectedTerminalId?: string;
}

const BerthPlanning: React.FC<BerthPlanningProps> = ({ selectedTerminalId }) => {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isVesselFormVisible, setIsVesselFormVisible] = useState(false);
  const [isVesselDetailVisible, setIsVesselDetailVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVesselSelect = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setIsVesselDetailVisible(true);
  };

  const handleAddVessel = () => {
    setIsVesselFormVisible(true);
  };

  const handleEditVessel = () => {
    if (selectedVessel) {
      setIsVesselDetailVisible(false);
      setIsVesselFormVisible(true);
    }
  };

  const handleFormSubmit = async (vesselData: VesselFormData) => {
    try {
      if (selectedVessel) {
        // Update existing vessel
        await MockDataService.updateVessel(selectedVessel.id, vesselData);
        message.success('Vessel updated successfully');
      } else {
        // Create new vessel
        await MockDataService.createVessel(vesselData);
        message.success('Vessel created successfully');
      }

      setIsVesselFormVisible(false);
      setSelectedVessel(null);
      
      // Trigger timeline refresh
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save vessel:', error);
      message.error('Failed to save vessel');
      throw error;
    }
  };

  const handleDeleteVessel = async () => {
    if (!selectedVessel) return;

    Modal.confirm({
      title: 'Delete Vessel Call',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete the vessel call for ${selectedVessel.vesselName} (${selectedVessel.voyageNumber})?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await MockDataService.deleteVessel(selectedVessel.id);
          message.success('Vessel deleted successfully');
          setIsVesselDetailVisible(false);
          setSelectedVessel(null);
          setRefreshKey(prev => prev + 1);
        } catch (error) {
          console.error('Failed to delete vessel:', error);
          message.error('Failed to delete vessel');
        }
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <ScheduleOutlined /> Berth Planning
            </Title>
            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
              Visual scheduling and berth allocation management
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button icon={<SettingOutlined />}>
                Timeline Settings
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVessel}>
                Add Vessel Call
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Instructions */}
      <Card size="small" style={{ marginBottom: 16, background: '#f6f8fa', border: '1px solid #e1e8ed' }}>
        <Space align="start">
          <InfoCircleOutlined style={{ color: '#1890ff', marginTop: 2 }} />
          <div>
            <strong>How to use the timeline:</strong>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
              <li>Click on vessel blocks to view details</li>
              <li>Drag vessel blocks to reschedule</li>
              <li>Use mouse wheel or zoom controls to adjust view</li>
              <li>Red line indicates current time</li>
            </ul>
          </div>
        </Space>
      </Card>

      {/* Timeline */}
      <BerthTimeline
        key={refreshKey}
        selectedTerminalId={selectedTerminalId}
        onVesselSelect={handleVesselSelect}
      />

      {/* Vessel Form Modal */}
      <VesselForm
        visible={isVesselFormVisible}
        onCancel={() => {
          setIsVesselFormVisible(false);
          setSelectedVessel(null);
        }}
        onSubmit={handleFormSubmit}
        editingVessel={selectedVessel}
        selectedTerminalId={selectedTerminalId}
      />

      {/* Vessel Detail Drawer */}
      <Drawer
        title={
          <Space>
            <span>🚢</span>
            <span>Vessel Details</span>
          </Space>
        }
        open={isVesselDetailVisible}
        onClose={() => {
          setIsVesselDetailVisible(false);
          setSelectedVessel(null);
        }}
        width={400}
        extra={
          <Space>
            <Button size="small" onClick={handleEditVessel}>
              Edit
            </Button>
            <Button size="small" danger onClick={handleDeleteVessel}>
              Delete
            </Button>
          </Space>
        }
      >
        {selectedVessel && (
          <div>
            <Card size="small" title="Basic Information" style={{ marginBottom: 16 }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Voyage:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.voyageNumber}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Vessel:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.vesselName}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Type:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.vesselType}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Operator:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.operator || 'N/A'}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Route:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.routeInfo || 'N/A'}</div>
                </Col>
              </Row>
            </Card>

            <Card size="small" title="Schedule" style={{ marginBottom: 16 }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>ETA:</div>
                </Col>
                <Col span={16}>
                  <div>{new Date(selectedVessel.eta).toLocaleString()}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>ETD:</div>
                </Col>
                <Col span={16}>
                  <div>{new Date(selectedVessel.etd).toLocaleString()}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Duration:</div>
                </Col>
                <Col span={16}>
                  <div>
                    {Math.round(
                      (new Date(selectedVessel.etd).getTime() - new Date(selectedVessel.eta).getTime()) / 
                      (1000 * 60 * 60)
                    )} hours
                  </div>
                </Col>
              </Row>
            </Card>

            <Card size="small" title="Specifications" style={{ marginBottom: 16 }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>LOA:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.loa} meters</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontWeight: 500 }}>Draft:</div>
                </Col>
                <Col span={16}>
                  <div>{selectedVessel.draft} meters</div>
                </Col>
              </Row>
            </Card>

            <Card size="small" title="Status">
              <div style={{ 
                padding: '8px 12px',
                background: '#f0f2f5',
                borderRadius: 4,
                textAlign: 'center',
                fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                {selectedVessel.status}
              </div>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default BerthPlanning;