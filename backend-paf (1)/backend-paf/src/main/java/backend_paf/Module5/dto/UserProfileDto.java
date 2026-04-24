package backend_paf.Module5.dto;

/**
 * Module 5 – DTO returned by /api/auth/me.
 * Carries only the fields the frontend needs; never exposes internal DB ids directly.
 */
public class UserProfileDto {

    private Long   id;
    private String name;
    private String email;
    private String pictureUrl;
    private String role;

    public UserProfileDto() {}

    public UserProfileDto(Long id, String name, String email,
                          String pictureUrl, String role) {
        this.id         = id;
        this.name       = name;
        this.email      = email;
        this.pictureUrl = pictureUrl;
        this.role       = role;
    }

    public Long   getId()         { return id; }
    public String getName()       { return name; }
    public String getEmail()      { return email; }
    public String getPictureUrl() { return pictureUrl; }
    public String getRole()       { return role; }
}
