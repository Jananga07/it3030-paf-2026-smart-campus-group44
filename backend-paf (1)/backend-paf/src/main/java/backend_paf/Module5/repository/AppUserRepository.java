package backend_paf.Module5.repository;

import backend_paf.Module5.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Module 5 – JPA repository for AppUser.
 */
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByProviderId(String providerId);

    Optional<AppUser> findByEmail(String email);
}
