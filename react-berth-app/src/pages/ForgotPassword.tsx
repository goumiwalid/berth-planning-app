import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message,
  Result
} from 'antd';
import {
  MailOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      
      // Mock password reset - replace with real service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmail(values.email);
      setEmailSent(true);
      message.success('Password reset instructions sent to your email');
    } catch (error) {
      message.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
            maxWidth: 450,
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: 'none'
          }}
          bodyStyle={{ padding: '48px 32px' }}
        >
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Check Your Email"
            subTitle={
              <div style={{ textAlign: 'left' }}>
                <Paragraph>
                  We've sent password reset instructions to:
                </Paragraph>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  {email}
                </Text>
                <Paragraph style={{ marginTop: 16 }}>
                  Please check your email and follow the instructions to reset your password. 
                  The link will expire in 24 hours.
                </Paragraph>
                <Paragraph>
                  Didn't receive the email? Check your spam folder or{' '}
                  <Button type="link" style={{ padding: 0 }} onClick={() => setEmailSent(false)}>
                    try again
                  </Button>
                </Paragraph>
              </div>
            }
            extra={[
              <Button type="primary" key="back" icon={<ArrowLeftOutlined />}>
                <Link to="/login" style={{ color: 'inherit' }}>
                  Back to Login
                </Link>
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

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
            Reset Password
          </Title>
          <Paragraph type="secondary" style={{ fontSize: '16px', marginTop: 8 }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Paragraph>
        </div>

        {/* Reset Form */}
        <Form
          form={form}
          name="forgot-password"
          onFinish={handleSubmit}
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
              placeholder="Enter your email address"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 24 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ 
                height: 48, 
                borderRadius: 8,
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Send Reset Instructions
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#1890ff', fontWeight: 500 }}>
              Back to Login
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

export default ForgotPassword;