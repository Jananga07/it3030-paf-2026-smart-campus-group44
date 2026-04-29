package backend_paf.Module3.service;

import backend_paf.Module3.model.Role;
import backend_paf.Module3.model.Ticket;
import backend_paf.Module3.model.TicketStatus;
import backend_paf.Module3.model.User;
import backend_paf.Module3.repository.TicketRepository;
import backend_paf.Module3.repository.UserRepository;
// Module 4 – notification integration
import backend_paf.Module4.service.NotificationEventService;
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
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Module 4 – triggers in-app notifications on ticket status changes
    @Autowired
    private NotificationEventService notificationEventService;

    public Ticket createTicket(Long userId, String title, String description, String category, String location, String email, String contactInfo, String priorityLevel, MultipartFile[] evidences) {
        if (description == null || description.length() < 10 || description.length() > 1000) {
            throw new IllegalArgumentException("Ticket description must be between 10 and 1000 characters.");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(evidences != null && evidences.length > 3) {
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
        ticket.setUser(user);
        ticket.setStatus(TicketStatus.OPEN);

        List<String> savedFiles = new ArrayList<>();
        if (evidences != null) {
            for (MultipartFile file : evidences) {
                if(!file.isEmpty()){
                    String fileName = fileStorageService.storeFile(file);
                    savedFiles.add(fileName);
                }
            }
        }
        ticket.setAttachedEvidences(savedFiles);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets(Long userId) {
        backend_paf.Module5.entity.AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found in Auth module"));

        if (appUser.getRole() == backend_paf.Module5.entity.Role.ADMIN || appUser.getRole() == backend_paf.Module5.entity.Role.TECHNICIAN) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN || user.getRole() == Role.TECHNICIAN) {
            return ticketRepository.findAll();
        } else {
            return ticketRepository.findByUserId(userId);
        }
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    @Autowired
    private backend_paf.Module5.repository.AppUserRepository appUserRepository;

    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus, String note, Long userId) {
        backend_paf.Module5.entity.AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found in Auth module"));

        if (appUser.getRole() != backend_paf.Module5.entity.Role.ADMIN && appUser.getRole() != backend_paf.Module5.entity.Role.TECHNICIAN) {
    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus, String note, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException("Unauthorized action. Only Admin or Technician can update status.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(newStatus);
        ticket.setStatusNote(note);
        Ticket saved = ticketRepository.save(ticket);

        // Module 4 – notify ticket owner of status change
        try {
            notificationEventService.notifyTicketStatusChanged(
                    ticket.getUser().getId(), ticketId, newStatus.name());
        } catch (Exception ignored) { /* don't fail ticket update if notification fails */ }

        return saved;
    }

    public Ticket addResolutionNotes(Long ticketId, String notes, Long userId) {
        backend_paf.Module5.entity.AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found in Auth module"));

        if (appUser.getRole() != backend_paf.Module5.entity.Role.ADMIN && appUser.getRole() != backend_paf.Module5.entity.Role.TECHNICIAN) {
        return ticketRepository.save(ticket);
          Development-
    }

    public Ticket addResolutionNotes(Long ticketId, String notes, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException("Unauthorized action. Only Admin or Technician can add resolution notes.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setResolutionNotes(notes);
        return ticketRepository.save(ticket);
    }
}
