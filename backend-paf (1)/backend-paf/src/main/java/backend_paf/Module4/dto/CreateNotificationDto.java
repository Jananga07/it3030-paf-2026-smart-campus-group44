package backend_paf.Module4.dto;

import backend_paf.Module4.entity.NotificationType;

/**
 * Module 4 – DTO used internally when creating a notification.
 * Other modules pass this to NotificationService via NotificationEventService.
 */
public class CreateNotificationDto {

    private Long             recipientUserId;
    private NotificationType type;
    private String           title;
    private String           message;
    private Long             relatedEntityId;
    private String           relatedEntityType;
    private String           actionUrl;

    // ── Constructors ──────────────────────────────────────────────────────

    public CreateNotificationDto() {}

    public CreateNotificationDto(Long recipientUserId, NotificationType type,
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

    public Long             getRecipientUserId()           { return recipientUserId; }
    public void             setRecipientUserId(Long v)     { this.recipientUserId = v; }
    public NotificationType getType()                      { return type; }
    public void             setType(NotificationType type) { this.type = type; }
    public String           getTitle()                     { return title; }
    public void             setTitle(String title)         { this.title = title; }
    public String           getMessage()                   { return message; }
    public void             setMessage(String message)     { this.message = message; }
    public Long             getRelatedEntityId()           { return relatedEntityId; }
    public void             setRelatedEntityId(Long v)     { this.relatedEntityId = v; }
    public String           getRelatedEntityType()         { return relatedEntityType; }
    public void             setRelatedEntityType(String v) { this.relatedEntityType = v; }
    public String           getActionUrl()                 { return actionUrl; }
    public void             setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
}
