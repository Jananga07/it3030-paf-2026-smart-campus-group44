package backend_paf.Module4.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Module 4 – Notification JPA entity.
 * Persisted in the `notifications` table.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_user_id", nullable = false)
    private Long recipientUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private NotificationType type;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(name = "action_url", length = 500)
    private String actionUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Constructors ──────────────────────────────────────────────────────

    public Notification() {}

    public Notification(Long recipientUserId, NotificationType type,
                        String title, String message,
                        Long relatedEntityId, String relatedEntityType,
                        String actionUrl) {
        this.recipientUserId   = recipientUserId;
        this.type              = type;
        this.title             = title;
        this.message           = message;
        this.relatedEntityId   = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
        this.actionUrl         = actionUrl;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────

    public Long             getId()                               { return id; }
    public void             setId(Long id)                        { this.id = id; }
    public Long             getRecipientUserId()                  { return recipientUserId; }
    public void             setRecipientUserId(Long v)            { this.recipientUserId = v; }
    public NotificationType getType()                             { return type; }
    public void             setType(NotificationType type)        { this.type = type; }
    public String           getTitle()                            { return title; }
    public void             setTitle(String title)                { this.title = title; }
    public String           getMessage()                          { return message; }
    public void             setMessage(String message)            { this.message = message; }
    public Long             getRelatedEntityId()                  { return relatedEntityId; }
    public void             setRelatedEntityId(Long v)            { this.relatedEntityId = v; }
    public String           getRelatedEntityType()                { return relatedEntityType; }
    public void             setRelatedEntityType(String v)        { this.relatedEntityType = v; }
    public boolean          isRead()                              { return read; }
    public void             setRead(boolean read)                 { this.read = read; }
    public String           getActionUrl()                        { return actionUrl; }
    public void             setActionUrl(String actionUrl)        { this.actionUrl = actionUrl; }
    public LocalDateTime    getCreatedAt()                        { return createdAt; }
    public void             setCreatedAt(LocalDateTime v)         { this.createdAt = v; }
}
