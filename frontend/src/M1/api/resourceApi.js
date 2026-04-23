const BASE_URL = "http://localhost:8080/api/resources";

// GET all resources
export const getAllResources = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch resources");
  return res.json();
};

// GET single resource
export const getResourceById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Resource not found");
  return res.json();
};

// GET search/filter
export const searchResources = async ({ type, location, capacity, status }) => {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (location) params.append("location", location);
  if (capacity) params.append("capacity", capacity);
  if (status) params.append("status", status);
  const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

// POST create resource
export const createResource = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create resource");
  return res.json();
};

// PUT update resource
export const updateResource = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update resource");
  return res.json();
};

// DELETE resource
export const deleteResource = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete resource");
};

// PATCH status only
export const updateResourceStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/${id}/status?status=${status}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
