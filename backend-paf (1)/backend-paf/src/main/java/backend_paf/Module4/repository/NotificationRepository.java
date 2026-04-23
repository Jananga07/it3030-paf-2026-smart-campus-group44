package backend_paf.Module4.repository;

import backend_paf.Module4.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Module 4 – JPA repository for Notification.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /** All notifications for a user, newest first. */
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);

    /** Count of unread notifications for a user. */
    long countByRecipientUserIdAndReadFalse(Long recipientUserId);

    /** Bulk mark all unread as read for a user. Returns rows updated. */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true " +
           "WHERE n.recipientUserId = :userId AND n.read = false")
    int markAllAsReadByUser(@Param("userId") Long userId);
}
