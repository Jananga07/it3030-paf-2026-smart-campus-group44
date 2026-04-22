package backend_paf.Module1.service.impl;

Module1-feature/CRUD
=======
Module1-feature/Availability
=======
import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
 Module1-feature/Validation
=======
import backend_paf.Module1.enums.ResourceStatus;
 Module1
import backend_paf.Module1.exception.ResourceNotFoundException;
Module1
Module1
import backend_paf.Module1.model.Resource;
import backend_paf.Module1.repository.ResourceRepository;
import backend_paf.Module1.service.ResourceService;
import org.springframework.stereotype.Service;

Module1-feature/CRUD
import java.util.List;
=======
 Module1-feature/Availability
import java.time.LocalDate;
import java.util.List;
=======
 Module1-feature/Validation
import java.util.List;
import java.util.stream.Collectors;
=======
import java.time.LocalDate;
import java.util.List;
Module1
 Module1
Module1

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
 Module1-feature/CRUD
=======
 Module1-feature/Availability
    // ── CRUD ────────────────────────────────────────────────────────────────
Module1

    @Override
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(Long id) {
Module1-feature/CRUD
        return resourceRepository.findById(id).orElse(null);
=======
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
Module1
    }

    @Override
    public Resource updateResource(Long id, Resource resource) {
Module1-feature/CRUD
        Resource existingResource = resourceRepository.findById(id).orElse(null);

        if (existingResource != null) {
            existingResource.setName(resource.getName());
            existingResource.setCapacity(resource.getCapacity());
            existingResource.setLocation(resource.getLocation());
            existingResource.setAvailabilityWindow(resource.getAvailabilityWindow());
            existingResource.setType(resource.getType());
            existingResource.setStatus(resource.getStatus());

            return resourceRepository.save(existingResource);
        }

        return null;
=======
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        existing.setName(resource.getName());
        existing.setType(resource.getType());
        existing.setLocation(resource.getLocation());
        existing.setCapacity(resource.getCapacity());
        existing.setDescription(resource.getDescription());
        existing.setStatus(resource.getStatus());
        existing.setAvailableFrom(resource.getAvailableFrom());
        existing.setAvailableTo(resource.getAvailableTo());

        return resourceRepository.save(existing);
=======
 Module1-feature/Validation
    private Resource toEntity(ResourceRequestDTO dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setLocation(dto.getLocation());
        resource.setCapacity(dto.getCapacity());
        resource.setDescription(dto.getDescription());
        resource.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        resource.setAvailabilityWindow(dto.getAvailabilityWindow());
        return resource;
    }

    private ResourceResponseDTO toDTO(Resource resource) {
        return new ResourceResponseDTO(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getLocation(),
                resource.getCapacity(),
                resource.getDescription(),
                resource.getStatus(),
                resource.getAvailabilityWindow()
        );
    }

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        Resource resource = toEntity(requestDTO);
        Resource saved = resourceRepository.save(resource);
        return toDTO(saved);
=======
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
Module1
    }

    @Override
    public List<ResourceResponseDTO> getAllResources() {
 Module1-feature/Validation
        return resourceRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
=======
        return resourceRepository.findAll().stream().map(this::toDTO).toList();
 Module1
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
 Module1-feature/Validation
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return toDTO(resource);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resource.setName(requestDTO.getName());
        resource.setType(requestDTO.getType());
        resource.setLocation(requestDTO.getLocation());
        resource.setCapacity(requestDTO.getCapacity());
        resource.setDescription(requestDTO.getDescription());
        if (requestDTO.getStatus() != null) {
            resource.setStatus(requestDTO.getStatus());
        }
        resource.setAvailabilityWindow(requestDTO.getAvailabilityWindow());
        Resource updated = resourceRepository.save(resource);
        return toDTO(updated);
=======
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
 Module1
Module1
Module1
    }

    @Override
    public void deleteResource(Long id) {
Module1-feature/CRUD
        resourceRepository.deleteById(id);
    }
}
=======
 Module1-feature/Availability
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
=======
 Module1-feature/Validation
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resourceRepository.delete(resource);
=======
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
Module1
        }
        resourceRepository.deleteById(id);
    }

 Module1-feature/Availability
    // ── Availability ────────────────────────────────────────────────────────

    @Override
    public List<Resource> getAvailableResources(LocalDate from, LocalDate to) {
        return resourceRepository.findAvailableResources(from, to);
    }

    @Override
    public List<Resource> getAvailableOnDate(LocalDate date) {
        return resourceRepository.findAvailableOnDate(date);
=======
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
 Module1
Module1
    }
}
Module1
