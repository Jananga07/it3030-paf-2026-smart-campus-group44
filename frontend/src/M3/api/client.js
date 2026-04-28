import { getAuthHeader } from '../../M5/authService';

const BASE_URL = 'http://localhost:8080/api';

const authJson = () => ({ 'Content-Type': 'application/json', ...getAuthHeader() });
const authOnly = () => ({ ...getAuthHeader() });

export const ticketApi = {
  createTicket: async (formData) => {
    const res = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { ...authOnly() },   // FormData — no Content-Type override
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  },

  getAllTickets: async (userId) => {
    const res = await fetch(`${BASE_URL}/tickets?userId=${userId}`, {
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },

  getTicketById: async (id) => {
    const res = await fetch(`${BASE_URL}/tickets/${id}`, {
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to fetch ticket details');
    return res.json();
  },

  updateStatus: async (id, status, note, userId) => {
    const res = await fetch(
      `${BASE_URL}/tickets/${id}/status?status=${status}&note=${encodeURIComponent(note || '')}&userId=${userId}`,
      { method: 'PATCH', headers: { ...authOnly() } }
    );
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  addResolutionNotes: async (id, notes, userId) => {
    const res = await fetch(
      `${BASE_URL}/tickets/${id}/resolution?notes=${encodeURIComponent(notes)}&userId=${userId}`,
      { method: 'PATCH', headers: { ...authOnly() } }
    );
    if (!res.ok) throw new Error('Failed to add resolution notes');
    return res.json();
  },
};

export const categoryApi = {
  getAllCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`, { headers: { ...authOnly() } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  addCategory: async (name) => {
    const res = await fetch(`${BASE_URL}/categories?name=${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to add category');
    return res.json();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
  },
};

export const commentApi = {
  addComment: async (ticketId, userId, text) => {
    const params = new URLSearchParams({ ticketId, userId, text });
    const res = await fetch(`${BASE_URL}/comments?${params.toString()}`, {
      method: 'POST',
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
  },

  getComments: async (ticketId) => {
    const res = await fetch(`${BASE_URL}/comments/ticket/${ticketId}`, {
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  deleteComment: async (commentId, userId) => {
    const res = await fetch(`${BASE_URL}/comments/${commentId}?userId=${userId}`, {
      method: 'DELETE',
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return true;
  },

  updateComment: async (commentId, userId, text) => {
    const params = new URLSearchParams({ userId, text });
    const res = await fetch(`${BASE_URL}/comments/${commentId}?${params.toString()}`, {
      method: 'PUT',
      headers: { ...authOnly() },
    });
    if (!res.ok) throw new Error('Failed to update comment');
    return res.json();
  },
};
