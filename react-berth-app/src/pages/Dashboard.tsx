import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  List,
  Skeleton,
} from 'antd';
import {
  CarOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { DashboardMetrics, Vessel } from '../types';
import { MockDataService } from '../services/mockData';
import { formatDate } from '../utils';
import { vesselStatusColors, vesselTypeColors } from '../utils/theme';
import FeatureErrorBoundary from '../components/common/FeatureErrorBoundary';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentVessels, setRecentVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [metricsData, vesselsData] = await Promise.all([
          MockDataService.getDashboardMetrics('tenant1'),
          MockDataService.getVessels(),
        ]);

        setMetrics(metricsData);
        
        // Get recent vessels (last 5)
        const sortedVessels = vesselsData
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentVessels(sortedVessels);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const upcomingArrivalsColumns: ColumnsType<Vessel> = [
    {
      title: 'Vessel',
      dataIndex: 'vesselName',
      key: 'vesselName',
      render: (name: string, record: Vessel) => (
        <Space direction="vertical" size="small">
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.voyageNumber}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'vesselType',
      key: 'vesselType',
      render: (type: string) => (
        <Tag color={vesselTypeColors[type as keyof typeof vesselTypeColors]}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'ETA',
      dataIndex: 'eta',
      key: 'eta',
      render: (eta: string) => formatDate(eta, 'MMM DD HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={vesselStatusColors[status as keyof typeof vesselStatusColors]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <Skeleton.Input style={{ width: 300, height: 32 }} active />
          <div style={{ marginTop: 8 }}>
            <Skeleton.Input style={{ width: 400, height: 20 }} active />
          </div>
        </div>

        {/* Key Metrics Skeleton */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card>
                <Skeleton active paragraph={false} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts and Data Skeleton */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Skeleton */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Skeleton active />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Dashboard" showDetails={process.env.NODE_ENV === 'development'}>
      <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <DashboardOutlined /> Dashboard Overview
        </Title>
        <Text type="secondary">
          Real-time insights into your port operations and vessel scheduling
        </Text>
      </div>

      {/* Key Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Vessels"
              value={metrics?.totalVessels || 0}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Upcoming Arrivals"
              value={metrics?.upcomingArrivals || 0}
              prefix={<ClockCircleOutlined />}
              suffix="/ 24h"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Berth Utilization"
              value={metrics?.berthUtilization || 0}
              precision={1}
              suffix="%"
              prefix={<Progress type="circle" size="small" percent={metrics?.berthUtilization || 0} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Operational Delays"
              value={metrics?.operationalDelays || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Data Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Vessel Types Distribution" extra={<Button size="small">View Details</Button>}>
            <Row gutter={16}>
              {metrics?.vesselsByType && Object.entries(metrics.vesselsByType).map(([type, count]) => (
                <Col span={8} key={type}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic
                      title={type}
                      value={count}
                      valueStyle={{ 
                        color: vesselTypeColors[type as keyof typeof vesselTypeColors],
                        fontSize: '24px'
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Daily Throughput Trend" extra={<Button size="small">View Chart</Button>}>
            <List
              size="small"
              dataSource={metrics?.dailyThroughput || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<CalendarOutlined />}
                    title={formatDate(item.date, 'MMM DD')}
                    description={`${item.count} vessels processed`}
                  />
                  <div>
                    {item.count > 7 ? (
                      <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Upcoming Arrivals (Next 24h)" 
            extra={<Button type="link">View All Vessels</Button>}
          >
            <Table
              columns={upcomingArrivalsColumns}
              dataSource={recentVessels}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<CarOutlined />}>
                Add New Vessel Call
              </Button>
              <Button block icon={<CalendarOutlined />}>
                View Today's Schedule
              </Button>
              <Button block icon={<EnvironmentOutlined />}>
                Check Berth Availability
              </Button>
              <Button block icon={<ExclamationCircleOutlined />}>
                Resolve Conflicts
              </Button>
            </Space>
          </Card>

          <Card title="System Status" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>System Health</Text>
                <Tag color="green">Operational</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Last Sync</Text>
                <Text type="secondary">2 min ago</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Active Users</Text>
                <Text>12 online</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      </div>
    </FeatureErrorBoundary>
  );
};

export default Dashboard;