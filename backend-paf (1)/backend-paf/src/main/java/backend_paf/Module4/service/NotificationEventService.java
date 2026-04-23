package backend_paf.Module4.service;

import backend_paf.Module4.dto.CreateNotificationDto;
import backend_paf.Module4.entity.NotificationType;
import org.springframework.stereotype.Service;

/**
 * Module 4 – Integration service for triggering notifications from other modules.
 *
 * HOW OTHER MODULES USE THIS:
 *   @Autowired NotificationEventService notificationEventService;
 *
 *   notificationEventService.notifyBookingApproved(userId, bookingId);
 *   notificationEventService.notifyBookingRejected(userId, bookingId);
 *   notificationEventService.notifyTicketStatusChanged(userId, ticketId, "RESOLVED");
 *   notificationEventService.notifyNewTicketComment(ticketOwnerId, ticketId, "Dr. Smith");
 */
@Service
public class NotificationEventService {

    private final NotificationService notificationService;

    public NotificationEventService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /** Notify user that their booking was approved. */
    public void notifyBookingApproved(Long userId, Long bookingId) {
        notificationService.createNotification(new CreateNotificationDto(
                userId, NotificationType.BOOKING_APPROVED,
                "Booking Approved",
                "Your booking request (ID: " + bookingId + ") has been approved.",
                bookingId, "BOOKING", "/bookings/" + bookingId
        ));
    }

    /** Notify user that their booking was rejected. */
    public void notifyBookingRejected(Long userId, Long bookingId) {
        notificationService.createNotification(new CreateNotificationDto(
                userId, NotificationType.BOOKING_REJECTED,
                "Booking Rejected",
                "Your booking request (ID: " + bookingId + ") has been rejected.",
                bookingId, "BOOKING", "/bookings/" + bookingId
        ));
    }

    /** Notify user that their ticket status changed. */
    public void notifyTicketStatusChanged(Long userId, Long ticketId, String newStatus) {
        notificationService.createNotification(new CreateNotificationDto(
                userId, NotificationType.TICKET_STATUS_CHANGED,
                "Ticket Status Updated",
                "Your ticket (ID: " + ticketId + ") status changed to: " + newStatus + ".",
                ticketId, "TICKET", "/tickets/" + ticketId
        ));
    }

    /** Notify ticket owner that a new comment was added. */
    public void notifyNewTicketComment(Long ticketOwnerId, Long ticketId, String commenterName) {
        notificationService.createNotification(new CreateNotificationDto(
                ticketOwnerId, NotificationType.NEW_TICKET_COMMENT,
                "New Comment on Your Ticket",
                commenterName + " added a comment on your ticket (ID: " + ticketId + ").",
                ticketId, "TICKET", "/tickets/" + ticketId
        ));
    }
}
