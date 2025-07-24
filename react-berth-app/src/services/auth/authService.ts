import { LoginFormData, SignupFormData, AuthUser, Tenant } from '../../types';

// API Response interfaces
interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

interface SignupResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  message: string;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

// Mock API delay function
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock tenants database
const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant1',
    name: 'Port Authority of Singapore',
    logo: '🚢',
    theme: {
      primaryColor: '#1890ff',
      secondaryColor: '#096dd9',
    },
  },
  {
    id: 'tenant2', 
    name: 'Los Angeles Port',
    logo: '⚓',
    theme: {
      primaryColor: '#52c41a',
      secondaryColor: '#389e0d',
    },
  },
  {
    id: 'tenant3',
    name: 'Hamburg Maritime Hub',
    logo: '🏗️',
    theme: {
      primaryColor: '#722ed1',
      secondaryColor: '#531dab',
    },
  },
  {
    id: 'tenant4',
    name: 'Dubai Ports World',
    logo: '🏭',
    theme: {
      primaryColor: '#fa8c16',
      secondaryColor: '#d46b08',
    },
  },
];

// Mock users database with tenant access
const MOCK_USERS = [
  {
    id: '1',
    name: 'Global Admin',
    email: 'admin@berthboard.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin' as const,
    tenantId: 'tenant1',
    jobTitle: 'Global Administrator',
    organizationName: 'BerthBoard Corporation',
    phoneNumber: '+1 (555) 123-4567',
    avatar: undefined,
    bio: 'Experienced system administrator with global port operations expertise.',
    createdAt: '2024-01-01T00:00:00.000Z',
    // Super admin has access to all tenants
    availableTenants: ['tenant1', 'tenant2', 'tenant3', 'tenant4'],
  },
  {
    id: '2',
    name: 'Multi-Port Manager',
    email: 'planner@berthboard.com',
    password: 'planner123',
    role: 'planner' as const,
    tenantId: 'tenant1',
    jobTitle: 'Regional Operations Manager',
    organizationName: 'Port Authority',
    phoneNumber: '+1 (555) 987-6543',
    avatar: undefined,
    bio: 'Managing operations across multiple port terminals.',
    createdAt: '2024-01-01T00:00:00.000Z',
    // Manager has access to multiple ports
    availableTenants: ['tenant1', 'tenant2'],
  },
  {
    id: '3',
    name: 'Port Analyst',
    email: 'viewer@berthboard.com',
    password: 'viewer123',
    role: 'viewer' as const,
    tenantId: 'tenant1',
    jobTitle: 'Operations Analyst',
    organizationName: 'Maritime Logistics Inc',
    phoneNumber: '+1 (555) 456-7890',
    avatar: undefined,
    bio: 'Analyzing port operations and performance metrics.',
    createdAt: '2024-01-01T00:00:00.000Z',
    // Analyst has limited access
    availableTenants: ['tenant1'],
  },
  {
    id: '4',
    name: 'LA Port Manager',
    email: 'la@berthboard.com',
    password: 'la123',
    role: 'planner' as const,
    tenantId: 'tenant2',
    jobTitle: 'Terminal Operations Manager',
    organizationName: 'Los Angeles Port',
    phoneNumber: '+1 (310) 555-0123',
    avatar: undefined,
    bio: 'Specializing in Los Angeles port terminal operations.',
    createdAt: '2024-01-01T00:00:00.000Z',
    availableTenants: ['tenant2'],
  },
];

