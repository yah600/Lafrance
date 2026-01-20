/**
 * User Type Definitions
 * Multi-Division Platform - Each user belongs to one or more divisions
 */

export type UserRole = 'super-admin' | 'division-head' | 'operations-manager' | 'dispatcher' | 'admin' | 'technician' | 'client';

export type DivisionType = 
  | 'plomberie'
  | 'construction'
  | 'toitures'
  | 'isolation'
  | 'conteneurs'
  | 'gutters'
  | 'decks'
  | 'real-estate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: DivisionType; // Primary division for division-specific roles
  divisions?: DivisionType[]; // For users with access to multiple divisions (super-admin, ops manager)
  phone?: string;
  avatar?: string;
  license?: string;
  certifications?: string[];
  active: boolean;
  createdAt: string;
}