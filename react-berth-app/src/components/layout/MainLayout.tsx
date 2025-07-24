import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import { Terminal, User, Tenant } from '../../types';
import { MockDataService } from '../../services/mockData';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: Array<{
    title: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  breadcrumbItems = [],
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Mock current user and tenant - in real app, these would come from auth context
  const currentUser: User = {
    id: 'user1',
    email: 'admin@porthamburg.com',
    name: 'Hans Mueller',
    role: 'admin',
    tenantId: 'tenant1',
    avatar: '👨‍💼',
  };

  const currentTenant: Tenant = {
    id: 'tenant1',
    name: 'Port Authority of Hamburg',
    logo: '🏢',
    theme: {
      primaryColor: '#1890ff',
      secondaryColor: '#f0f2f5',
    },
  };

  useEffect(() => {
    const loadTerminals = async () => {
      try {
        setLoading(true);
        const terminalData = await MockDataService.getTerminals(currentTenant.id);
        setTerminals(terminalData);
        
        // Set first terminal as default if none selected
        if (!selectedTerminalId && terminalData.length > 0) {
          setSelectedTerminalId(terminalData[0].id);
        }
      } catch (error) {
        console.error('Failed to load terminals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTerminals();
  }, [currentTenant.id, selectedTerminalId]);

  const handleSidebarToggle = () => {
    setCollapsed(!collapsed);
  };

  // Removed handleMenuSelect as navigation is now handled in Sidebar

  const handleTerminalChange = (terminalId: string) => {
    setSelectedTerminalId(terminalId);
    // Save to localStorage for persistence
    localStorage.setItem('berth_app_last_terminal', terminalId);
  };

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        userRole={currentUser.role}
      />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* Header */}
        <Header
          collapsed={collapsed}
          onToggle={handleSidebarToggle}
          currentUser={currentUser}
          currentTenant={currentTenant}
          terminals={terminals}
          selectedTerminalId={selectedTerminalId}
          onTerminalChange={handleTerminalChange}
          breadcrumbItems={breadcrumbItems}
        />

        {/* Main Content */}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto',
          }}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
            >
              <div>Loading...</div>
            </div>
          ) : (
            children
          )}
        </Content>
      </Layout>

      {/* Mobile Overlay */}
      {!collapsed && window.innerWidth < 768 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
    </Layout>
  );
};

export default MainLayout;