package backend_paf.Module1.service.impl;

import backend_paf.Module1.model.Resource;
import backend_paf.Module1.repository.ResourceRepository;
import backend_paf.Module1.service.ResourceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

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
        return resourceRepository.findById(id).orElse(null);
    }

    @Override
    public Resource updateResource(Long id, Resource resource) {
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
    }

    @Override
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}