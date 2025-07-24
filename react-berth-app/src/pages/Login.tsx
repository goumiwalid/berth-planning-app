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
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, state } = useAuth();

  const handleLogin = async (values: LoginFormData) => {
    try {
      await login(values);
      message.success('Welcome back to BerthBoard!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

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
          maxWidth: 420,
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
            BerthBoard
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Professional Port Management
          </Text>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter your email"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Enter your password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                Forgot password?
              </Link>
            </Col>
          </Row>

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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">Demo Accounts</Text>
        </Divider>

        {/* Demo Credentials */}
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          <Card size="small" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <Text strong>Admin:</Text> admin@berthboard.com / admin123<br/>
            <Text strong>Planner:</Text> planner@berthboard.com / planner123
          </Card>
        </Space>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1890ff', fontWeight: 500 }}>
              Sign up here
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

export default Login;