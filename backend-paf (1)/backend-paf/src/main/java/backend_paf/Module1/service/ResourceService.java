package backend_paf.Module1.service;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
import backend_paf.Module1.enums.ResourceStatus;

import java.time.LocalDate;
import java.util.List;

public interface ResourceService {

    // Feature: CRUD
    ResourceResponseDTO createResource(ResourceRequestDTO dto);
    List<ResourceResponseDTO> getAllResources();
    ResourceResponseDTO getResourceById(Long id);
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto);
    void deleteResource(Long id);

    // Feature: Search
    List<ResourceResponseDTO> searchResources(String type, String location, Integer capacity, ResourceStatus status);

    // Feature: Status
    ResourceResponseDTO updateStatus(Long id, ResourceStatus status);
    List<ResourceResponseDTO> getResourcesByStatus(ResourceStatus status);

    // Feature: Availability
    List<ResourceResponseDTO> getAvailableResources(LocalDate from, LocalDate to);
}