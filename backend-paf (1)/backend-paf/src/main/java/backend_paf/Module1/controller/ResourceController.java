package backend_paf.Module1.controller;

import backend_paf.Module1.dto.ResourceRequestDTO;
import backend_paf.Module1.dto.ResourceResponseDTO;
Module1-feature/Validation

import backend_paf.Module1.enums.ResourceStatus;
Module1
import backend_paf.Module1.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

Module1-feature/Validation

import java.time.LocalDate;
Module1
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

Module1-feature/Validation
    // CREATE
    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO created = resourceService.createResource(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        List<ResourceResponseDTO> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        ResourceResponseDTO resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO updated = resourceService.updateResource(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    // DELETE
=======
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

Module1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
Module1-feature/Validation
}
=======

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
Module1
