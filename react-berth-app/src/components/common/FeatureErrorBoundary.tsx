import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Alert, Button, Space } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  featureName?: string;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error(`Error in ${this.props.featureName || 'component'}:`, error, errorInfo);
    
    // In production, send to error reporting service
    // Example: reportError(error, { feature: this.props.featureName, ...errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const featureName = this.props.featureName || 'feature';
      const errorMessage = `Failed to load ${featureName}. There was an unexpected error.`;

      return (
        <div style={{ padding: '16px' }}>
          <Alert
            message={`${featureName} Error`}
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>{errorMessage}</div>
                {this.props.showDetails && this.state.error && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Error Details:</strong>
                    <pre style={{ 
                      fontSize: '12px', 
                      background: '#f5f5f5', 
                      padding: '8px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}>
                      {this.state.error.message}
                    </pre>
                  </div>
                )}
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<ReloadOutlined />} 
                  onClick={this.handleRetry}
                >
                  Retry
                </Button>
              </Space>
            }
            type="error"
            icon={<BugOutlined />}
            showIcon
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default FeatureErrorBoundary;