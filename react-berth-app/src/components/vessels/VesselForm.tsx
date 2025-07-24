import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Space,
  Typography,
  Alert,
  Divider,
  Card,
  message,
  Spin,
} from 'antd';
import {
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Vessel, VesselFormData, Terminal, Berth, ConflictDetection } from '../../types';
import { MockDataService } from '../../services/mockData';
import { detectVesselConflicts, generateVoyageNumber, isValidVoyageNumber } from '../../utils';
import { VESSEL_TYPES, VESSEL_STATUSES } from '../../utils/constants';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface VesselFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (vessel: VesselFormData) => Promise<void>;
  editingVessel?: Vessel | null;
  selectedTerminalId?: string;
}

const VesselForm: React.FC<VesselFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  editingVessel,
  selectedTerminalId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [berths, setBerths] = useState<Berth[]>([]);
  const [conflicts, setConflicts] = useState<ConflictDetection[]>([]);
  const [currentTerminalId, setCurrentTerminalId] = useState<string>('');

  useEffect(() => {
    if (visible) {
      loadInitialData();
    }
  }, [visible]);

  useEffect(() => {
    if (currentTerminalId) {
      loadBerths(currentTerminalId);
    }
  }, [currentTerminalId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const terminalsData = await MockDataService.getTerminals('tenant1');
      setTerminals(terminalsData);

      if (editingVessel) {
        // Populate form with existing vessel data
        form.setFieldsValue({
          voyageNumber: editingVessel.voyageNumber,
          vesselName: editingVessel.vesselName,
          vesselType: editingVessel.vesselType,
          operator: editingVessel.operator,
          routeInfo: editingVessel.routeInfo,
          eta: dayjs(editingVessel.eta),
          etd: dayjs(editingVessel.etd),
          loa: editingVessel.loa,
          draft: editingVessel.draft,
          terminalId: editingVessel.terminalId,
          berthId: editingVessel.berthId,
        });
        setCurrentTerminalId(editingVessel.terminalId);
      } else {
        // Generate new voyage number for new vessel
        const newVoyageNumber = generateVoyageNumber();
        form.setFieldsValue({
          voyageNumber: newVoyageNumber,
          terminalId: selectedTerminalId,
        });
        if (selectedTerminalId) {
          setCurrentTerminalId(selectedTerminalId);
        }
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      message.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const loadBerths = async (terminalId: string) => {
    try {
      const berthsData = await MockDataService.getBerths(terminalId);
      setBerths(berthsData.filter(berth => berth.isActive));
    } catch (error) {
      console.error('Failed to load berths:', error);
      setBerths([]);
    }
  };

  const handleTerminalChange = (terminalId: string) => {
    setCurrentTerminalId(terminalId);
    form.setFieldValue('berthId', undefined);
    setBerths([]);
  };

  const handleFormChange = () => {
    checkConflicts();
  };

  const checkConflicts = async () => {
    try {
      const values = form.getFieldsValue();
      if (values.eta && values.etd && values.berthId) {
        const tempVessel: Vessel = {
          id: editingVessel?.id || 'temp',
          voyageNumber: values.voyageNumber,
          vesselName: values.vesselName,
          vesselType: values.vesselType,
          operator: values.operator,
          routeInfo: values.routeInfo,
          eta: values.eta.toISOString(),
          etd: values.etd.toISOString(),
          loa: values.loa,
          draft: values.draft,
          terminalId: values.terminalId,
          berthId: values.berthId,
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const [allVessels, allBerths] = await Promise.all([
          MockDataService.getVessels(),
          MockDataService.getBerths(),
        ]);

        const detectedConflicts = detectVesselConflicts(tempVessel, allVessels, allBerths);
        setConflicts(detectedConflicts);
      }
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const vesselData: VesselFormData = {
        voyageNumber: values.voyageNumber,
        vesselName: values.vesselName,
        vesselType: values.vesselType,
        operator: values.operator,
        routeInfo: values.routeInfo,
        eta: values.eta.toISOString(),
        etd: values.etd.toISOString(),
        loa: values.loa,
        draft: values.draft,
        terminalId: values.terminalId,
        berthId: values.berthId,
      };

      await onSubmit(vesselData);
      form.resetFields();
      setConflicts([]);
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewVoyageNumber = () => {
    const newVoyageNumber = generateVoyageNumber();
    form.setFieldValue('voyageNumber', newVoyageNumber);
  };

  return (
    <Modal
      title={
        <Space>
          <CarOutlined />
          {editingVessel ? 'Edit Vessel Call' : 'Add New Vessel Call'}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      confirmLoading={loading}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          requiredMark="optional"
        >
          {/* Conflicts Alert */}
          {conflicts.length > 0 && (
            <Alert
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              message="Conflicts Detected"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {conflicts.map((conflict, index) => (
                    <li key={index}>{conflict.message}</li>
                  ))}
                </ul>
              }
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Vessel Information */}
          <Card size="small" title="Vessel Information" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="voyageNumber"
                  label="Voyage Number"
                  rules={[
                    { required: true, message: 'Please enter voyage number' },
                    {
                      validator: (_, value) => {
                        if (!value || isValidVoyageNumber(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Format: YYYY-###-[E|W|N|S]');
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g., 2024-001-E"
                    suffix={
                      <Typography.Link onClick={generateNewVoyageNumber}>
                        Generate
                      </Typography.Link>
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="vesselName"
                  label="Vessel Name"
                  rules={[{ required: true, message: 'Please enter vessel name' }]}
                >
                  <Input placeholder="e.g., MSC Gulsun" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="vesselType"
                  label="Vessel Type"
                  rules={[{ required: true, message: 'Please select vessel type' }]}
                >
                  <Select placeholder="Select type">
                    {VESSEL_TYPES.map(type => (
                      <Option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="operator" label="Operator">
                  <Input placeholder="e.g., Maersk Line" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="routeInfo" label="Route">
                  <Input placeholder="e.g., Asia-Europe" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Schedule Information */}
          <Card size="small" title="Schedule" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="eta"
                  label="ETA (Estimated Time of Arrival)"
                  rules={[{ required: true, message: 'Please select ETA' }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Select arrival time"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="etd"
                  label="ETD (Estimated Time of Departure)"
                  rules={[
                    { required: true, message: 'Please select ETD' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const eta = getFieldValue('eta');
                        if (!value || !eta || value.isAfter(eta)) {
                          return Promise.resolve();
                        }
                        return Promise.reject('ETD must be after ETA');
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Select departure time"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Vessel Specifications */}
          <Card size="small" title="Vessel Specifications" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="loa"
                  label="LOA (Length Overall) - meters"
                  rules={[
                    { required: true, message: 'Please enter vessel length' },
                    { type: 'number', min: 10, max: 500, message: 'Length must be 10-500m' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="e.g., 300"
                    step={0.1}
                    precision={1}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="draft"
                  label="Draft - meters"
                  rules={[
                    { required: true, message: 'Please enter vessel draft' },
                    { type: 'number', min: 0.1, max: 30, message: 'Draft must be 0.1-30m' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="e.g., 12.5"
                    step={0.1}
                    precision={1}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Berth Assignment */}
          <Card size="small" title="Berth Assignment">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="terminalId"
                  label="Terminal"
                  rules={[{ required: true, message: 'Please select terminal' }]}
                >
                  <Select
                    placeholder="Select terminal"
                    onChange={handleTerminalChange}
                    suffixIcon={<EnvironmentOutlined />}
                  >
                    {terminals.map(terminal => (
                      <Option key={terminal.id} value={terminal.id}>
                        {terminal.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="berthId"
                  label="Berth"
                  rules={[{ required: true, message: 'Please select berth' }]}
                >
                  <Select
                    placeholder={currentTerminalId ? "Select berth" : "Select terminal first"}
                    disabled={!currentTerminalId}
                  >
                    {berths.map(berth => (
                      <Option key={berth.id} value={berth.id}>
                        <Space>
                          {berth.name}
                          <Text type="secondary">
                            ({berth.lengthM}m, {berth.maxDraft}m draft)
                          </Text>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VesselForm;