package backend_paf.Module5.security;

import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.service.AppUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Module 5 – OAuth2 login success handler.
 * Handles Google callback, upserts user, issues JWT, redirects to React frontend.
 */
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AppUserService appUserService;
    private final JwtUtils       jwtUtils;
    private final String         frontendOrigin;

    public OAuth2LoginSuccessHandler(
            AppUserService appUserService,
            JwtUtils jwtUtils,
            @Value("${app.cors.allowed-origin}") String frontendOrigin) {
        this.appUserService = appUserService;
        this.jwtUtils       = jwtUtils;
        this.frontendOrigin = frontendOrigin;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        try {
            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attrs = oauthUser.getAttributes();

            // Google OIDC: "sub" is the unique user ID
            // Fallback to "id" for other providers
            String providerId = getString(attrs, "sub");
            if (providerId == null) providerId = getString(attrs, "id");

            String name       = getString(attrs, "name");
            String email      = getString(attrs, "email");
            String pictureUrl = getString(attrs, "picture");

            System.out.println("[OAuth2] Login: email=" + email + " providerId=" + providerId);

            // Upsert user in local DB
            AppUser user = appUserService.findOrCreate(providerId, name, email, pictureUrl);

            // Issue JWT
            String token = jwtUtils.generateToken(
                    user.getId(), user.getEmail(), user.getRole().name());

            // Redirect to React frontend with token
            String redirectUrl = frontendOrigin + "/auth/callback?token=" + token;
            System.out.println("[OAuth2] Redirecting to: " + redirectUrl);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            System.err.println("[OAuth2] Error in success handler: " + e.getMessage());
            e.printStackTrace();
            // Redirect to frontend login page with error flag instead of showing 500
            getRedirectStrategy().sendRedirect(
                    request, response, frontendOrigin + "/login?error=oauth_failed");
        }
    }

    private String getString(Map<String, Object> attrs, String key) {
        Object val = attrs.get(key);
        return val != null ? val.toString() : null;
    }
}
