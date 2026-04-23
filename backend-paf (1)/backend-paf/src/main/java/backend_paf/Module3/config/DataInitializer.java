package backend_paf.Module3.config;

import backend_paf.Module3.model.Role;
import backend_paf.Module3.model.User;
import backend_paf.Module3.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setName("Standard User");
                user.setEmail("user@example.com");
                user.setRole(Role.USER);
                userRepository.save(user);

                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@example.com");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);

                User technician = new User();
                technician.setName("Technician User");
                technician.setEmail("tech@example.com");
                technician.setRole(Role.TECHNICIAN);
                userRepository.save(technician);
                
                System.out.println("Initialized test users: USER (ID:1), ADMIN (ID:2), TECHNICIAN (ID:3)");
            }
        };
    }
}
