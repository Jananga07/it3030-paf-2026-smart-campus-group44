package backend_paf.Module1.repository;

import backend_paf.Module1.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Feature: Availability — find resources available within a given date range
    @Query("SELECT r FROM Resource r WHERE r.availableFrom <= :to AND r.availableTo >= :from")
    List<Resource> findAvailableResources(@Param("from") LocalDate from,
                                          @Param("to") LocalDate to);

    // Feature: Availability — find resources available on a specific date
    @Query("SELECT r FROM Resource r WHERE r.availableFrom <= :date AND r.availableTo >= :date")
    List<Resource> findAvailableOnDate(@Param("date") LocalDate date);
}
