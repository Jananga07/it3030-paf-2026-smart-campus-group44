const BASE_URL = 'http://localhost:8080/api';

export const ticketApi = {
    createTicket: async (formData) => {
        const response = await fetch(`${BASE_URL}/tickets`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to create ticket');
        return response.json();
    },

    getAllTickets: async (userId) => {
        const response = await fetch(`${BASE_URL}/tickets?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch tickets');
        return response.json();
    },

    getTicketById: async (id) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch ticket details');
        return response.json();
    },

    updateStatus: async (id, status, note, userId) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/status?status=${status}&note=${encodeURIComponent(note || '')}&userId=${userId}`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },

    addResolutionNotes: async (id, notes, userId) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/resolution?notes=${encodeURIComponent(notes)}&userId=${userId}`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('Failed to add resolution notes');
        return response.json();
    }
};

export const categoryApi = {
    getAllCategories: async () => {
        const response = await fetch(`${BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    },

    addCategory: async (name) => {
        const response = await fetch(`${BASE_URL}/categories?name=${encodeURIComponent(name)}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to add category');
        return response.json();
    },

    deleteCategory: async (id) => {
        const response = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        return true;
    }
};

export const commentApi = {
    addComment: async (ticketId, userId, text) => {
        const params = new URLSearchParams({ ticketId, userId, text });
        const response = await fetch(`${BASE_URL}/comments?${params.toString()}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
    },

    getComments: async (ticketId) => {
        const response = await fetch(`${BASE_URL}/comments/ticket/${ticketId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    deleteComment: async (commentId, userId) => {
        const response = await fetch(`${BASE_URL}/comments/${commentId}?userId=${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete comment');
        return true;
    },

    updateComment: async (commentId, userId, text) => {
        const params = new URLSearchParams({ userId, text });
        const response = await fetch(`${BASE_URL}/comments/${commentId}?${params.toString()}`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to update comment');
        return response.json();
    }
};
