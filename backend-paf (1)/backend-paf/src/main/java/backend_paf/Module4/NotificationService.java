package backend_paf.Module4;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Core service for all notification business logic.
 * Controllers and other services interact with notifications through this class.
 */
@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    /**
     * Create and persist a new notification.
     *
     * @param dto the notification data
     * @return saved notification as response DTO
     */
    @Transactional
    public NotificationResponseDto createNotification(CreateNotificationDto dto) {
        Notification notification = new Notification(
                dto.getRecipientUserId(),
                dto.getType(),
                dto.getTitle(),
                dto.getMessage(),
                dto.getRelatedEntityId(),
                dto.getRelatedEntityType(),
                dto.getActionUrl()
        );
        return NotificationResponseDto.from(repository.save(notification));
    }

    /**
     * Get all notifications for a user, newest first.
     *
     * @param userId the recipient user ID
     * @return list of notification response DTOs
     */
    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotificationsForUser(Long userId) {
        return repository.findByRecipientUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * Get the unread notification count for a user.
     *
     * @param userId the recipient user ID
     * @return count of unread notifications
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return repository.countByRecipientUserIdAndReadFalse(userId);
    }

    /**
     * Mark a single notification as read.
     * Verifies the notification belongs to the requesting user.
     *
     * @param notificationId the notification ID
     * @param userId         the requesting user ID
     * @throws NotificationNotFoundException if not found or not owned by user
     */
    @Transactional
    public NotificationResponseDto markAsRead(Long notificationId, Long userId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(
                        "Notification not found with id: " + notificationId));

        if (!notification.getRecipientUserId().equals(userId)) {
            throw new NotificationAccessDeniedException(
                    "Access denied: notification does not belong to user " + userId);
        }

        notification.setRead(true);
        return NotificationResponseDto.from(repository.save(notification));
    }

    /**
     * Mark all notifications as read for a user.
     *
     * @param userId the user ID
     * @return number of notifications updated
     */
    @Transactional
    public int markAllAsRead(Long userId) {
        return repository.markAllAsReadByUser(userId);
    }

    /**
     * Delete a notification. Verifies ownership before deleting.
     *
     * @param notificationId the notification ID
     * @param userId         the requesting user ID
     * @throws NotificationNotFoundException    if not found
     * @throws NotificationAccessDeniedException if not owned by user
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(
                        "Notification not found with id: " + notificationId));

        if (!notification.getRecipientUserId().equals(userId)) {
            throw new NotificationAccessDeniedException(
                    "Access denied: notification does not belong to user " + userId);
        }

        repository.delete(notification);
    }
}
