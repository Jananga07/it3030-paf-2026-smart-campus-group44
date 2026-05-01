package backend_paf.Module5.config;

import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.entity.Role;
import backend_paf.Module5.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the admin user on startup if it doesn't already exist.
 * Credentials: admin@gmail.com / admin
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final AppUserRepository     userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataSeeder(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@gmail.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            AppUser admin = new AppUser("Admin", adminEmail, encoder.encode("admin"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: " + adminEmail);
        }
    }
}
