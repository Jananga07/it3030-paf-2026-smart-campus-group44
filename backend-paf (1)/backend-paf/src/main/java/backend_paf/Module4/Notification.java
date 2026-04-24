package backend_paf.Module4;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for a notification record.
 * Each notification belongs to one recipient user and is linked
 * to a related entity (booking, ticket, etc.).
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user ID of the notification recipient. */
    @Column(name = "recipient_user_id", nullable = false)
    private Long recipientUserId;

    /** Category of the notification event. */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private NotificationType type;

    /** Short title shown in the notification bell. */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /** Full descriptive message for the notification. */
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    /** ID of the related entity (booking ID, ticket ID, etc.). */
    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    /** Type of the related entity, e.g. "BOOKING" or "TICKET". */
    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType;

    /** Whether the notification has been read by the user. */
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    /** Optional URL to navigate to when the notification is clicked. */
    @Column(name = "action_url", length = 500)
    private String actionUrl;

    /** Timestamp when the notification was created. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ─── Constructors ───────────────────────────────────────────────────────────

    public Notification() {}

    public Notification(Long recipientUserId, NotificationType type,
                        String title, String message,
                        Long relatedEntityId, String relatedEntityType,
                        String actionUrl) {
        this.recipientUserId = recipientUserId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.relatedEntityId = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
        this.actionUrl = actionUrl;
    }

    // ─── Getters & Setters ──────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecipientUserId() { return recipientUserId; }
    public void setRecipientUserId(Long recipientUserId) { this.recipientUserId = recipientUserId; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(Long relatedEntityId) { this.relatedEntityId = relatedEntityId; }

    public String getRelatedEntityType() { return relatedEntityType; }
    public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
