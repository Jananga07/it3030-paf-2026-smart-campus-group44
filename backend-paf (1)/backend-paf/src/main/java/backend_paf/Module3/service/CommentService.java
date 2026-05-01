package backend_paf.Module3.service;

import backend_paf.Module3.model.Comment;
import backend_paf.Module3.model.Ticket;
import backend_paf.Module3.repository.CommentRepository;
import backend_paf.Module3.repository.TicketRepository;
import backend_paf.Module4.service.NotificationEventService;
import backend_paf.Module5.entity.AppUser;
import backend_paf.Module5.entity.Role;
import backend_paf.Module5.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private NotificationEventService notificationEventService;

    public Comment addComment(Long ticketId, Long userId, String text) {
        if (text == null || text.trim().isEmpty() || text.length() > 300) {
            throw new IllegalArgumentException("Comment text must be between 1 and 300 characters.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setTicket(ticket);
        comment.setUserId(userId);
        comment.setUserName(user.getName());
        comment.setUserRole(user.getRole().name());

        Comment saved = commentRepository.save(comment);

        try {
            Long ticketOwnerId = ticket.getUserId();
            if (!ticketOwnerId.equals(userId)) {
                notificationEventService.notifyNewTicketComment(
                        ticketOwnerId, ticketId, user.getName());
            }
        } catch (Exception ignored) { }

        return saved;
    }

    public List<Comment> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = comment.getUserId().equals(userId);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: you cannot delete this comment.");
        }

        commentRepository.delete(comment);
    }

    public Comment updateComment(Long commentId, Long userId, String newText) {
        if (newText == null || newText.trim().isEmpty() || newText.length() > 300) {
            throw new IllegalArgumentException("Comment text must be between 1 and 300 characters.");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = comment.getUserId().equals(userId);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: you cannot edit this comment.");
        }

        comment.setText(newText);
        return commentRepository.save(comment);
    }
}
