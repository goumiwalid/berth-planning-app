import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import minMax from 'dayjs/plugin/minMax';
import { Vessel, ConflictDetection, Berth } from '../types';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(minMax);

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * Calculate duration between two dates in hours
 */
export const calculateDurationHours = (start: string | Date, end: string | Date): number => {
  return dayjs(end).diff(dayjs(start), 'hour', true);
};

/**
 * Check if two time periods overlap
 */
export const doPeriodsOverlap = (
  start1: string | Date,
  end1: string | Date,
  start2: string | Date,
  end2: string | Date
): boolean => {
  const s1 = dayjs(start1);
  const e1 = dayjs(end1);
  const s2 = dayjs(start2);
  const e2 = dayjs(end2);

  return s1.isBefore(e2) && s2.isBefore(e1);
};

/**
 * Detect conflicts between vessels
 */
export const detectVesselConflicts = (
  vessel: Vessel,
  allVessels: Vessel[],
  berths: Berth[]
): ConflictDetection[] => {
  const conflicts: ConflictDetection[] = [];
  const berth = berths.find(b => b.id === vessel.berthId);

  if (!berth) return conflicts;

  // Check for berth overlap conflicts
  const overlappingVessels = allVessels.filter(v => 
    v.id !== vessel.id &&
    v.berthId === vessel.berthId &&
    doPeriodsOverlap(vessel.eta, vessel.etd, v.eta, v.etd)
  );

  overlappingVessels.forEach(conflictingVessel => {
    conflicts.push({
      vesselId: vessel.id,
      conflictType: 'berth_overlap',
      conflictingVesselId: conflictingVessel.id,
      message: `Berth overlap with vessel ${conflictingVessel.vesselName} (${conflictingVessel.voyageNumber})`,
      severity: 'error'
    });
  });

  // Check for draft violations
  if (berth.maxDraft && vessel.draft > berth.maxDraft) {
    conflicts.push({
      vesselId: vessel.id,
      conflictType: 'draft_violation',
      message: `Vessel draft (${vessel.draft}m) exceeds berth maximum (${berth.maxDraft}m)`,
      severity: 'error'
    });
  }

  // Check for length violations (vessel longer than berth)
  if (vessel.loa > berth.lengthM) {
    conflicts.push({
      vesselId: vessel.id,
      conflictType: 'length_violation',
      message: `Vessel length (${vessel.loa}m) exceeds berth length (${berth.lengthM}m)`,
      severity: 'warning'
    });
  }

  return conflicts;
};

/**
 * Calculate berth utilization percentage
 */
export const calculateBerthUtilization = (
  vessels: Vessel[],
  berths: Berth[],
  dateRange: { start: string; end: string }
): number => {
  if (berths.length === 0) return 0;

  const totalHours = berths.length * dayjs(dateRange.end).diff(dayjs(dateRange.start), 'hour');
  
  const occupiedHours = vessels.reduce((total, vessel) => {
    if (doPeriodsOverlap(vessel.eta, vessel.etd, dateRange.start, dateRange.end)) {
      const start = dayjs.max(dayjs(vessel.eta), dayjs(dateRange.start));
      const end = dayjs.min(dayjs(vessel.etd), dayjs(dateRange.end));
      return total + end!.diff(start!, 'hour');
    }
    return total;
  }, 0);

  return Math.min((occupiedHours / totalHours) * 100, 100);
};

/**
 * Generate voyage number
 */
export const generateVoyageNumber = (year?: number): string => {
  const currentYear = year || new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999) + 1;
  const direction = ['E', 'W', 'N', 'S'][Math.floor(Math.random() * 4)];
  return `${currentYear}-${sequence.toString().padStart(3, '0')}-${direction}`;
};

/**
 * Validate voyage number format
 */
export const isValidVoyageNumber = (voyageNumber: string): boolean => {
  const pattern = /^\d{4}-\d{3}-[EWNS]$/;
  return pattern.test(voyageNumber);
};

/**
 * Sort vessels by ETA
 */
export const sortVesselsByETA = (vessels: Vessel[]): Vessel[] => {
  return [...vessels].sort((a, b) => dayjs(a.eta).valueOf() - dayjs(b.eta).valueOf());
};

/**
 * Filter vessels by date range
 */
export const filterVesselsByDateRange = (
  vessels: Vessel[],
  startDate: string,
  endDate: string
): Vessel[] => {
  return vessels.filter(vessel =>
    doPeriodsOverlap(vessel.eta, vessel.etd, startDate, endDate)
  );
};

/**
 * Get vessels arriving within next N hours
 */
export const getUpcomingArrivals = (vessels: Vessel[], hoursAhead = 24): Vessel[] => {
  const now = dayjs();
  const cutoff = now.add(hoursAhead, 'hour');
  
  return vessels.filter(vessel => {
    const eta = dayjs(vessel.eta);
    return eta.isAfter(now) && eta.isBefore(cutoff);
  });
};

/**
 * Calculate vessel turnaround time
 */
export const calculateTurnaroundTime = (vessel: Vessel): number => {
  return calculateDurationHours(vessel.eta, vessel.etd);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};