package backend_paf.Module4.exception;

/**
 * Module 4 – Thrown when a user tries to access another user's notification.
 */
public class NotificationAccessDeniedException extends RuntimeException {
    public NotificationAccessDeniedException(String message) {
        super(message);
    }
}
