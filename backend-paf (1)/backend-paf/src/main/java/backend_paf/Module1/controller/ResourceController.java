package backend_paf.Module1.controller;

import backend_paf.Module1.model.Resource;
import backend_paf.Module1.service.ResourceService;
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

    // ── CRUD ────────────────────────────────────────────────────────────────

    // POST /api/resources → 201 Created
    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.createResource(resource));
    }

    // GET /api/resources → 200 OK
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    // GET /api/resources/{id} → 200 OK
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // PUT /api/resources/{id} → 200 OK
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id,
                                                    @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    // DELETE /api/resources/{id} → 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // ── Availability ────────────────────────────────────────────────────────

    // GET /api/resources/available?from=2026-05-01&to=2026-05-31 → 200 OK
    @GetMapping("/available")
    public List<Resource> getAvailableResources(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return resourceService.getAvailableResources(from, to);
    }

    // GET /api/resources/available/date?date=2026-05-15 → 200 OK
    @GetMapping("/available/date")
    public List<Resource> getAvailableOnDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return resourceService.getAvailableOnDate(date);
    }
}
