package backend_paf.Module1.service.impl;

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

    // ── CRUD ────────────────────────────────────────────────────────────────

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
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(Long id, Resource resource) {
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
    }

    @Override
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    // ── Availability ────────────────────────────────────────────────────────

    @Override
    public List<Resource> getAvailableResources(LocalDate from, LocalDate to) {
        return resourceRepository.findAvailableResources(from, to);
    }

    @Override
    public List<Resource> getAvailableOnDate(LocalDate date) {
        return resourceRepository.findAvailableOnDate(date);
    }
}
