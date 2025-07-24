import dayjs from 'dayjs';
import { 
  Tenant, User, Terminal, Berth, Vessel, VesselType, VesselStatus,
  DashboardMetrics 
} from '../types';
import { generateId, generateVoyageNumber } from '../utils';

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: 'tenant1',
    name: 'Port Authority of Hamburg',
    logo: '🏢',
    theme: {
      primaryColor: '#1890ff',
      secondaryColor: '#f0f2f5',
    },
  },
  {
    id: 'tenant2',
    name: 'Mediterranean Ports Group',
    logo: '🌊',
    theme: {
      primaryColor: '#722ed1',
      secondaryColor: '#f6f4ff',
    },
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@porthamburg.com',
    name: 'Hans Mueller',
    role: 'admin',
    tenantId: 'tenant1',
    avatar: '👨‍💼',
  },
  {
    id: 'user2',
    email: 'planner@porthamburg.com',
    name: 'Anna Schmidt',
    role: 'planner',
    tenantId: 'tenant1',
    avatar: '👩‍💼',
  },
];

// Mock Terminals
export const mockTerminals: Terminal[] = [
  {
    id: 'terminal1',
    name: 'Container Terminal Altenwerder',
    tenantId: 'tenant1',
    location: 'Hamburg, Germany',
    isActive: true,
  },
  {
    id: 'terminal2',
    name: 'Eurogate Container Terminal',
    tenantId: 'tenant1',
    location: 'Hamburg, Germany',
    isActive: true,
  },
  {
    id: 'terminal3',
    name: 'RoRo Terminal Waltershof',
    tenantId: 'tenant1',
    location: 'Hamburg, Germany',
    isActive: true,
  },
];

// Mock Berths
export const mockBerths: Berth[] = [
  // Container Terminal Altenwerder
  {
    id: 'berth1',
    name: 'CTA Berth 1',
    terminalId: 'terminal1',
    lengthM: 400,
    maxDraft: 16.5,
    isActive: true,
    position: 1,
  },
  {
    id: 'berth2',
    name: 'CTA Berth 2',
    terminalId: 'terminal1',
    lengthM: 350,
    maxDraft: 16.5,
    isActive: true,
    position: 2,
  },
  {
    id: 'berth3',
    name: 'CTA Berth 3',
    terminalId: 'terminal1',
    lengthM: 300,
    maxDraft: 14.0,
    isActive: true,
    position: 3,
  },
  // Eurogate Container Terminal
  {
    id: 'berth4',
    name: 'ECT Berth A',
    terminalId: 'terminal2',
    lengthM: 380,
    maxDraft: 15.0,
    isActive: true,
    position: 1,
  },
  {
    id: 'berth5',
    name: 'ECT Berth B',
    terminalId: 'terminal2',
    lengthM: 320,
    maxDraft: 15.0,
    isActive: true,
    position: 2,
  },
  // RoRo Terminal
  {
    id: 'berth6',
    name: 'RoRo Berth 1',
    terminalId: 'terminal3',
    lengthM: 200,
    maxDraft: 8.0,
    isActive: true,
    position: 1,
  },
  {
    id: 'berth7',
    name: 'RoRo Berth 2',
    terminalId: 'terminal3',
    lengthM: 180,
    maxDraft: 8.0,
    isActive: true,
    position: 2,
  },
];

// Generate mock vessels
const generateMockVessel = (
  index: number,
  terminalId: string,
  berthId: string,
  vesselType: VesselType,
  status: VesselStatus,
  daysFromNow: number = 0,
  durationHours: number = 8
): Vessel => {
  const eta = dayjs().add(daysFromNow, 'day').add(index * 2, 'hour').toISOString();
  const etd = dayjs(eta).add(durationHours, 'hour').toISOString();
  
  const vesselNames = {
    Container: ['MSC Gulsun', 'OOCL Hong Kong', 'CMA CGM Antoine de Saint Exupery', 'Ever Ace', 'HMM Algeciras'],
    RoRo: ['Color Fantasy', 'Stena Superfast', 'Finnstar', 'MS Crown Seaways', 'Color Magic'],
    Bulk: ['Iron Baron', 'Bulk Jupiter', 'Cape Glory', 'Ore Brazil', 'Pacific Bulker']
  };
  
  const operators = {
    Container: ['Maersk Line', 'MSC', 'CMA CGM', 'COSCO', 'Evergreen'],
    RoRo: ['Stena Line', 'Color Line', 'Finnlines', 'DFDS', 'Tallink'],
    Bulk: ['BHP Billiton', 'Vale', 'Cargill', 'Oldendorff', 'Star Bulk']
  };

  return {
    id: generateId(),
    voyageNumber: generateVoyageNumber(),
    vesselName: vesselNames[vesselType][index % vesselNames[vesselType].length],
    vesselType,
    operator: operators[vesselType][index % operators[vesselType].length],
    routeInfo: vesselType === 'Container' ? 'Asia-Europe' : vesselType === 'RoRo' ? 'Northern Europe' : 'Australia-Europe',
    eta,
    etd,
    loa: vesselType === 'Container' ? 300 + (index * 10) : vesselType === 'RoRo' ? 150 + (index * 5) : 250 + (index * 8),
    draft: vesselType === 'Container' ? 12 + (index * 0.5) : vesselType === 'RoRo' ? 6 + (index * 0.3) : 10 + (index * 0.4),
    terminalId,
    berthId,
    status,
    createdAt: dayjs().subtract(index, 'day').toISOString(),
    updatedAt: dayjs().subtract(index / 2, 'hour').toISOString(),
  };
};

