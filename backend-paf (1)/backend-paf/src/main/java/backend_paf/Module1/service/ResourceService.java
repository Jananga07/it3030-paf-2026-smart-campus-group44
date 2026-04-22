package backend_paf.Module1.service;

Module1-feature/Availability
import backend_paf.Module1.model.Resource;

import java.time.LocalDate;
=======
import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
Module1-feature/Validation

=======
import backend_paf.Module1.enums.ResourceStatus;

import java.time.LocalDate;
Module1
 Module1
import java.util.List;

public interface ResourceService {

 Module1-feature/Availability
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
=======
Module1-feature/Validation
    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    List<ResourceResponseDTO> getAllResources();

    ResourceResponseDTO getResourceById(Long id);

    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    void deleteResource(Long id);
}
=======
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
Module1
 Module1
