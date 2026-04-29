package backend_paf.Module5.config;

import backend_paf.Module5.security.JwtAuthFilter;
import backend_paf.Module5.security.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Module 5 – Spring Security configuration.
 *
 * Session policy: IF_REQUIRED (not STATELESS) so that the OAuth2 state
 * parameter can be stored between the Google redirect and the callback.
 * API endpoints remain effectively stateless because they use JWT Bearer tokens.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter             jwtAuthFilter;
    private final OAuth2LoginSuccessHandler successHandler;
    private final String                    allowedOrigin;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          OAuth2LoginSuccessHandler successHandler,
                          @Value("${app.cors.allowed-origin}") String allowedOrigin) {
        this.jwtAuthFilter  = jwtAuthFilter;
        this.successHandler = successHandler;
        this.allowedOrigin  = allowedOrigin;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ── CORS ──────────────────────────────────────────────────────
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ── CSRF: disabled – we use JWT, not cookies ───────────────────
            .csrf(csrf -> csrf.disable())

            // ── Session: IF_REQUIRED so OAuth2 state cookie works ─────────
            // OAuth2 login needs a session to store the state parameter.
            // After login the success handler issues a JWT and the session
            // is no longer used for API calls.
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

            // ── Authorization rules ───────────────────────────────────────
            .authorizeHttpRequests(auth -> auth
                // OAuth2 login flow – must be public
                .requestMatchers("/oauth2/**", "/login/**").permitAll()

                // Module 5 auth endpoints – public
                .requestMatchers("/api/auth/**").permitAll()

                // Module 1 – resources are publicly readable
                .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()

                // Module 3 – categories publicly readable
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                // Notification endpoints – authenticated users only
                .requestMatchers("/api/notifications/**").authenticated()

                // Admin-only management endpoints
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All other API calls require authentication
                .requestMatchers("/api/**").authenticated()

                // Anything else is open
                .anyRequest().permitAll()
            )

            // ── OAuth2 login ──────────────────────────────────────────────
            .oauth2Login(oauth2 -> oauth2
                .successHandler(successHandler)
            )

            // ── JWT filter runs before Spring's username/password filter ──
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
