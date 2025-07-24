import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthUser, LoginFormData, SignupFormData, Tenant } from '../types';
import { authService } from '../services/auth';

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TENANT_SWITCH_START' }
  | { type: 'TENANT_SWITCH_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'TENANT_SWITCH_FAILURE'; payload: string };

// Auth Context Interface
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginFormData) => Promise<void>;
  signup: (userData: SignupFormData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  refreshToken: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  getUserTenants: () => Promise<Tenant[]>;
  getCurrentTenant: () => Promise<Tenant | null>;
}

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true, // Start with loading true to check existing session
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        loading: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'TENANT_SWITCH_START':
      return {
        ...state,
        loading: true,
      };

    case 'TENANT_SWITCH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case 'TENANT_SWITCH_FAILURE':
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        
        // In a real app, you would validate the token with the server here
        // For now, we'll just trust the stored data
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      // Clear invalid session data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginFormData): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Use auth service for login
      const response = await authService.login(credentials);
      
      // Store tokens in localStorage (in real app, use httpOnly cookies)
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  const signup = async (userData: SignupFormData): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // Use auth service for signup
      const response = await authService.signup(userData);

      // Store tokens in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Signup failed' 
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Notify server of logout
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear stored data regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      
      // Update localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: userData 
      });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      // In a real app, this would call the refresh token endpoint
      // For now, just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newToken = 'mock_refreshed_token_' + Date.now();
      localStorage.setItem('auth_token', newToken);
      
      // Update state would happen here if we stored token in state
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Force logout on refresh failure
    }
  };

  const switchTenant = async (tenantId: string) => {
    if (!state.user) {
      throw new Error('No authenticated user');
    }

    try {
      dispatch({ type: 'TENANT_SWITCH_START' });

      const response = await authService.switchTenant(state.user.id, tenantId);

      // Update localStorage with new user data and token
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));

      dispatch({
        type: 'TENANT_SWITCH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ 
        type: 'TENANT_SWITCH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Tenant switch failed' 
      });
      throw error;
    }
  };

  const getUserTenants = async (): Promise<Tenant[]> => {
    if (!state.user) {
      throw new Error('No authenticated user');
    }

    try {
      return await authService.getUserTenants(state.user.id);
    } catch (error) {
      console.error('Failed to get user tenants:', error);
      throw error;
    }
  };

  const getCurrentTenant = async (): Promise<Tenant | null> => {
    if (!state.user?.tenantId) {
      return null;
    }

    try {
      return await authService.getTenant(state.user.tenantId);
    } catch (error) {
      console.error('Failed to get current tenant:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    updateUser,
    refreshToken,
    switchTenant,
    getUserTenants,
    getCurrentTenant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;