package backend_paf.Module4;

import org.springframework.stereotype.Service;

/**
 * Public event service that other modules call to trigger notifications.
 *
 * INTEGRATION GUIDE FOR OTHER MEMBERS:
 * ─────────────────────────────────────
 * Inject this service into your own service class using constructor injection:
 *
 *   private final NotificationEventService notificationEventService;
 *
 * Then call the appropriate method at the right point in your business logic:
 *
 *   // In BookingService, after approving a booking:
 *   notificationEventService.notifyBookingApproved(userId, bookingId);
 *
 *   // In BookingService, after rejecting a booking:
 *   notificationEventService.notifyBookingRejected(userId, bookingId);
 *
 *   // In TicketService, after changing ticket status:
 *   notificationEventService.notifyTicketStatusChanged(userId, ticketId, newStatus);
 *
 *   // In CommentService, after adding a comment to a ticket:
 *   notificationEventService.notifyNewTicketComment(ticketOwnerId, ticketId, commenterName);
 *
 * This isolates all notification logic here — other modules don't need to know
 * how notifications work internally.
 */
@Service
public class NotificationEventService {

    private final NotificationService notificationService;

    public NotificationEventService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Notify a user that their booking has been approved.
     *
     * @param userId    the user who owns the booking
     * @param bookingId the approved booking's ID
     */
    public void notifyBookingApproved(Long userId, Long bookingId) {
        CreateNotificationDto dto = new CreateNotificationDto(
                userId,
                NotificationType.BOOKING_APPROVED,
                "Booking Approved",
                "Your booking request (ID: " + bookingId + ") has been approved.",
                bookingId,
                "BOOKING",
                "/bookings/" + bookingId
        );
        notificationService.createNotification(dto);
    }

    /**
     * Notify a user that their booking has been rejected.
     *
     * @param userId    the user who owns the booking
     * @param bookingId the rejected booking's ID
     */
    public void notifyBookingRejected(Long userId, Long bookingId) {
        CreateNotificationDto dto = new CreateNotificationDto(
                userId,
                NotificationType.BOOKING_REJECTED,
                "Booking Rejected",
                "Your booking request (ID: " + bookingId + ") has been rejected. Please contact admin for details.",
                bookingId,
                "BOOKING",
                "/bookings/" + bookingId
        );
        notificationService.createNotification(dto);
    }

    /**
     * Notify a user that the status of their ticket has changed.
     *
     * @param userId    the ticket owner's user ID
     * @param ticketId  the ticket's ID
     * @param newStatus the new status string (e.g. "IN_PROGRESS", "RESOLVED")
     */
    public void notifyTicketStatusChanged(Long userId, Long ticketId, String newStatus) {
        CreateNotificationDto dto = new CreateNotificationDto(
                userId,
                NotificationType.TICKET_STATUS_CHANGED,
                "Ticket Status Updated",
                "Your ticket (ID: " + ticketId + ") status has been updated to: " + newStatus + ".",
                ticketId,
                "TICKET",
                "/tickets/" + ticketId
        );
        notificationService.createNotification(dto);
    }

    /**
     * Notify the ticket owner that a new comment was added to their ticket.
     *
     * @param ticketOwnerId the user ID of the ticket owner
     * @param ticketId      the ticket's ID
     * @param commenterName the display name of the person who commented
     */
    public void notifyNewTicketComment(Long ticketOwnerId, Long ticketId, String commenterName) {
        CreateNotificationDto dto = new CreateNotificationDto(
                ticketOwnerId,
                NotificationType.NEW_TICKET_COMMENT,
                "New Comment on Your Ticket",
                commenterName + " added a comment on your ticket (ID: " + ticketId + ").",
                ticketId,
                "TICKET",
                "/tickets/" + ticketId
        );
        notificationService.createNotification(dto);
    }
}
