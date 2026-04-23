package backend_paf.Module4.service;

import backend_paf.Module4.dto.CreateNotificationDto;
import backend_paf.Module4.dto.NotificationResponseDto;
import backend_paf.Module4.entity.Notification;
import backend_paf.Module4.exception.NotificationAccessDeniedException;
import backend_paf.Module4.exception.NotificationNotFoundException;
import backend_paf.Module4.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Module 4 – Core service for all notification business logic.
 */
@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    /** Create and persist a new notification. */
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

    /** Get all notifications for a user, newest first. */
    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotificationsForUser(Long userId) {
        return repository.findByRecipientUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
    }

    /** Get the unread notification count for a user. */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return repository.countByRecipientUserIdAndReadFalse(userId);
    }

    /** Mark a single notification as read. Verifies ownership. */
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

    /** Mark all notifications as read for a user. Returns count updated. */
    @Transactional
    public int markAllAsRead(Long userId) {
        return repository.markAllAsReadByUser(userId);
    }

    /** Delete a notification. Verifies ownership before deleting. */
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
