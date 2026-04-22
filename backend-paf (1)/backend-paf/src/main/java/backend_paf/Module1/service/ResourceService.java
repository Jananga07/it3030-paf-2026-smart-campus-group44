package backend_paf.Module1.service;

import backend_paf.Module1.model.Resource;

import java.time.LocalDate;
import java.util.List;

public interface ResourceService {

    // CRUD (from CRUD branch)
    Resource createResource(Resource resource);
    List<Resource> getAllResources();
    Resource getResourceById(Long id);
    Resource updateResource(Long id, Resource resource);
    void deleteResource(Long id);

    // Feature: Availability
    List<Resource> getAvailableResources(LocalDate from, LocalDate to);
    List<Resource> getAvailableOnDate(LocalDate date);
}
