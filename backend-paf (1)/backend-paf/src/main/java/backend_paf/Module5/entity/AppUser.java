package backend_paf.Module5.entity;

import jakarta.persistence.*;

/**
 * Module 5 – AppUser entity.
 * Supports both email/password auth and Google OAuth login.
 */
@Entity
@Table(name = "app_users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email"),
           @UniqueConstraint(columnNames = "provider_id")
       })
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Google sub – null for email/password-only users */
    @Column(name = "provider_id")
    private String providerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hashed password – null for OAuth-only users */
    private String password;

    @Column(length = 2048)
    private String pictureUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    // ── Constructors ──────────────────────────────────────────────────────

    public AppUser() {}

    /** OAuth constructor */
    public AppUser(String providerId, String name, String email, String pictureUrl) {
        this.providerId = providerId;
        this.name       = name;
        this.email      = email;
        this.pictureUrl = pictureUrl;
        this.role       = Role.USER;
    }

    /** Email/password constructor */
    public AppUser(String name, String email, String hashedPassword) {
        this.name     = name;
        this.email    = email;
        this.password = hashedPassword;
        this.role     = Role.USER;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────

    public Long   getId()                          { return id; }
    public String getProviderId()                  { return providerId; }
    public void   setProviderId(String providerId) { this.providerId = providerId; }
    public String getName()                        { return name; }
    public void   setName(String name)             { this.name = name; }
    public String getEmail()                       { return email; }
    public String getPassword()                    { return password; }
    public void   setPassword(String password)     { this.password = password; }
    public String getPictureUrl()                  { return pictureUrl; }
    public void   setPictureUrl(String p)          { this.pictureUrl = p; }
    public Role   getRole()                        { return role; }
    public void   setRole(Role role)               { this.role = role; }
}