class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    await delay(1500); // Simulate network delay

    // Mock authentication
    const user = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create auth user object (remove password)
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      jobTitle: user.jobTitle,
      organizationName: user.organizationName,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: new Date().toISOString(),
    };

    const token = this.generateMockToken(user.id);
    const refreshToken = this.generateMockRefreshToken(user.id);

    return {
      user: authUser,
      token,
      refreshToken,
    };
  }

  /**
   * Register new user
   */
  async signup(userData: SignupFormData): Promise<SignupResponse> {
    await delay(2000); // Simulate network delay

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.fullName,
      email: userData.email,
      role: 'viewer', // Default role for new signups
      tenantId: 'tenant1', // Default tenant
      jobTitle: userData.jobTitle,
      organizationName: userData.organizationName,
      phoneNumber: userData.phoneNumber,
      avatar: undefined,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const token = this.generateMockToken(newUser.id);
    const refreshToken = this.generateMockRefreshToken(newUser.id);

    // In real implementation, save user to database
    // MOCK_USERS.push({ ...newUser, password: userData.password });

    return {
      user: newUser,
      token,
      refreshToken,
      message: 'Account created successfully! Welcome to BerthBoard.',
    };
  }

  /**
   * Logout user (invalidate tokens)
   */
  async logout(token: string): Promise<{ success: boolean }> {
    await delay(500);
    
    // In real implementation, invalidate token on server
    return { success: true };
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    await delay(500);

    // In real implementation, validate refresh token and return new tokens
    const userId = this.extractUserIdFromToken(refreshToken);
    if (!userId) {
      throw new Error('Invalid refresh token');
    }

    return {
      token: this.generateMockToken(userId),
      refreshToken: this.generateMockRefreshToken(userId),
    };
  }

  /**
   * Send password reset email
   */
  async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    await delay(1500);

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      // For security, don't reveal if email exists or not
      return {
        message: 'If an account with that email exists, we have sent password reset instructions.',
        success: true,
      };
    }

    return {
      message: 'Password reset instructions have been sent to your email.',
      success: true,
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    await delay(1000);

    // In real implementation, validate reset token and update password
    return { success: true };
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    await delay(1000);

    return {
      success: true,
      message: 'Email verified successfully!',
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    await delay(1000);

    // In real implementation, update user in database
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Simulate updated user
    const updatedUser: AuthUser = {
      ...MOCK_USERS[userIndex],
      ...updates,
      id: userId, // Ensure ID cannot be changed
    };

    return updatedUser;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    await delay(1000);

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user || user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // In real implementation, hash and save new password
    return { success: true };
  }

  /**
   * Get available tenants for a user
   */
  async getUserTenants(userId: string): Promise<Tenant[]> {
    await delay(300);

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const availableTenants = user.availableTenants || [user.tenantId];
    return MOCK_TENANTS.filter(tenant => availableTenants.includes(tenant.id));
  }

  /**
   * Switch user's current tenant
   */
  async switchTenant(userId: string, newTenantId: string): Promise<{ user: AuthUser; token: string }> {
    await delay(800);

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const availableTenants = user.availableTenants || [user.tenantId];
    if (!availableTenants.includes(newTenantId)) {
      throw new Error('Access denied: You do not have permission to access this tenant');
    }

    const tenant = MOCK_TENANTS.find(t => t.id === newTenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Create updated user with new tenant
    const updatedUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: newTenantId,
      avatar: user.avatar,
      jobTitle: user.jobTitle,
      organizationName: tenant.name, // Update organization to reflect new tenant
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      lastLoginAt: new Date().toISOString(),
      createdAt: user.createdAt,
    };

    const token = this.generateMockToken(user.id);
    
    return { user: updatedUser, token };
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    await delay(200);

    const tenant = MOCK_TENANTS.find(t => t.id === tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return tenant;
  }

  // Helper methods for mock tokens
  private generateMockToken(userId: string): string {
    return `mock_jwt_${userId}_${Date.now()}`;
  }

  private generateMockRefreshToken(userId: string): string {
    return `mock_refresh_${userId}_${Date.now()}`;
  }

  private extractUserIdFromToken(token: string): string | null {
    // Simple mock token parsing
    const parts = token.split('_');
    return parts.length >= 3 ? parts[2] : null;
  }

  /**
   * Validate token (for checking if user is still authenticated)
   */
  async validateToken(token: string): Promise<{ valid: boolean; user?: AuthUser }> {
    await delay(300);

    // In real implementation, validate token with server
    const userId = this.extractUserIdFromToken(token);
    if (!userId) {
      return { valid: false };
    }

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      return { valid: false };
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      jobTitle: user.jobTitle,
      organizationName: user.organizationName,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: new Date().toISOString(),
    };

    return { valid: true, user: authUser };
  }
}

export const authService = new AuthService();
export default authService;