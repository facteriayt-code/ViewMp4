
/**
 * API Service for GeminiStream
 * Used to communicate with Vercel Serverless Functions
 */

const BASE_URL = '/api'; // Standard Vercel API path

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },

  async upload(endpoint: string, formData: FormData) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData, // Browser automatically sets Content-Type to multipart/form-data
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};
