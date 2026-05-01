import { getAuthHeader } from '../../M5/authService';

const BASE_URL = 'http://localhost:8080/api/bookings';

export const createBooking = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getAllBookings = async (status = null) => {
  const url = status ? `${BASE_URL}?status=${status}` : BASE_URL;
  const res = await fetch(url, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getBookingById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getBookingsByUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const approveBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/approve`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const rejectBooking = async (id, reason) => {
  const res = await fetch(`${BASE_URL}/${id}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const cancelBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/cancel`, {
    method: 'PUT',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(await res.text());
};
