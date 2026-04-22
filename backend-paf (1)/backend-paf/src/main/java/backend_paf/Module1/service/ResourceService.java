package backend_paf.Module1.service;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;

import java.util.List;

public interface ResourceService {

    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO);

    List<ResourceResponseDTO> getAllResources();

    ResourceResponseDTO getResourceById(Long id);

    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO);

    void deleteResource(Long id);
}
