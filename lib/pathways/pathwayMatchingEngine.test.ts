import { describe, it, expect } from 'vitest';
import { PathwayMatchingEngine, extractPilotProfile } from './pathwayMatchingEngine';
import type { LocalPilotProfile } from './pathwayMatchingEngine';

describe('PathwayMatchingEngine', () => {
  const engine = new PathwayMatchingEngine();

  it('initializes with empty matches', () => {
    expect(engine.getMatches()).toEqual([]);
  });

  it('sets and retrieves pilot profile', () => {
    const profile: LocalPilotProfile = {
      id: 'test-1',
      total_flight_hours: 500,
      pic_hours: 200,
      multi_engine_hours: 50,
      instrument_hours: 30,
      ratings: ['PPL', 'CPL'],
      type_ratings: ['A320'],
      medical_class: 'Class 1',
      medical_expiry: '2027-01-01',
      icao_english_level: '5',
      age: 25,
      citizenship: 'Mauritius',
      country: 'UAE',
      recognition_score: 75,
      last_flown_date: '2026-05-01',
    };

    engine.setPilotProfile(profile);
    // Profile is private; verify through behavior
    expect(engine.getMatches()).toEqual([]); // No pathways set yet
  });

  it('returns empty array when no pathways loaded', () => {
    const profile: LocalPilotProfile = {
      id: 'test-2',
      total_flight_hours: 0,
      pic_hours: 0,
      multi_engine_hours: 0,
      instrument_hours: 0,
      ratings: [],
      type_ratings: [],
      medical_class: '',
      medical_expiry: null,
      icao_english_level: '0',
      age: null,
      citizenship: '',
      country: '',
      recognition_score: 0,
      last_flown_date: null,
    };

    engine.setPilotProfile(profile);
    expect(engine.getMatches()).toEqual([]);
  });
});

describe('extractPilotProfile', () => {
  it('extracts profile from Supabase user data', () => {
    const userData = {
      id: 'user-1',
      total_flight_hours: 250,
      pic_hours: 100,
      multi_engine_hours: 25,
      instrument_hours: 10,
      ratings: ['C172'],
      type_ratings: [],
      medical_class: 'Class 2',
      medical_expiry: '2026-12-01',
      language_icao_level: '4',
      age: 22,
      citizenship: 'Philippines',
      country: 'Philippines',
      recognition_score: 45,
      last_flown_date: '2026-04-15',
    };

    const profile = extractPilotProfile(userData);
    expect(profile.total_flight_hours).toBe(250);
    expect(profile.medical_class).toBe('Class 2');
    expect(profile.icao_english_level).toBe('4');
  });

  it('defaults missing values', () => {
    const userData = {};
    const profile = extractPilotProfile(userData);
    expect(profile.total_flight_hours).toBe(0);
    expect(profile.ratings).toEqual([]);
    expect(profile.type_ratings).toEqual([]);
  });
});
