package backend_paf.Module4.dto;

import backend_paf.Module4.entity.Notification;

import java.time.LocalDateTime;

/**
 * Module 4 – DTO returned in all notification API responses.
 * Decouples the JSON contract from the JPA entity.
 */
public class NotificationResponseDto {

    private Long          id;
    private Long          recipientUserId;
    private String        type;
    private String        title;
    private String        message;
    private Long          relatedEntityId;
    private String        relatedEntityType;
    private boolean       read;
    private String        actionUrl;
    private LocalDateTime createdAt;

    // ── Static factory ────────────────────────────────────────────────────

    public static NotificationResponseDto from(Notification n) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.id                = n.getId();
        dto.recipientUserId   = n.getRecipientUserId();
        dto.type              = n.getType().name();
        dto.title             = n.getTitle();
        dto.message           = n.getMessage();
        dto.relatedEntityId   = n.getRelatedEntityId();
        dto.relatedEntityType = n.getRelatedEntityType();
        dto.read              = n.isRead();
        dto.actionUrl         = n.getActionUrl();
        dto.createdAt         = n.getCreatedAt();
        return dto;
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public Long          getId()                { return id; }
    public Long          getRecipientUserId()   { return recipientUserId; }
    public String        getType()              { return type; }
    public String        getTitle()             { return title; }
    public String        getMessage()           { return message; }
    public Long          getRelatedEntityId()   { return relatedEntityId; }
    public String        getRelatedEntityType() { return relatedEntityType; }
    public boolean       isRead()               { return read; }
    public String        getActionUrl()         { return actionUrl; }
    public LocalDateTime getCreatedAt()         { return createdAt; }
}