// Mock Vessels
export const mockVessels: Vessel[] = [
  // Container Terminal Altenwerder vessels
  generateMockVessel(0, 'terminal1', 'berth1', 'Container', 'confirmed', -1, 12),
  generateMockVessel(1, 'terminal1', 'berth2', 'Container', 'at_berth', 0, 10),
  generateMockVessel(2, 'terminal1', 'berth3', 'Container', 'planned', 1, 8),
  generateMockVessel(3, 'terminal1', 'berth1', 'Container', 'planned', 2, 14),
  generateMockVessel(4, 'terminal1', 'berth2', 'Container', 'confirmed', 3, 9),
  
  // Eurogate vessels
  generateMockVessel(5, 'terminal2', 'berth4', 'Container', 'at_berth', 0, 11),
  generateMockVessel(6, 'terminal2', 'berth5', 'Container', 'planned', 1, 7),
  generateMockVessel(7, 'terminal2', 'berth4', 'Container', 'confirmed', 4, 13),
  
  // RoRo Terminal vessels
  generateMockVessel(8, 'terminal3', 'berth6', 'RoRo', 'completed', -2, 4),
  generateMockVessel(9, 'terminal3', 'berth7', 'RoRo', 'at_berth', 0, 6),
  generateMockVessel(10, 'terminal3', 'berth6', 'RoRo', 'confirmed', 1, 5),
  generateMockVessel(11, 'terminal3', 'berth7', 'RoRo', 'planned', 2, 4),
  
  // Additional vessels for analytics
  generateMockVessel(12, 'terminal1', 'berth3', 'Bulk', 'planned', 5, 16),
  generateMockVessel(13, 'terminal2', 'berth5', 'Bulk', 'confirmed', 6, 18),
  generateMockVessel(14, 'terminal1', 'berth1', 'Container', 'delayed', 1, 10),
];

// Mock Dashboard Metrics
export const generateMockDashboardMetrics = (): DashboardMetrics => {
  const vessels = mockVessels;
  const now = dayjs();
  const upcomingArrivals = vessels.filter(v => 
    dayjs(v.eta).isAfter(now) && dayjs(v.eta).isBefore(now.add(24, 'hour'))
  ).length;

  const vesselsByType = vessels.reduce((acc, vessel) => {
    acc[vessel.vesselType] = (acc[vessel.vesselType] || 0) + 1;
    return acc;
  }, {} as Record<VesselType, number>);

  // Generate daily throughput for last 7 days
  const dailyThroughput = Array.from({ length: 7 }, (_, i) => ({
    date: now.subtract(6 - i, 'day').format('YYYY-MM-DD'),
    count: Math.floor(Math.random() * 10) + 5,
  }));

  return {
    totalVessels: vessels.length,
    upcomingArrivals,
    berthUtilization: 72.5, // Mock percentage
    operationalDelays: vessels.filter(v => v.status === 'delayed').length,
    vesselsByType,
    dailyThroughput,
  };
};

// Mock API delay simulation
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock data service
export class MockDataService {
  static async getTenants(): Promise<Tenant[]> {
    await simulateApiDelay();
    return mockTenants;
  }

  static async getUsers(tenantId: string): Promise<User[]> {
    await simulateApiDelay();
    return mockUsers.filter(user => user.tenantId === tenantId);
  }

  static async getTerminals(tenantId: string): Promise<Terminal[]> {
    await simulateApiDelay();
    return mockTerminals.filter(terminal => terminal.tenantId === tenantId);
  }

  static async getBerths(terminalId?: string): Promise<Berth[]> {
    await simulateApiDelay();
    return terminalId 
      ? mockBerths.filter(berth => berth.terminalId === terminalId)
      : mockBerths;
  }

  static async getVessels(terminalId?: string): Promise<Vessel[]> {
    await simulateApiDelay();
    return terminalId 
      ? mockVessels.filter(vessel => vessel.terminalId === terminalId)
      : mockVessels;
  }

  static async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
    await simulateApiDelay();
    return generateMockDashboardMetrics();
  }

  static async createVessel(vessel: Omit<Vessel, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Vessel> {
    await simulateApiDelay();
    const newVessel: Vessel = {
      ...vessel,
      id: generateId(),
      status: 'planned',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };
    mockVessels.push(newVessel);
    return newVessel;
  }

  static async updateVessel(id: string, updates: Partial<Vessel>): Promise<Vessel> {
    await simulateApiDelay();
    const index = mockVessels.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vessel not found');
    
    mockVessels[index] = {
      ...mockVessels[index],
      ...updates,
      updatedAt: dayjs().toISOString(),
    };
    return mockVessels[index];
  }

  static async deleteVessel(id: string): Promise<void> {
    await simulateApiDelay();
    const index = mockVessels.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vessel not found');
    
    mockVessels.splice(index, 1);
  }
}