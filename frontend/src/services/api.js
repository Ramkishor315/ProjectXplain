const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}