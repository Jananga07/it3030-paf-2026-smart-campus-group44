/**
 * Notification Admin API Service – Module 4 (Member 4)
 */

function getAuthHeader() {
  const token = localStorage.getItem("sc_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BASE_URL = "http://localhost:8080/api/notifications";

/** ADMIN: Get all notifications across all users. */
export async function getAllNotifications() {
  const res = await fetch(`${BASE_URL}/admin/all`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to load all notifications");
  return res.json();
}

/** ADMIN: Send a notification to a specific user. */
export async function sendNotification(data) {
  const res = await fetch(`${BASE_URL}/admin/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send notification");
  return res.json();
}

/** ADMIN: Delete any notification by id. */
export async function adminDeleteNotification(id) {
  const res = await fetch(`${BASE_URL}/admin/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error("Failed to delete notification");
}
