package backend_paf.Module4;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for the notifications feature (Module 4).
 *
 * Base URL: /api/notifications
 *
 * AUTH NOTE: The userId parameter is currently passed as a query param
 * for compatibility with the incomplete auth setup. When other team members
 * add Spring Security, replace:
 *
 *   @RequestParam Long userId
 *
 * with the resolved principal, e.g.:
 *
 *   @AuthenticationPrincipal UserDetails userDetails
 *   Long userId = Long.parseLong(userDetails.getUsername());
 *
 * This is a one-line change per endpoint.
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ─── GET /api/notifications ──────────────────────────────────────────────────
    /**
     * Retrieve all notifications for the specified user, newest first.
     *
     * @param userId the authenticated user's ID
     * @return 200 OK with list of notifications
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
            @RequestParam Long userId) {
        List<NotificationResponseDto> notifications =
                notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    // ─── GET /api/notifications/unread-count ─────────────────────────────────────
    /**
     * Return the number of unread notifications for the specified user.
     *
     * @param userId the authenticated user's ID
     * @return 200 OK with JSON { "count": N }
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestParam Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // ─── PATCH /api/notifications/{id}/read ──────────────────────────────────────
    /**
     * Mark a single notification as read.
     * Returns 404 if the notification does not exist.
     * Returns 403 if the notification belongs to a different user.
     *
     * @param id     the notification ID
     * @param userId the authenticated user's ID
     * @return 200 OK with the updated notification
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        NotificationResponseDto dto = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(dto);
    }

    // ─── PATCH /api/notifications/read-all ───────────────────────────────────────
    /**
     * Mark all notifications as read for the specified user.
     *
     * @param userId the authenticated user's ID
     * @return 200 OK with JSON { "updated": N }
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllAsRead(
            @RequestParam Long userId) {
        int updated = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("updated", updated));
    }

    // ─── DELETE /api/notifications/{id} ──────────────────────────────────────────
    /**
     * Delete a notification by ID.
     * Returns 404 if the notification does not exist.
     * Returns 403 if the notification belongs to a different user.
     *
     * @param id     the notification ID
     * @param userId the authenticated user's ID
     * @return 204 No Content on success
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @RequestParam Long userId) {
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

    // ─── Exception handlers (scoped to this controller) ──────────────────────────

    @ExceptionHandler(NotificationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotificationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(NotificationAccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(NotificationAccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred: " + ex.getMessage()));
    }
}
