import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  message,
  Modal,
  Descriptions,
  Tag,
  Switch,
  Select,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  LockOutlined,
  BellOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { TenantSwitcher } from '../components/common';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserProfile: React.FC = () => {
  const { state, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const user = state.user;

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  // Initialize form with user data
  React.useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      organizationName: user.organizationName,
      phoneNumber: user.phoneNumber,
      bio: user.bio || '',
    });
  }, [user, form]);

  const handleSaveProfile = async (values: any) => {
    try {
      setLoading(true);
      
      // Use auth service to update profile
      const updatedUser = await authService.updateProfile(user.id, values);
      
      // Update local state
      updateUser(updatedUser);
      
      message.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      setPasswordLoading(true);
      
      await authService.changePassword(
        user.id, 
        values.currentPassword, 
        values.newPassword
      );
      
      message.success('Password changed successfully!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (info.file.status === 'done') {
      // In a real app, you would get the URL from the server response
      const avatarUrl = 'https://via.placeholder.com/120'; // Mock URL
      updateUser({ avatar: avatarUrl });
      message.success('Avatar updated successfully!');
    } else if (info.file.status === 'error') {
      message.error('Failed to upload avatar');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'planner': return 'blue';
      case 'viewer': return 'green';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'planner': return '📋';
      case 'viewer': return '👁️';
      default: return '👤';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <UserOutlined /> User Profile
        </Title>
        <Text type="secondary">
          Manage your account settings and personal information
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Summary Card */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  style={{ 
                    border: '4px solid #f0f0f0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Upload
                  name="avatar"
                  listType="picture"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // Mock upload endpoint
                  beforeUpload={(file) => {
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                      message.error('You can only upload JPG/PNG file!');
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('Image must be smaller than 2MB!');
                    }
                    return isJpgOrPng && isLt2M;
                  }}
                  onChange={handleAvatarUpload}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      zIndex: 1
                    }}
                  />
                </Upload>
              </div>

              <div style={{ marginTop: 16 }}>
                <Title level={3} style={{ margin: '8px 0' }}>
                  {user.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {user.email}
                </Text>
              </div>

              <div style={{ marginTop: 16 }}>
                <Tag 
                  color={getRoleColor(user.role)} 
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {getRoleIcon(user.role)} {user.role.toUpperCase()}
                </Tag>
              </div>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Organization">
                {user.organizationName || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Job Title">
                {user.jobTitle || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {user.phoneNumber || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {new Date(user.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Profile Form */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <EditOutlined />
                Personal Information
              </Space>
            }
            extra={
              <Space>
                {editing ? (
                  <>
                    <Button onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      onClick={() => form.submit()}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Space>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveProfile}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      { required: true, message: 'Please enter your full name' },
                      { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter your full name" 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter your email"
                      disabled // Email shouldn't be editable in profile
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="jobTitle"
                    label="Job Title"
                  >
                    <Input 
                      prefix={<TeamOutlined />} 
                      placeholder="Enter your job title" 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter your phone number" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="organizationName"
                label="Organization"
              >
                <Input 
                  prefix={<EnvironmentOutlined />} 
                  placeholder="Enter your organization name" 
                />
              </Form.Item>

              <Form.Item
                name="bio"
                label="Bio"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Tell us about yourself..." 
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </Card>

          {/* Security Settings */}
          <Card 
            title={
              <Space>
                <LockOutlined />
                Security Settings
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>Password</Text>
                    <br />
                    <Text type="secondary">Last changed: Never</Text>
                  </div>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </Col>
              
              <Col span={24}>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>Two-Factor Authentication</Text>
                    <br />
                    <Text type="secondary">Add extra security to your account</Text>
                  </div>
                  <Switch disabled />
                </div>
              </Col>

              <Col span={24}>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>Email Notifications</Text>
                    <br />
                    <Text type="secondary">Receive notifications about your account</Text>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Organization Management */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <GlobalOutlined />
                Organization Access
              </Space>
            }
            extra={
              <Tag color="blue">
                {user?.role?.toUpperCase()}
              </Tag>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Current Organization</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px', marginBottom: 8, display: 'block' }}>
                  You are currently accessing data from this organization
                </Text>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f',
                  borderRadius: 6,
                  marginTop: 8
                }}>
                  <Text strong>{user?.organizationName || 'Unknown Organization'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Tenant ID: {user?.tenantId}
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text strong>Switch Organization</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px', marginBottom: 12, display: 'block' }}>
                  Access data from different organizations you have permissions for
                </Text>
                <TenantSwitcher 
                  placement="dropdown" 
                  showCurrentTenant={false}
                  size="middle"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  ⚠️ Switching organizations will refresh your current session and may 
                  affect your access to certain features based on your role in the selected organization.
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please enter your current password' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Enter current password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const hasLower = /[a-z]/.test(value);
                  const hasUpper = /[A-Z]/.test(value);
                  const hasNumber = /\d/.test(value);
                  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                  
                  if (hasLower && hasUpper && hasNumber && hasSpecial) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Password must contain uppercase, lowercase, number, and special character');
                }
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPasswordModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={passwordLoading}
              >
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;