import { Injectable, signal } from '@angular/core';

export type UserRole = 'LEARNER' | 'INSTRUCTOR' | 'ORG_ADMIN';

export interface UserPersona {
  callsign: string;
  role: UserRole;
  rank: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public activeRole = signal<UserRole>('LEARNER');

  public personas: Record<UserRole, UserPersona> = {
    LEARNER: {
      callsign: 'Cyber-Adept-01',
      role: 'LEARNER',
      rank: 'Level 3 Quantum Cadet',
      avatar: 'cyber-avatar-1'
    },
    INSTRUCTOR: {
      callsign: 'Prof. Vance Quantum',
      role: 'INSTRUCTOR',
      rank: 'Lead Curriculum Architect',
      avatar: 'instructor-avatar'
    },
    ORG_ADMIN: {
      callsign: 'SysAdmin-Prime',
      role: 'ORG_ADMIN',
      rank: 'Infrastructure Director',
      avatar: 'admin-avatar'
    }
  };

  public currentPersona = signal<UserPersona>(this.personas['LEARNER']);

  public setRole(role: UserRole) {
    this.activeRole.set(role);
    this.currentPersona.set(this.personas[role]);
    localStorage.setItem('synapse_active_role', role);
  }

  constructor() {
    const saved = localStorage.getItem('synapse_active_role') as UserRole;
    if (saved && this.personas[saved]) {
      this.setRole(saved);
    }
  }
}

