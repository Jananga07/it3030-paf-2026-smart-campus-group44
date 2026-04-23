package backend_paf.Module4;

/**
 * Thrown when a notification cannot be found by ID.
 */
public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(String message) {
        super(message);
    }
}
