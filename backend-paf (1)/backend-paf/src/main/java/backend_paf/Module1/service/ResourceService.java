package backend_paf.Module1.service;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
import backend_paf.Module1.enums.ResourceStatus;

import java.time.LocalDate;
import java.util.List;

public interface ResourceService {

    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    List<ResourceResponseDTO> getAllResources();

    ResourceResponseDTO getResourceById(Long id);

    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    void deleteResource(Long id);

    List<ResourceResponseDTO> searchResources(String type, String location, Integer capacity, ResourceStatus status);

    ResourceResponseDTO updateStatus(Long id, ResourceStatus status);

    List<ResourceResponseDTO> getResourcesByStatus(ResourceStatus status);

    List<ResourceResponseDTO> getAvailableResources(LocalDate from, LocalDate to);
}

