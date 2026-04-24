package backend_paf.Module4.entity;

/**
 * Module 4 – Notification type enum.
 *
 * BOOKING_APPROVED      – booking approved by admin
 * BOOKING_REJECTED      – booking rejected by admin
 * TICKET_STATUS_CHANGED – ticket status updated
 * NEW_TICKET_COMMENT    – new comment on user's ticket
 */
public enum NotificationType {
    BOOKING_APPROVED,
    BOOKING_REJECTED,
    TICKET_STATUS_CHANGED,
    NEW_TICKET_COMMENT
}
