package backend_paf.Module1.controller;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
import backend_paf.Module1.enums.ResourceStatus;
import backend_paf.Module1.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
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

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        return ResponseEntity.ok(resourceService.updateResource(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) ResourceStatus status) {
        return ResponseEntity.ok(resourceService.searchResources(type, location, capacity, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        return ResponseEntity.ok(resourceService.updateStatus(id, status));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ResourceResponseDTO>> getByStatus(@PathVariable ResourceStatus status) {
        return ResponseEntity.ok(resourceService.getResourcesByStatus(status));
    }

    @GetMapping("/available")
    public ResponseEntity<List<ResourceResponseDTO>> getAvailableResources(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(resourceService.getAvailableResources(from, to));
    }
}

