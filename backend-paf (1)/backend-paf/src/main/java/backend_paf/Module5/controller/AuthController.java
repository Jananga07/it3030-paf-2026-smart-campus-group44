package backend_paf.Module5.controller;

import backend_paf.Module5.dto.*;
import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.security.JwtUtils;
import backend_paf.Module5.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Module 5 – Auth REST controller.
 *
 * POST /api/auth/register  – register with email + password
 * POST /api/auth/login     – login with email + password → JWT
 * GET  /api/auth/me        – get current user profile
 * POST /api/auth/logout    – logout (client discards JWT)
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AppUserService appUserService;
    private final JwtUtils       jwtUtils;

    public AuthController(AppUserService appUserService, JwtUtils jwtUtils) {
        this.appUserService = appUserService;
        this.jwtUtils       = jwtUtils;
    }

    /** Register with email + password. Returns JWT immediately.
     *  Optional query param: ?role=admin  — registers as ADMIN (for admin setup only)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequestDto dto,
            @RequestParam(required = false) String role) {
        try {
            AppUser user  = appUserService.register(dto, "admin".equalsIgnoreCase(role));
            String  token = jwtUtils.generateToken(
                    user.getId(), user.getEmail(), user.getRole().name());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "token", token,
                    "user",  new UserProfileDto(user.getId(), user.getName(),
                                                user.getEmail(), user.getPictureUrl(),
                                                user.getRole().name())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Login with email + password. Returns JWT on success. */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        try {
            AppUser user  = appUserService.login(dto);
            String  token = jwtUtils.generateToken(
                    user.getId(), user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user",  new UserProfileDto(user.getId(), user.getName(),
                                                user.getEmail(), user.getPictureUrl(),
                                                user.getRole().name())));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** Get current authenticated user profile. */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDto> getCurrentUser(Authentication authentication) {
        Long    userId = (Long) authentication.getPrincipal();
        AppUser user   = appUserService.findById(userId);
        return ResponseEntity.ok(new UserProfileDto(
                user.getId(), user.getName(), user.getEmail(),
                user.getPictureUrl(), user.getRole().name()));
    }

    /** Logout – client discards JWT. */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
