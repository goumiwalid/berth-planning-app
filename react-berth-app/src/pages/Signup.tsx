import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  Checkbox,
  message,
  Select,
  Row,
  Col,
  Steps
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { SignupFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { signup, state } = useAuth();

  const handleSignup = async (values: SignupFormData) => {
    try {
      await signup(values);
      message.success('Account created successfully! Welcome to BerthBoard.');
      navigate('/dashboard');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  const validatePassword = (rule: any, value: string) => {
    if (!value) return Promise.resolve();
    
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (hasLower && hasUpper && hasNumber && hasSpecial && isLongEnough) {
      return Promise.resolve();
    }
    
    return Promise.reject('Password must contain uppercase, lowercase, number, special character and be 8+ characters');
  };

  const steps = [
    {
      title: 'Account Info',
      content: 'Basic account information'
    },
    {
      title: 'Organization',
      content: 'Organization details'
    },
    {
      title: 'Verification',
      content: 'Verify your account'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: 'none'
        }}
        bodyStyle={{ padding: '48px 32px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: 16,
            background: 'linear-gradient(135deg, #1890ff, #722ed1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ⚓
          </div>
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Join BerthBoard
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Create your professional port management account
          </Text>
        </div>

        {/* Progress Steps */}
        <Steps 
          current={currentStep} 
          size="small" 
          style={{ marginBottom: 32 }}
          items={steps}
        />

        {/* Signup Form */}
        <Form
          form={form}
          name="signup"
          onFinish={handleSignup}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          {/* Step 1: Basic Information */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please enter your full name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="John Doe"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jobTitle"
                label="Job Title"
                rules={[
                  { required: true, message: 'Please enter your job title' }
                ]}
              >
                <Input 
                  prefix={<TeamOutlined />} 
                  placeholder="Port Manager"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Work Email Address"
            rules={[
              { required: true, message: 'Please enter your work email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="john@portauthority.com"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please create a password' },
                  { validator: validatePassword }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Create password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Passwords do not match');
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Organization Information */}
          <Divider orientation="left">Organization Details</Divider>

          <Form.Item
            name="organizationName"
            label="Organization Name"
            rules={[
              { required: true, message: 'Please enter your organization name' }
            ]}
          >
            <Input 
              prefix={<EnvironmentOutlined />} 
              placeholder="Port Authority of Example"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="organizationType"
                label="Organization Type"
                rules={[
                  { required: true, message: 'Please select organization type' }
                ]}
              >
                <Select placeholder="Select type" style={{ borderRadius: 8 }}>
                  <Option value="port_authority">Port Authority</Option>
                  <Option value="terminal_operator">Terminal Operator</Option>
                  <Option value="shipping_line">Shipping Line</Option>
                  <Option value="logistics_company">Logistics Company</Option>
                  <Option value="government">Government Agency</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter your phone number' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="+1 (555) 123-4567"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Terms and Conditions */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject('Please accept the terms and conditions'),
              },
            ]}
            style={{ marginBottom: 24 }}
          >
            <Checkbox>
              I agree to the{' '}
              <a href="/terms" target="_blank" style={{ color: '#1890ff' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" style={{ color: '#1890ff' }}>
                Privacy Policy
              </a>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={state.loading}
              block
              style={{ 
                height: 48, 
                borderRadius: 8,
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1890ff', fontWeight: 500 }}>
              Sign in here
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 BerthBoard. Professional Port Management System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Signup;