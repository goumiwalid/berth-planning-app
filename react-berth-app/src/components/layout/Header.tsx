import React from 'react';
import {
  Layout,
  Select,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Space,
  Typography,
  DatePicker,
  Breadcrumb,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Terminal, User, Tenant } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { TenantSwitcher } from '../common';

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  currentUser?: User;
  currentTenant?: Tenant;
  terminals: Terminal[];
  selectedTerminalId?: string;
  onTerminalChange: (terminalId: string) => void;
  breadcrumbItems?: Array<{
    title: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
}

const AppHeader: React.FC<HeaderProps> = ({
  collapsed,
  onToggle,
  currentUser,
  currentTenant,
  terminals,
  selectedTerminalId,
  onTerminalChange,
  breadcrumbItems = [],
}) => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const user = state.user || currentUser;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'User Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>Vessel MSC Gulsun arriving soon</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ETA: Today 14:30</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>Berth conflict detected</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>CTA Berth 1 - Check schedule</div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>Daily report generated</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Ready for download</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'all',
      label: 'View All Notifications',
      style: { textAlign: 'center', color: '#1890ff' },
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        await logout();
        navigate('/login');
        break;
    }
  };

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Sidebar Toggle */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: '16px', width: 40, height: 40 }}
        />

        {/* App Title & Tenant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '24px' }}>⚓</div>
          <div>
            <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
              BerthBoard
            </Title>
            {currentTenant && (
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {currentTenant.name}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <Breadcrumb
            items={[
              {
                title: <HomeOutlined />,
                href: '/',
              },
              ...breadcrumbItems,
            ]}
            style={{ marginLeft: 24 }}
          />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Terminal Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '14px', color: '#8c8c8c' }}>Terminal:</span>
          <Select
            value={selectedTerminalId}
            onChange={onTerminalChange}
            style={{ minWidth: 200 }}
            placeholder="Select Terminal"
            suffixIcon={<DashboardOutlined />}
          >
            <Option value="">All Terminals</Option>
            {terminals.map(terminal => (
              <Option key={terminal.id} value={terminal.id}>
                {terminal.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Tenant Switcher */}
        <TenantSwitcher 
          placement="header" 
          showCurrentTenant={false}
          size="middle"
        />

        {/* Date Picker */}
        <DatePicker
          style={{ width: 140 }}
          placeholder="Select Date"
          format="MMM DD, YYYY"
        />

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px', width: 40, height: 40 }}
            />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 6 }}>
            <Avatar
              size="small"
              style={{ backgroundColor: '#1890ff' }}
              src={user?.avatar}
              icon={<UserOutlined />}
            />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                {user?.role?.toUpperCase() || 'ROLE'}
              </div>
            </div>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default AppHeader;