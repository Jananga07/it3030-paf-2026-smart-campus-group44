package backend_paf.Module1.service.impl;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
import backend_paf.Module1.enums.ResourceStatus;
import backend_paf.Module1.exception.ResourceNotFoundException;
import backend_paf.Module1.model.Resource;
import backend_paf.Module1.repository.ResourceRepository;
import backend_paf.Module1.service.ResourceService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // ── Mapper ──────────────────────────────────────────────────────────────

    private Resource toEntity(ResourceRequestDTO dto) {
        Resource r = new Resource();
        r.setName(dto.getName());
        r.setType(dto.getType());
        r.setLocation(dto.getLocation());
        r.setCapacity(dto.getCapacity());
        r.setDescription(dto.getDescription());
        r.setAvailableFrom(dto.getAvailableFrom());
        r.setAvailableTo(dto.getAvailableTo());
        r.setStatus(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE);
        return r;
    }

    private ResourceResponseDTO toDTO(Resource r) {
        return new ResourceResponseDTO(
                r.getId(), r.getName(), r.getType(), r.getLocation(),
                r.getCapacity(), r.getDescription(),
                r.getAvailableFrom(), r.getAvailableTo(), r.getStatus());
    }

    // ── CRUD ────────────────────────────────────────────────────────────────

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO dto) {
        return toDTO(resourceRepository.save(toEntity(dto)));
    }

    @Override
    public List<ResourceResponseDTO> getAllResources() {
        return resourceRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        return toDTO(resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id)));
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setLocation(dto.getLocation());
        existing.setCapacity(dto.getCapacity());
        existing.setDescription(dto.getDescription());
        existing.setAvailableFrom(dto.getAvailableFrom());
        existing.setAvailableTo(dto.getAvailableTo());
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }
        return toDTO(resourceRepository.save(existing));
    }

    @Override
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        resourceRepository.deleteById(id);
    }

    // ── Search ──────────────────────────────────────────────────────────────

    @Override
    public List<ResourceResponseDTO> searchResources(String type, String location, Integer capacity, ResourceStatus status) {
        return resourceRepository.searchResources(type, location, capacity, status)
                .stream().map(this::toDTO).toList();
    }

    // ── Status ──────────────────────────────────────────────────────────────

    @Override
    public ResourceResponseDTO updateStatus(Long id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resource.setStatus(status);
        return toDTO(resourceRepository.save(resource));
    }

    @Override
    public List<ResourceResponseDTO> getResourcesByStatus(ResourceStatus status) {
        return resourceRepository.findByStatus(status).stream().map(this::toDTO).toList();
    }

    // ── Availability ────────────────────────────────────────────────────────

    @Override
    public List<ResourceResponseDTO> getAvailableResources(LocalDate from, LocalDate to) {
        return resourceRepository.findAvailableResources(from, to)
                .stream().map(this::toDTO).toList();
    }
}
