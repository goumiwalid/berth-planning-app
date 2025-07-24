import React from 'react';
import { ConfigProvider } from 'antd';
import AppRouter from './router';
import { antdTheme } from './utils/theme';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ConfigProvider theme={antdTheme}>
          <AppRouter />
        </ConfigProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;