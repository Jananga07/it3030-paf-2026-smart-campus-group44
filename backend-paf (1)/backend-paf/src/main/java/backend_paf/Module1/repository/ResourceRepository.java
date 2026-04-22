package backend_paf.Module1.repository;

import backend_paf.Module1.enums.ResourceStatus;
import backend_paf.Module1.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Feature: Search — by type
    List<Resource> findByTypeIgnoreCase(String type);

    // Feature: Search — by location
    List<Resource> findByLocationContainingIgnoreCase(String location);

    // Feature: Search — by minimum capacity
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    // Feature: Search — combined filter (type + location + capacity + status)
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR LOWER(r.type) = LOWER(:type)) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity) AND " +
           "(:status IS NULL OR r.status = :status)")
    List<Resource> searchResources(@Param("type") String type,
                                   @Param("location") String location,
                                   @Param("capacity") Integer capacity,
                                   @Param("status") ResourceStatus status);

    // Feature: Status — by status
    List<Resource> findByStatus(ResourceStatus status);

    // Feature: Availability — available within a date range
    @Query("SELECT r FROM Resource r WHERE r.availableFrom <= :to AND r.availableTo >= :from")
    List<Resource> findAvailableResources(@Param("from") LocalDate from,
                                          @Param("to") LocalDate to);
}
