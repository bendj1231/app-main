/**
 * Service for fetching type rating and manufacturer data from Firebase functions
 */

const FUNCTION_BASE_URL = 'https://us-central1-pilotrecognition-recognition.cloudfunctions.net';

export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  hero_image?: string;
  description: string;
  why_choose_rating?: string;
  founded: number;
  headquarters: string;
  website: string;
  reputation_score: number;
  total_aircraft_count: number;
  market_demand_statistics?: any;
  salary_expectations?: any;
  career_progression?: any;
  expectations?: any;
  training_centers?: any[];
  news_and_updates?: any[];
  user_reviews?: any[];
}

// CamelCase interface for frontend compatibility
export interface ManufacturerCamel {
  id: string;
  name: string;
  logo: string;
  heroImage?: string;
  description: string;
  whyChooseRating?: string;
  founded: number;
  headquarters: string;
  website: string;
  reputationScore: number;
  totalAircraftCount: number;
  marketDemandStatistics?: any;
  salaryExpectations?: any;
  careerProgression?: any;
  expectations?: any;
  trainingCenters?: any[];
  newsAndUpdates?: any[];
  userReviews?: any[];
}

export interface AircraftTypeRating {
  id: string;
  manufacturer_id: string;
  model: string;
  category: 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship' | 'end-of-life';
  subcategory?: string;
  image: string;
  sketchfab_id?: string;
  description: string;
  why_choose_rating?: string;
  demand_level?: 'none' | 'low' | 'high';
  conditionally_new?: 'red' | 'amber' | 'green';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'end-of-life';
  order_backlog?: { orders: number; delivered: number };
  operator_count?: number;
  total_deliveries?: number;
  steep_approach_certified?: boolean;
  engine_type?: string;
  range_versatility?: 'short' | 'medium' | 'long' | 'versatile';
  cabin_features?: string[];
  news?: any[];
  career_score?: number;
  pilot_count?: number;
  first_flight: number;
  specifications: any;
  training_requirements: any;
  training_curriculum?: any[];
  simulator_details?: any;
  instructor_qualifications?: any[];
  certification?: any;
  success_stories?: any[];
  faq?: any[];
  career_info?: any;
}

// CamelCase interface for frontend compatibility
export interface AircraftTypeRatingCamel {
  id: string;
  manufacturerId: string;
  model: string;
  category: 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship' | 'end-of-life';
  subcategory?: string;
  image: string;
  sketchfabId?: string;
  description: string;
  whyChooseRating?: string;
  demandLevel?: 'none' | 'low' | 'high';
  conditionallyNew?: 'red' | 'amber' | 'green';
  lifecycleStage?: 'early-career' | 'mid-career' | 'end-of-life';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  totalDeliveries?: number;
  steepApproachCertified?: boolean;
  engineType?: string;
  rangeVersatility?: 'short' | 'medium' | 'long' | 'versatile';
  cabinFeatures?: string[];
  news?: any[];
  careerScore?: number;
  pilotCount?: number;
  firstFlight: number;
  specifications: any;
  trainingRequirements: any;
  trainingCurriculum?: any[];
  simulatorDetails?: any;
  instructorQualifications?: any[];
  certification?: any;
  successStories?: any[];
  faq?: any[];
  careerInfo?: any;
}

// Helper functions to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
    }
  }
  return result;
}

class TypeRatingService {
  /**
   * Get all manufacturers (returns camelCase)
   */
  async getAllManufacturers(): Promise<ManufacturerCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAllManufacturers`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch manufacturers');
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      throw error;
    }
  }

  /**
   * Get manufacturer by ID (returns camelCase)
   */
  async getManufacturerById(id: string): Promise<ManufacturerCamel> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getManufacturerById?id=${id}`);
      const result = await response.json();
      if (result.success) {
        return toCamelCase(result.data);
      }
      throw new Error(result.error || 'Failed to fetch manufacturer');
    } catch (error) {
      console.error('Error fetching manufacturer:', error);
      throw error;
    }
  }

  /**
   * Get all aircraft type ratings (returns camelCase)
   */
  async getAllAircraftTypeRatings(): Promise<AircraftTypeRatingCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAllAircraftTypeRatings`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch aircraft type ratings');
    } catch (error) {
      console.error('Error fetching aircraft type ratings:', error);
      throw error;
    }
  }

  /**
   * Get aircraft by manufacturer ID (returns camelCase)
   */
  async getAircraftByManufacturer(manufacturerId: string): Promise<AircraftTypeRatingCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAircraftByManufacturer?manufacturerId=${manufacturerId}`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch aircraft');
    } catch (error) {
      console.error('Error fetching aircraft by manufacturer:', error);
      throw error;
    }
  }

  /**
   * Get aircraft by category (returns camelCase)
   */
  async getAircraftByCategory(category: string): Promise<AircraftTypeRatingCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAircraftByCategory?category=${category}`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch aircraft');
    } catch (error) {
      console.error('Error fetching aircraft by category:', error);
      throw error;
    }
  }

  /**
   * Get aircraft by subcategory (returns camelCase)
   */
  async getAircraftBySubcategory(subcategory: string): Promise<AircraftTypeRatingCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAircraftBySubcategory?subcategory=${subcategory}`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch aircraft');
    } catch (error) {
      console.error('Error fetching aircraft by subcategory:', error);
      throw error;
    }
  }

  /**
   * Get aircraft by ID (returns camelCase)
   */
  async getAircraftById(id: string): Promise<AircraftTypeRatingCamel> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAircraftById?id=${id}`);
      const result = await response.json();
      if (result.success) {
        return toCamelCase(result.data);
      }
      throw new Error(result.error || 'Failed to fetch aircraft');
    } catch (error) {
      console.error('Error fetching aircraft:', error);
      throw error;
    }
  }

  /**
   * Search aircraft by query (returns camelCase)
   */
  async searchAircraft(query: string): Promise<AircraftTypeRatingCamel[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/searchAircraft?query=${encodeURIComponent(query)}`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to search aircraft');
    } catch (error) {
      console.error('Error searching aircraft:', error);
      throw error;
    }
  }

  /**
   * Get aircraft with manufacturer details (returns camelCase)
   */
  async getAircraftWithManufacturer(): Promise<any[]> {
    try {
      const response = await fetch(`${FUNCTION_BASE_URL}/getAircraftWithManufacturer`);
      const result = await response.json();
      if (result.success) {
        return result.data.map((item: any) => toCamelCase(item));
      }
      throw new Error(result.error || 'Failed to fetch aircraft with manufacturer');
    } catch (error) {
      console.error('Error fetching aircraft with manufacturer:', error);
      throw error;
    }
  }
}

export const typeRatingService = new TypeRatingService();
