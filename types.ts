
export interface Prompt {
  id: string;
  user_id: string;
  content: string;
  source_url?: string;
  source_type: 'x' | 'drive' | 'gmail' | 'manual' | 'scanner';
  grounding_urls?: string[];
  tags: string[];
  image_url?: string;
  analysis?: string;
  created_at: string;
  title: string;
}

export interface GeminiExtraction {
  title: string;
  content: string;
  tags: string[];
  analysis?: string;
  grounding_urls?: string[];
  source_type?: Prompt['source_type'];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PUBLIC_VIEW = 'PUBLIC_VIEW'
}

export interface ConnectedSource {
  id: 'x' | 'google_drive' | 'gmail';
  name: string;
  connected: boolean;
  lastSync?: string;
}

export type UserTier = 'free' | 'premium';
