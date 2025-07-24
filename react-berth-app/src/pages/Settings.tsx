import React, { useState } from 'react';
import {
  Card,
  Form,
  Switch,
  Select,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  message,
  Radio,
  TimePicker,
  Slider,
  Input,
  Alert,
  Modal,
  List,
} from 'antd';
import {
  SettingOutlined,
  BellOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  SecurityScanOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MobileOutlined,
  MailOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    vesselUpdates: boolean;
    conflictAlerts: boolean;
    dailyReports: boolean;
    soundEnabled: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12' | '24';
    compactMode: boolean;
  };
  dashboard: {
    autoRefresh: boolean;
    refreshInterval: number;
    defaultView: string;
    showMetrics: boolean;
    showCharts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'organization' | 'private';
    activityTracking: boolean;
    dataCollection: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
  };
}

const Settings: React.FC = () => {
  const { state } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
      vesselUpdates: true,
      conflictAlerts: true,
      dailyReports: true,
      soundEnabled: true,
    },
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MMM DD, YYYY',
      timeFormat: '24',
      compactMode: false,
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      defaultView: 'dashboard',
      showMetrics: true,
      showCharts: true,
    },
    privacy: {
      profileVisibility: 'organization',
      activityTracking: true,
      dataCollection: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: false,
    },
  });

  const user = state.user;

  const handleSaveSettings = async (section?: keyof UserPreferences) => {
    try {
      setLoading(true);
      
      // Mock API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Settings saved successfully!');
    } catch (error) {
      message.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Delete Account',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph>
            This action will permanently delete your account and all associated data. 
            This cannot be undone.
          </Paragraph>
          <Paragraph strong style={{ color: '#ff4d4f' }}>
            Are you absolutely sure you want to proceed?
          </Paragraph>
        </div>
      ),
      okText: 'Delete Account',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Mock account deletion
          await new Promise(resolve => setTimeout(resolve, 1500));
          message.success('Account deletion request has been submitted.');
          // In real app, user would be logged out
        } catch (error) {
          message.error('Failed to delete account. Please try again.');
        }
      },
    });
  };

  const timezones = [
    { label: 'UTC', value: 'UTC' },
    { label: 'Eastern (ET)', value: 'America/New_York' },
    { label: 'Central (CT)', value: 'America/Chicago' },
    { label: 'Mountain (MT)', value: 'America/Denver' },
    { label: 'Pacific (PT)', value: 'America/Los_Angeles' },
    { label: 'London (GMT)', value: 'Europe/London' },
    { label: 'Paris (CET)', value: 'Europe/Paris' },
    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  ];

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
    { label: '日本語', value: 'ja' },
    { label: '中文', value: 'zh' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <SettingOutlined /> Account Settings
        </Title>
        <Text type="secondary">
          Customize your BerthBoard experience and manage your account preferences
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Notifications Settings */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BellOutlined />
                Notifications
              </Space>
            }
            extra={
              <Button 
                size="small" 
                onClick={() => handleSaveSettings('notifications')}
                loading={loading}
              >
                Save
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Notification Channels</Text>
                <div style={{ marginTop: 8 }}>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Space>
                        <MailOutlined />
                        <Text>Email</Text>
                      </Space>
                      <Switch 
                        size="small" 
                        checked={preferences.notifications.email}
                        onChange={(checked) => handlePreferenceChange('notifications', 'email', checked)}
                        style={{ marginLeft: 'auto' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Space>
                        <MobileOutlined />
                        <Text>Push</Text>
                      </Space>
                      <Switch 
                        size="small" 
                        checked={preferences.notifications.push}
                        onChange={(checked) => handlePreferenceChange('notifications', 'push', checked)}
                        style={{ marginLeft: 'auto' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Space>
                        <Text>SMS</Text>
                      </Space>
                      <Switch 
                        size="small" 
                        checked={preferences.notifications.sms}
                        onChange={(checked) => handlePreferenceChange('notifications', 'sms', checked)}
                        style={{ marginLeft: 'auto' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Space>
                        <SoundOutlined />
                        <Text>Sound</Text>
                      </Space>
                      <Switch 
                        size="small" 
                        checked={preferences.notifications.soundEnabled}
                        onChange={(checked) => handlePreferenceChange('notifications', 'soundEnabled', checked)}
                        style={{ marginLeft: 'auto' }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Text strong>Notification Types</Text>
                <div style={{ marginTop: 8 }}>
                  <List size="small">
                    <List.Item>
                      <List.Item.Meta
                        title="Vessel Updates"
                        description="ETA changes, arrivals, departures"
                      />
                      <Switch 
                        size="small"
                        checked={preferences.notifications.vesselUpdates}
                        onChange={(checked) => handlePreferenceChange('notifications', 'vesselUpdates', checked)}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Conflict Alerts"
                        description="Berth conflicts and scheduling issues"
                      />
                      <Switch 
                        size="small"
                        checked={preferences.notifications.conflictAlerts}
                        onChange={(checked) => handlePreferenceChange('notifications', 'conflictAlerts', checked)}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Daily Reports"
                        description="Summary reports and analytics"
                      />
                      <Switch 
                        size="small"
                        checked={preferences.notifications.dailyReports}
                        onChange={(checked) => handlePreferenceChange('notifications', 'dailyReports', checked)}
                      />
                    </List.Item>
                  </List>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Display & Appearance */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                Display & Appearance
              </Space>
            }
            extra={
              <Button 
                size="small" 
                onClick={() => handleSaveSettings('display')}
                loading={loading}
              >
                Save
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Theme</Text>
                <Radio.Group 
                  value={preferences.display.theme} 
                  onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
                  style={{ display: 'block', marginTop: 8 }}
                >
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                  <Radio value="auto">Auto</Radio>
                </Radio.Group>
              </div>

              <div>
                <Text strong>Language</Text>
                <Select
                  value={preferences.display.language}
                  onChange={(value) => handlePreferenceChange('display', 'language', value)}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {languages.map(lang => (
                    <Option key={lang.value} value={lang.value}>
                      {lang.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text strong>Timezone</Text>
                <Select
                  value={preferences.display.timezone}
                  onChange={(value) => handlePreferenceChange('display', 'timezone', value)}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {timezones.map(tz => (
                    <Option key={tz.value} value={tz.value}>
                      {tz.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text strong>Time Format</Text>
                <Radio.Group 
                  value={preferences.display.timeFormat} 
                  onChange={(e) => handlePreferenceChange('display', 'timeFormat', e.target.value)}
                  style={{ display: 'block', marginTop: 8 }}
                >
                  <Radio value="12">12-hour (2:30 PM)</Radio>
                  <Radio value="24">24-hour (14:30)</Radio>
                </Radio.Group>
              </div>

              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Compact Mode</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Reduce spacing for more content
                    </Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.display.compactMode}
                      onChange={(checked) => handlePreferenceChange('display', 'compactMode', checked)}
                    />
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Dashboard Preferences */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                Dashboard Preferences
              </Space>
            }
            extra={
              <Button 
                size="small" 
                onClick={() => handleSaveSettings('dashboard')}
                loading={loading}
              >
                Save
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Auto Refresh</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Automatically update data
                    </Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.dashboard.autoRefresh}
                      onChange={(checked) => handlePreferenceChange('dashboard', 'autoRefresh', checked)}
                    />
                  </Col>
                </Row>
              </div>

              {preferences.dashboard.autoRefresh && (
                <div>
                  <Text strong>Refresh Interval (seconds)</Text>
                  <Slider
                    min={10}
                    max={300}
                    step={10}
                    value={preferences.dashboard.refreshInterval}
                    onChange={(value) => handlePreferenceChange('dashboard', 'refreshInterval', value)}
                    marks={{
                      10: '10s',
                      60: '1m',
                      300: '5m'
                    }}
                    style={{ marginTop: 8 }}
                  />
                </div>
              )}

              <div>
                <Text strong>Default View</Text>
                <Select
                  value={preferences.dashboard.defaultView}
                  onChange={(value) => handlePreferenceChange('dashboard', 'defaultView', value)}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  <Option value="dashboard">Dashboard</Option>
                  <Option value="vessels">Vessels</Option>
                  <Option value="planning">Planning</Option>
                </Select>
              </div>

              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Show Metrics Cards</Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.dashboard.showMetrics}
                      onChange={(checked) => handlePreferenceChange('dashboard', 'showMetrics', checked)}
                    />
                  </Col>
                </Row>
              </div>

              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Show Charts</Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.dashboard.showCharts}
                      onChange={(checked) => handlePreferenceChange('dashboard', 'showCharts', checked)}
                    />
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Privacy & Security */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <SecurityScanOutlined />
                Privacy & Security
              </Space>
            }
            extra={
              <Button 
                size="small" 
                onClick={() => handleSaveSettings('privacy')}
                loading={loading}
              >
                Save
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Profile Visibility</Text>
                <Radio.Group 
                  value={preferences.privacy.profileVisibility} 
                  onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                  style={{ display: 'block', marginTop: 8 }}
                >
                  <Radio value="public">Public</Radio>
                  <Radio value="organization">Organization Only</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>
              </div>

              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Activity Tracking</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Track login times and usage
                    </Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.privacy.activityTracking}
                      onChange={(checked) => handlePreferenceChange('privacy', 'activityTracking', checked)}
                    />
                  </Col>
                </Row>
              </div>

              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Data Collection</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Analytics and usage data
                    </Text>
                  </Col>
                  <Col>
                    <Switch
                      checked={preferences.privacy.dataCollection}
                      onChange={(checked) => handlePreferenceChange('privacy', 'dataCollection', checked)}
                    />
                  </Col>
                </Row>
              </div>

              <Divider style={{ margin: '16px 0' }} />
              
              <Alert
                message="Data Export Available"
                description="You can download all your personal data at any time."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                action={
                  <Button size="small">
                    Export Data
                  </Button>
                }
              />
            </Space>
          </Card>
        </Col>

        {/* Account Management */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <DeleteOutlined />
                Account Management
              </Space>
            }
          >
            <Alert
              message="Danger Zone"
              description="These actions are permanent and cannot be undone."
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5} style={{ color: '#ff4d4f' }}>Delete Account</Title>
                <Paragraph>
                  Once you delete your account, there is no going back. 
                  Please be certain that you want to proceed.
                </Paragraph>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;