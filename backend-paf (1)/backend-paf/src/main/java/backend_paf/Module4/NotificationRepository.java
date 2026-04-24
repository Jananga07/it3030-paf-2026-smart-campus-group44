package backend_paf.Module4;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Notification persistence operations.
 * All queries are scoped to a specific recipient user to prevent data leaks.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Fetch all notifications for a user, newest first.
     */
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);

    /**
     * Count unread notifications for a user.
     */
    long countByRecipientUserIdAndReadFalse(Long recipientUserId);

    /**
     * Mark all notifications as read for a specific user.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.recipientUserId = :userId AND n.read = false")
    int markAllAsReadByUser(@Param("userId") Long userId);

    /**
     * Check ownership — used to verify a notification belongs to the requesting user.
     */
    boolean existsByIdAndRecipientUserId(Long id, Long recipientUserId);
}
