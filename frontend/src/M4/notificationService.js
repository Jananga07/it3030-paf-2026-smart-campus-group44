/**
 * Notification API Service – Module 4 (Member 4)
 * All API calls are scoped to the authenticated userId.
 *
 * Module 5 integration: getAuthHeader() attaches the JWT Bearer token
 * so the backend can authenticate the request.
 */

import { getAuthHeader } from "../M5/authService";

const BASE_URL = "http://localhost:8080/api/notifications";

/**
 * Fetch all notifications for a user (newest first).
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export async function getNotifications(userId) {
  const res = await fetch(`${BASE_URL}?userId=${userId}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

/**
 * Get the unread notification count for a user.
 * @param {number} userId
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  const res = await fetch(`${BASE_URL}/unread-count?userId=${userId}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to load unread count");
  const data = await res.json();
  return data.count;
}

/**
 * Mark a single notification as read.
 * @param {number} notificationId
 * @param {number} userId
 * @returns {Promise<Object>} updated notification
 */
export async function markAsRead(notificationId, userId) {
  const res = await fetch(`${BASE_URL}/${notificationId}/read?userId=${userId}`, {
    method: "PATCH",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

/**
 * Mark all notifications as read for a user.
 * @param {number} userId
 * @returns {Promise<Object>} { updated: N }
 */
export async function markAllAsRead(userId) {
  const res = await fetch(`${BASE_URL}/read-all?userId=${userId}`, {
    method: "PATCH",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to mark all notifications as read");
  return res.json();
}

/**
 * Delete a notification.
 * @param {number} notificationId
 * @param {number} userId
 * @returns {Promise<void>}
 */
export async function deleteNotification(notificationId, userId) {
  const res = await fetch(`${BASE_URL}/${notificationId}?userId=${userId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to delete notification");
}
