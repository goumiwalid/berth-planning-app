import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would typically send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div style={{ padding: '40px 20px', minHeight: '400px' }}>
          <Result
            status="error"
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Something went wrong"
            subTitle="We're sorry, but something unexpected happened. Please try one of the options below."
            extra={
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space>
                  <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleRetry}>
                    Try Again
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={this.handleReload}>
                    Reload Page
                  </Button>
                  <Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
                    Go to Dashboard
                  </Button>
                </Space>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
                    <Paragraph>
                      <Text strong>Error Details (Development Mode):</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text type="danger">{this.state.error.message}</Text>
                    </Paragraph>
                    {this.state.errorInfo && (
                      <Paragraph>
                        <Text code style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                          {this.state.errorInfo.componentStack}
                        </Text>
                      </Paragraph>
                    )}
                  </div>
                )}
              </Space>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;