import { getAuthHeader } from '../../M5/authService';

const BASE_URL = 'http://localhost:8080/api/resources';

// Public — no auth needed
export const getAllResources = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
};

export const getResourceById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Resource not found');
  return res.json();
};

export const searchResources = async ({ type, location, capacity, status }) => {
  const params = new URLSearchParams();
  if (type)     params.append('type', type);
  if (location) params.append('location', location);
  if (capacity) params.append('capacity', capacity);
  if (status)   params.append('status', status);
  const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

// Auth required — admin write operations
export const createResource = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create resource');
  return res.json();
};

export const updateResource = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update resource');
  return res.json();
};

export const deleteResource = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete resource');
};

export const updateResourceStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};
