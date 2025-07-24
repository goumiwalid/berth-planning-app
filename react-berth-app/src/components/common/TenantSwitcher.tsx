import React, { useState, useEffect } from 'react';
import {
  Select,
  Avatar,
  Space,
  Typography,
  Spin,
  message,
  Tooltip,
  Button,
  Divider,
} from 'antd';
import {
  SwapOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { Tenant } from '../../types';

const { Text } = Typography;
const { Option } = Select;

interface TenantSwitcherProps {
  placement?: 'header' | 'dropdown';
  showCurrentTenant?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  placement = 'header',
  showCurrentTenant = true,
  size = 'middle',
  style,
}) => {
  const { state, switchTenant, getUserTenants, getCurrentTenant } = useAuth();
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [switchingTenant, setSwitchingTenant] = useState<string | null>(null);

  // Load available tenants and current tenant on mount
  useEffect(() => {
    const loadTenantData = async () => {
      if (!state.user) return;

      try {
        setLoading(true);
        const [tenants, tenant] = await Promise.all([
          getUserTenants(),
          getCurrentTenant(),
        ]);
        
        setAvailableTenants(tenants);
        setCurrentTenant(tenant);
      } catch (error) {
        console.error('Failed to load tenant data:', error);
        message.error('Failed to load tenant information');
      } finally {
        setLoading(false);
      }
    };

    loadTenantData();
  }, [state.user, getUserTenants, getCurrentTenant]);

  const handleTenantSwitch = async (tenantId: string) => {
    if (tenantId === currentTenant?.id) return;

    try {
      setSwitchingTenant(tenantId);
      await switchTenant(tenantId);
      
      // Update current tenant
      const newTenant = availableTenants.find(t => t.id === tenantId);
      setCurrentTenant(newTenant || null);
      
      message.success(
        <span>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
          Switched to {newTenant?.name || 'Unknown Tenant'}
        </span>
      );
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Failed to switch tenant'
      );
    } finally {
      setSwitchingTenant(null);
    }
  };

  if (!state.user || loading) {
    return <Spin size="small" />;
  }

  // Don't show switcher if user has access to only one tenant
  if (availableTenants.length <= 1) {
    return showCurrentTenant && currentTenant ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
        <Text style={{ fontSize: size === 'small' ? '12px' : '14px', color: '#8c8c8c' }}>
          {currentTenant.logo} {currentTenant.name}
        </Text>
      </div>
    ) : null;
  }

  const isHeaderPlacement = placement === 'header';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      {showCurrentTenant && currentTenant && isHeaderPlacement && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar
            size={size === 'small' ? 20 : 24}
            style={{ 
              backgroundColor: currentTenant.theme?.primaryColor || '#1890ff',
              fontSize: size === 'small' ? '10px' : '12px',
            }}
          >
            {currentTenant.logo || '🏢'}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: size === 'small' ? '12px' : '14px' }}>
              {currentTenant.name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Current Organization
            </Text>
          </div>
        </div>
      )}

      <Tooltip title="Switch Organization">
        <Select
          value={currentTenant?.id}
          onChange={handleTenantSwitch}
          loading={switchingTenant !== null}
          style={{ 
            minWidth: isHeaderPlacement ? 200 : 160,
            ...(isHeaderPlacement ? {} : { width: '100%' })
          }}
          size={size}
          suffixIcon={
            switchingTenant ? <Spin size="small" /> : <SwapOutlined />
          }
          placeholder="Switch Organization"
          optionLabelProp="label"
          dropdownRender={(menu) => (
            <div>
              <div style={{ padding: '8px 12px', background: '#fafafa' }}>
                <Space>
                  <GlobalOutlined />
                  <Text strong>Available Organizations</Text>
                </Space>
              </div>
              <Divider style={{ margin: 0 }} />
              {menu}
            </div>
          )}
        >
          {availableTenants.map((tenant) => (
            <Option
              key={tenant.id}
              value={tenant.id}
              label={tenant.name}
              disabled={switchingTenant === tenant.id}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <Avatar
                  size={24}
                  style={{ 
                    backgroundColor: tenant.theme?.primaryColor || '#1890ff',
                    fontSize: '12px',
                  }}
                >
                  {tenant.logo || '🏢'}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong>{tenant.name}</Text>
                    {tenant.id === currentTenant?.id && (
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    )}
                  </div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {tenant.id === currentTenant?.id ? 'Current' : 'Available'}
                  </Text>
                </div>
                {switchingTenant === tenant.id && (
                  <Spin size="small" />
                )}
              </div>
            </Option>
          ))}
        </Select>
      </Tooltip>

      {!isHeaderPlacement && (
        <Button
          type="text"
          icon={<SwapOutlined />}
          size={size}
          onClick={() => {
            // Could open a modal with more tenant management options
            message.info('Tenant management features coming soon!');
          }}
          style={{ opacity: 0.7 }}
        />
      )}
    </div>
  );
};

export default TenantSwitcher;