export interface Report {

  id: string;

  image: string;

  caption: string;

  conditions: string[];

  confidence: number;

  latitude: number;

  longitude: number;

  createdAt: number;

  expiresAt: number;

}