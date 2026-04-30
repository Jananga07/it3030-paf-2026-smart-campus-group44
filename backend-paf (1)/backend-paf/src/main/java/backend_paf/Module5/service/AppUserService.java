package backend_paf.Module5.service;

import backend_paf.Module5.dto.LoginRequestDto;
import backend_paf.Module5.dto.RegisterRequestDto;
import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.entity.Role;
import backend_paf.Module5.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Module 5 – AppUser service.
 */
@Service
public class AppUserService {

    private final AppUserRepository     userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AppUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── OAuth ─────────────────────────────────────────────────────────────

    @Transactional
    public AppUser findOrCreate(String providerId, String name,
                                String email, String pictureUrl) {

        // 1. Try find by providerId first (returning user via Google)
        if (providerId != null) {
            var byProvider = userRepository.findByProviderId(providerId);
            if (byProvider.isPresent()) {
                AppUser existing = byProvider.get();
                existing.setName(name != null ? name : existing.getName());
                existing.setPictureUrl(pictureUrl);
                return userRepository.save(existing);
            }
        }

        // 2. Try find by email (user registered via email/password before)
        if (email != null) {
            var byEmail = userRepository.findByEmail(email);
            if (byEmail.isPresent()) {
                AppUser existing = byEmail.get();
                // Link OAuth account only if providerId not already set
                if (existing.getProviderId() == null && providerId != null) {
                    existing.setProviderId(providerId);
                }
                existing.setPictureUrl(pictureUrl);
                if (name != null) existing.setName(name);
                return userRepository.save(existing);
            }
        }

        // 3. New user — create
        String safeName  = name  != null ? name  : (email != null ? email.split("@")[0] : "User");
        String safeEmail = email != null ? email : providerId + "@oauth.local";

        AppUser newUser = new AppUser(providerId, safeName, safeEmail, pictureUrl);
        return userRepository.save(newUser);
    }

    // ── Email/Password Register ───────────────────────────────────────────

    @Transactional
    public AppUser register(RegisterRequestDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }
        String hashed = encoder.encode(dto.getPassword());
        AppUser user  = new AppUser(dto.getName(), dto.getEmail(), hashed);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser registerTechnician(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }
        String hashed = encoder.encode(password);
        AppUser user = new AppUser(name, email, hashed);
        user.setRole(Role.TECHNICIAN);
        return userRepository.save(user);
    }

    // ── Email/Password Login ──────────────────────────────────────────────

    public AppUser login(LoginRequestDto dto) {
        AppUser user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (user.getPassword() == null) {
            throw new RuntimeException("This account uses Google Sign-In. Please use Continue with Google.");
        }

        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        return user;
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    public AppUser findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }
}
