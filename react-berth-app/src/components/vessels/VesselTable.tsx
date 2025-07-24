import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Card,
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Dropdown,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  FilterOutlined,
  ReloadOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import { Vessel, VesselFilters, Terminal, Berth } from '../../types';
import { MockDataService } from '../../services/mockData';
import { formatDate, calculateTurnaroundTime } from '../../utils';
import { vesselStatusColors, vesselTypeColors } from '../../utils/theme';
import { VESSEL_TYPES, VESSEL_STATUSES } from '../../utils/constants';
import FeatureErrorBoundary from '../common/FeatureErrorBoundary';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface VesselTableProps {
  onEditVessel?: (vessel: Vessel) => void;
  onAddVessel?: () => void;
  selectedTerminalId?: string;
}

const VesselTable: React.FC<VesselTableProps> = ({
  onEditVessel,
  onAddVessel,
  selectedTerminalId,
}) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [berths, setBerths] = useState<Berth[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VesselFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    loadData();
  }, [selectedTerminalId, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vesselsData, terminalsData, berthsData] = await Promise.all([
        MockDataService.getVessels(selectedTerminalId || filters.terminalId),
        MockDataService.getTerminals('tenant1'),
        MockDataService.getBerths(selectedTerminalId || filters.terminalId),
      ]);

      // Apply filters
      let filteredVessels = vesselsData;

      if (filters.vesselType) {
        filteredVessels = filteredVessels.filter(v => v.vesselType === filters.vesselType);
      }

      if (filters.status) {
        filteredVessels = filteredVessels.filter(v => v.status === filters.status);
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredVessels = filteredVessels.filter(v =>
          v.vesselName.toLowerCase().includes(searchLower) ||
          v.voyageNumber.toLowerCase().includes(searchLower) ||
          v.operator?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.dateRange) {
        filteredVessels = filteredVessels.filter(v => {
          const eta = dayjs(v.eta);
          const start = dayjs(filters.dateRange!.start);
          const end = dayjs(filters.dateRange!.end);
          return eta.isBetween(start, end, 'day', '[]');
        });
      }

      setVessels(filteredVessels);
      setTerminals(terminalsData);
      setBerths(berthsData);
      setPagination(prev => ({ ...prev, total: filteredVessels.length }));
    } catch (error) {
      console.error('Failed to load vessel data:', error);
      message.error('Failed to load vessel data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vesselId: string) => {
    try {
      await MockDataService.deleteVessel(vesselId);
      message.success('Vessel deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete vessel:', error);
      message.error('Failed to delete vessel');
    }
  };

  const handleFilterChange = (key: keyof VesselFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getTerminalName = (terminalId: string) => {
    const terminal = terminals.find(t => t.id === terminalId);
    return terminal?.name || 'Unknown Terminal';
  };

  const getBerthName = (berthId: string) => {
    const berth = berths.find(b => b.id === berthId);
    return berth?.name || 'Unknown Berth';
  };

  const actionMenuItems = (vessel: Vessel): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit Vessel',
      onClick: () => onEditVessel?.(vessel),
    },
    {
      key: 'duplicate',
      icon: <PlusOutlined />,
      label: 'Duplicate',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => handleDelete(vessel.id),
    },
  ];

  const columns: ColumnsType<Vessel> = [
    {
      title: 'Voyage Number',
      dataIndex: 'voyageNumber',
      key: 'voyageNumber',
      width: 140,
      sorter: (a, b) => a.voyageNumber.localeCompare(b.voyageNumber),
      render: (text: string) => (
        <Typography.Text strong style={{ color: '#1890ff' }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: 'Vessel Name',
      dataIndex: 'vesselName',
      key: 'vesselName',
      width: 180,
      sorter: (a, b) => a.vesselName.localeCompare(b.vesselName),
      render: (text: string, record: Vessel) => (
        <Space direction="vertical" size="small">
          <Typography.Text strong>{text}</Typography.Text>
          {record.operator && (
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              {record.operator}
            </Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'vesselType',
      key: 'vesselType',
      width: 100,
      filters: VESSEL_TYPES.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value, record) => record.vesselType === value,
      render: (type: string) => (
        <Tag color={vesselTypeColors[type as keyof typeof vesselTypeColors]}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Terminal',
      dataIndex: 'terminalId',
      key: 'terminal',
      width: 150,
      render: (terminalId: string) => getTerminalName(terminalId),
    },
    {
      title: 'Berth',
      dataIndex: 'berthId',
      key: 'berth',
      width: 120,
      render: (berthId: string) => (
        <Tag color="blue">{getBerthName(berthId)}</Tag>
      ),
    },
    {
      title: 'ETA',
      dataIndex: 'eta',
      key: 'eta',
      width: 140,
      sorter: (a, b) => dayjs(a.eta).valueOf() - dayjs(b.eta).valueOf(),
      render: (eta: string) => (
        <Space direction="vertical" size="small">
          <Typography.Text>{formatDate(eta, 'MMM DD')}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDate(eta, 'HH:mm')}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'ETD',
      dataIndex: 'etd',
      key: 'etd',
      width: 140,
      sorter: (a, b) => dayjs(a.etd).valueOf() - dayjs(b.etd).valueOf(),
      render: (etd: string) => (
        <Space direction="vertical" size="small">
          <Typography.Text>{formatDate(etd, 'MMM DD')}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDate(etd, 'HH:mm')}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'LOA / Draft',
      key: 'dimensions',
      width: 120,
      render: (record: Vessel) => (
        <Space direction="vertical" size="small">
          <Typography.Text>{record.loa}m</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {record.draft}m draft
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 100,
      render: (record: Vessel) => {
        const hours = calculateTurnaroundTime(record);
        return (
          <Tooltip title={`${hours.toFixed(1)} hours`}>
            <Typography.Text>{Math.round(hours)}h</Typography.Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: VESSEL_STATUSES.map(status => ({ text: status.label, value: status.value })),
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const statusConfig = VESSEL_STATUSES.find(s => s.value === status);
        return (
          <Tag 
            color={vesselStatusColors[status as keyof typeof vesselStatusColors]}
            icon={statusConfig?.icon}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (record: Vessel) => (
        <Dropdown menu={{ items: actionMenuItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <FeatureErrorBoundary featureName="Vessel Management" showDetails={process.env.NODE_ENV === 'development'}>
      <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Vessel Management
            </Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                Refresh
              </Button>
              <Button icon={<ExportOutlined />}>
                Export
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddVessel}>
                Add Vessel
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search vessels..."
              prefix={<SearchOutlined />}
              value={filters.searchTerm}
              onChange={e => handleFilterChange('searchTerm', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Vessel Type"
              value={filters.vesselType}
              onChange={value => handleFilterChange('vesselType', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {VESSEL_TYPES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={value => handleFilterChange('status', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {VESSEL_STATUSES.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={filters.dateRange ? [
                dayjs(filters.dateRange.start),
                dayjs(filters.dateRange.end)
              ] : null}
              onChange={(dates) => {
                if (dates) {
                  handleFilterChange('dateRange', {
                    start: dates[0]!.format('YYYY-MM-DD'),
                    end: dates[1]!.format('YYYY-MM-DD'),
                  });
                } else {
                  handleFilterChange('dateRange', undefined);
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={vessels}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} vessels`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
          rowClassName={(record) => 
            record.status === 'delayed' ? 'vessel-row-delayed' : ''
          }
        />
      </Card>
      </div>
    </FeatureErrorBoundary>
  );
};

export default VesselTable;