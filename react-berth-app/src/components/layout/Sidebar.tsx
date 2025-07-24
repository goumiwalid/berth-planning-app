import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CarOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ExportOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;
const { Title } = Typography;

interface SidebarProps {
  collapsed: boolean;
  userRole?: UserRole; // Keep for backward compatibility, but use auth context
}

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  userRole,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  
  // Use authenticated user role, fallback to prop
  const currentUserRole = state.user?.role || userRole || 'viewer';

  // Get current selected key from location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/vessels')) return 'vessels-list';
    if (path.startsWith('/planning')) return 'planning-gantt';
    if (path.startsWith('/analytics')) return 'analytics-overview';
    if (path.startsWith('/exports')) return 'exports-reports';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/admin')) return 'administration';
    return 'dashboard';
  };

  // Check if user has required role for a feature
  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Admin can access everything
    if (currentUserRole === 'admin') return true;
    
    return roles.includes(currentUserRole);
  };
  
  // Define menu items based on user role with enhanced permissions
  const getMenuItems = (): MenuItem[] => {
    const menuItems: MenuItem[] = [];

    // Dashboard - available to all users
    menuItems.push({
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    });

    // Vessel Management - different permissions based on role
    const vesselChildren: MenuItem[] = [
      {
        key: 'vessels-list',
        label: 'All Vessels',
      },
    ];

    if (hasRole(['planner', 'admin'])) {
      vesselChildren.push(
        {
          key: 'vessels-schedule',
          label: 'Schedule View',
        },
        {
          key: 'vessels-add',
          label: 'Add Vessel',
        }
      );
    }

    menuItems.push({
      key: 'vessels',
      icon: <CarOutlined />,
      label: 'Vessel Management',
      children: vesselChildren,
    });

    // Berth Planning - planners and admins only
    if (hasRole(['planner', 'admin'])) {
      const planningChildren: MenuItem[] = [
        {
          key: 'planning-gantt',
          label: 'Timeline View',
        },
        {
          key: 'planning-conflicts',
          label: 'Conflict Resolution',
        },
      ];

      if (hasRole('admin')) {
        planningChildren.push({
          key: 'planning-optimization',
          label: 'Auto Scheduling',
        });
      }

      menuItems.push({
        key: 'planning',
        icon: <ScheduleOutlined />,
        label: 'Berth Planning',
        children: planningChildren,
      });
    }

    // Analytics - available to all, but different levels
    const analyticsChildren: MenuItem[] = [
      {
        key: 'analytics-overview',
        label: 'Performance Overview',
      },
    ];

    if (hasRole(['planner', 'admin'])) {
      analyticsChildren.push(
        {
          key: 'analytics-utilization',
          label: 'Berth Utilization',
        },
        {
          key: 'analytics-trends',
          label: 'Historical Trends',
        }
      );
    }

    menuItems.push({
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics & Reports',
      children: analyticsChildren,
    });

    // Export & Sharing - planners and admins
    if (hasRole(['planner', 'admin'])) {
      menuItems.push({
        key: 'exports',
        icon: <ExportOutlined />,
        label: 'Export & Sharing',
        children: [
          {
            key: 'exports-reports',
            label: 'Generate Reports',
          },
          {
            key: 'exports-schedules',
            label: 'Export Schedules',
          },
          {
            key: 'exports-sharing',
            label: 'Share Links',
          },
        ],
      });
    }

    // Personal section - available to all
    menuItems.push(
      {
        type: 'divider',
      },
      {
        key: 'profile',
        icon: <TeamOutlined />,
        label: 'My Profile',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      }
    );

    // Administration - admins only
    if (hasRole('admin')) {
      menuItems.push(
        {
          type: 'divider',
        },
        {
          key: 'administration',
          icon: <ToolOutlined />,
          label: 'Administration',
          children: [
            {
              key: 'admin-users',
              icon: <TeamOutlined />,
              label: 'User Management',
            },
            {
              key: 'admin-terminals',
              icon: <DatabaseOutlined />,
              label: 'Terminal & Berths',
            },
            {
              key: 'admin-settings',
              icon: <SettingOutlined />,
              label: 'System Settings',
            },
            {
              key: 'admin-audit',
              icon: <FileTextOutlined />,
              label: 'Audit Logs',
            },
          ],
        }
      );
    }

    return menuItems;
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    // Navigate based on menu key
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'vessels-list': '/vessels',
      'vessels-add': '/vessels',
      'planning-gantt': '/planning',
      'planning-conflicts': '/planning/conflicts',
      'analytics-overview': '/analytics',
      'exports-reports': '/exports',
      'profile': '/profile',
      'settings': '/settings',
      'administration': '/admin',
    };

    const route = routeMap[key];
    if (route) {
      navigate(route);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      style={{
        background: '#001529',
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo Area */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          borderBottom: '1px solid #1f1f1f',
        }}
      >
        <div style={{ fontSize: '24px', marginRight: collapsed ? 0 : 12 }}>
          ⚓
        </div>
        {!collapsed && (
          <Title
            level={4}
            style={{
              color: 'white',
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            BerthBoard
          </Title>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        onClick={handleMenuClick}
        items={getMenuItems()}
        style={{
          marginTop: 16,
          border: 'none',
        }}
      />

      {/* Footer */}
      {!collapsed && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            borderTop: '1px solid #1f1f1f',
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          <div>BerthBoard v1.0.0</div>
          <div>Professional Port Management</div>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;