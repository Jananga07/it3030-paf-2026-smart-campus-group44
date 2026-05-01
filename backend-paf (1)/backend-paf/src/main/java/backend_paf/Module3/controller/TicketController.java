package backend_paf.Module3.controller;

import backend_paf.Module3.model.Ticket;
import backend_paf.Module3.model.TicketStatus;
import backend_paf.Module3.service.TicketService;
import backend_paf.Module5.entity.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") // For development
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam("email") String email,
            @RequestParam("contactInfo") String contactInfo,
            @RequestParam("priorityLevel") String priorityLevel,
            @RequestParam(value = "evidences", required = false) MultipartFile[] evidences) {
        
        Ticket ticket = ticketService.createTicket(userId, title, description, category, location, email, contactInfo, priorityLevel, evidences);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(@RequestParam("userId") Long userId) {
        List<Ticket> tickets = ticketService.getAllTickets(userId);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") TicketStatus status,
            @RequestParam(value = "note", required = false) String note,
            @RequestParam("userId") Long userId) {
        
        Ticket updatedTicket = ticketService.updateTicketStatus(id, status, note, userId);
        return ResponseEntity.ok(updatedTicket);
    }

    @PatchMapping("/{id}/resolution")
    public ResponseEntity<Ticket> addResolutionNotes(
            @PathVariable Long id,
            @RequestParam("notes") String notes,
            @RequestParam("userId") Long userId) {
        
        Ticket updatedTicket = ticketService.addResolutionNotes(id, notes, userId);
        return ResponseEntity.ok(updatedTicket);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @RequestParam("technicianId") Long technicianId,
            @RequestParam("adminId") Long adminId) {
        Ticket updatedTicket = ticketService.assignTechnician(id, technicianId, adminId);
        return ResponseEntity.ok(updatedTicket);
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<AppUser>> getTechnicians() {
        return ResponseEntity.ok(ticketService.getTechnicians());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id, @RequestParam Long adminId) {
        ticketService.deleteTicket(id, adminId);
        return ResponseEntity.noContent().build();
    }
}
