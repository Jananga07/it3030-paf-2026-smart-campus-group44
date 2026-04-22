package backend_paf.Module1.controller;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
import backend_paf.Module1.enums.ResourceStatus;
import backend_paf.Module1.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // ── CRUD ────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(dto));
    }

    @GetMapping
    public List<ResourceResponseDTO> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public ResourceResponseDTO getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public ResourceResponseDTO updateResource(@PathVariable Long id,
                                               @Valid @RequestBody ResourceRequestDTO dto) {
        return resourceService.updateResource(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // ── Search ──────────────────────────────────────────────────────────────

    @GetMapping("/search")
    public List<ResourceResponseDTO> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) ResourceStatus status) {
        return resourceService.searchResources(type, location, capacity, status);
    }

    // ── Status ──────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    public ResourceResponseDTO updateStatus(@PathVariable Long id,
                                             @RequestParam ResourceStatus status) {
        return resourceService.updateStatus(id, status);
    }

    @GetMapping("/status/{status}")
    public List<ResourceResponseDTO> getByStatus(@PathVariable ResourceStatus status) {
        return resourceService.getResourcesByStatus(status);
    }

    // ── Availability ────────────────────────────────────────────────────────

    @GetMapping("/available")
    public List<ResourceResponseDTO> getAvailableResources(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        return resourceService.getAvailableResources(from, to);
    }
}