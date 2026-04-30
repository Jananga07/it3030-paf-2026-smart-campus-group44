package backend_paf.Module3.service;

import backend_paf.Module3.model.Ticket;
import backend_paf.Module3.model.TicketStatus;
import backend_paf.Module3.repository.TicketRepository;
import backend_paf.Module4.service.NotificationEventService;
import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.entity.Role;
import backend_paf.Module5.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NotificationEventService notificationEventService;

    public Ticket createTicket(Long userId, String title, String description,
                               String category, String location, String email,
                               String contactInfo, String priorityLevel,
                               MultipartFile[] evidences) {

        if (description == null || description.length() < 10 || description.length() > 1000) {
            throw new IllegalArgumentException("Ticket description must be between 10 and 1000 characters.");
        }

        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (evidences != null && evidences.length > 3) {
            throw new IllegalArgumentException("Maximum of 3 files can be attached.");
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setLocation(location);
        ticket.setEmail(email);
        ticket.setContactInfo(contactInfo);
        ticket.setPriorityLevel(priorityLevel);
        ticket.setUserId(userId);
        ticket.setStatus(TicketStatus.OPEN);

        List<String> savedFiles = new ArrayList<>();
        if (evidences != null) {
            for (MultipartFile file : evidences) {
                if (!file.isEmpty()) {
                    String fileName = fileStorageService.storeFile(file);
                    savedFiles.add(fileName);
                }
            }
        }
        ticket.setAttachedEvidences(savedFiles);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            return ticketRepository.findAll();
        } else {
            return ticketRepository.findByUserId(userId);
        }
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus,
                                     String note, Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized: only admins can update ticket status.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(newStatus);
        ticket.setStatusNote(note);
        Ticket saved = ticketRepository.save(ticket);

        try {
            notificationEventService.notifyTicketStatusChanged(
                    ticket.getUserId(), ticketId, newStatus.name());
        } catch (Exception ignored) { }

        return saved;
    }

    public Ticket addResolutionNotes(Long ticketId, String notes, Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized: only admins can add resolution notes.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setResolutionNotes(notes);
        return ticketRepository.save(ticket);
    }
}
