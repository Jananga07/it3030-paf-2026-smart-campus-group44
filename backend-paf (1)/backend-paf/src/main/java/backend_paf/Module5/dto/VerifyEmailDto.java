package backend_paf.Module5.dto;

/**
 * Module 5 – Email verification request body.
 */
public class VerifyEmailDto {
    private String email;
    private String code;

    public String getEmail() { return email; }
    public String getCode()  { return code; }
}
