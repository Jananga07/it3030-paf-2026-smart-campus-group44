package backend_paf.Module5.controller;

import backend_paf.Module5.dto.UserProfileDto;
import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.entity.Role;
import backend_paf.Module5.repository.AppUserRepository;
import backend_paf.Module5.service.AppUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Module 5 – Admin REST controller.
 *
 * All endpoints here require ROLE_ADMIN.
 * Demonstrates role-based access control for the viva.
 *
 * Endpoints:
 *   GET   /api/admin/users              – list all users
 *   PATCH /api/admin/users/{id}/role    – change a user's role
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AppUserRepository userRepository;
    private final AppUserService appUserService;

    public AdminController(AppUserRepository userRepository, AppUserService appUserService) {
        this.userRepository = userRepository;
        this.appUserService = appUserService;
    }

    /** List every registered user. */
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> listUsers() {
        List<UserProfileDto> users = userRepository.findAll().stream()
                .map(u -> new UserProfileDto(
                        u.getId(), u.getName(), u.getEmail(),
                        u.getPictureUrl(), u.getRole().name()))
                .toList();
        return ResponseEntity.ok(users);
    }

    /**
     * Promote or demote a user.
     * Body: { "role": "ADMIN" } or { "role": "USER" }
     */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserProfileDto> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        Role newRole = Role.valueOf(body.get("role").toUpperCase());
        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(new UserProfileDto(
                user.getId(), user.getName(), user.getEmail(),
                user.getPictureUrl(), user.getRole().name()));
    }

    /** Register a new technician directly. */
    @PostMapping("/technician")
    public ResponseEntity<UserProfileDto> registerTechnician(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {
        
        AppUser user = appUserService.registerTechnician(name, email, password);
        return ResponseEntity.ok(new UserProfileDto(
                user.getId(), user.getName(), user.getEmail(),
                user.getPictureUrl(), user.getRole().name()));
    }

    /** Delete a user. */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
