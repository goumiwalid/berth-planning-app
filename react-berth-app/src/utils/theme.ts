import { ThemeConfig } from 'antd';

// Professional SaaS theme configuration for Ant Design
export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#1890ff', // Professional blue
    colorPrimaryHover: '#40a9ff',
    colorPrimaryActive: '#096dd9',
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f0f2f5',
    colorBgSpotlight: '#fafafa',
    
    // Border and divider
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Text colors
    colorText: '#262626',
    colorTextSecondary: '#595959',
    colorTextTertiary: '#8c8c8c',
    colorTextQuaternary: '#bfbfbf',
    
    // Success, warning, error colors
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    // fontSizeHeading6: 14, // Removed as it's not supported
    
    // Spacing
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // Box shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
    
    // Layout - Custom tokens should be removed or moved to components section
    // siderBg: '#001529', // Dark sidebar - removed as not part of AliasToken
    // headerBg: '#ffffff', // removed as not part of AliasToken
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerColor: '#262626',
      siderBg: '#001529',
      triggerBg: '#002140',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemColor: 'rgba(255, 255, 255, 0.85)',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      darkItemSelectedBg: '#1890ff',
      darkSubMenuItemBg: 'transparent',
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
    },
    Card: {
      headerBg: 'transparent',
    },
    Button: {
      primaryShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
    },
    Timeline: {
      dotBg: '#1890ff',
    },
    Steps: {
      colorPrimary: '#1890ff',
    },
    Form: {
      labelColor: '#262626',
      labelRequiredMarkColor: '#ff4d4f',
    },
    Input: {
      hoverBorderColor: '#40a9ff',
      activeBorderColor: '#1890ff',
    },
    Select: {
      optionSelectedBg: '#e6f7ff',
    },
  },
  algorithm: undefined, // Use default algorithm for light theme
};

// Vessel type color mapping
export const vesselTypeColors = {
  Container: '#1890ff', // Blue
  RoRo: '#faad14', // Orange
  Bulk: '#52c41a', // Green
} as const;

// Vessel status color mapping
export const vesselStatusColors = {
  planned: '#8c8c8c', // Gray
  confirmed: '#1890ff', // Blue
  at_berth: '#52c41a', // Green
  completed: '#13c2c2', // Cyan
  delayed: '#ff4d4f', // Red
  cancelled: '#f5222d', // Dark red
} as const;

// Berth capacity color mapping for visualization
export const berthCapacityColors = {
  low: '#52c41a', // Green (0-60%)
  medium: '#faad14', // Orange (60-80%)
  high: '#ff4d4f', // Red (80-100%)
  overbooked: '#f5222d', // Dark red (>100%)
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
} as const;

// Common styled-components theme
export const styledTheme = {
  colors: {
    primary: '#1890ff',
    secondary: '#f0f2f5',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: '#262626',
    textSecondary: '#595959',
    border: '#d9d9d9',
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: '6px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  breakpoints,
};