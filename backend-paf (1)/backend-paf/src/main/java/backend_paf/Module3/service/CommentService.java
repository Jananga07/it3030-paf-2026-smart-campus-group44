package backend_paf.Module3.service;

import backend_paf.Module3.model.Comment;
import backend_paf.Module3.model.Ticket;
import backend_paf.Module3.model.User;
import backend_paf.Module3.model.Role;
import backend_paf.Module3.repository.CommentRepository;
import backend_paf.Module3.repository.TicketRepository;
import backend_paf.Module3.repository.UserRepository;
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
    private UserRepository userRepository;

    public Comment addComment(Long ticketId, Long userId, String text) {
        if (text == null || text.trim().isEmpty() || text.length() > 300) {
            throw new IllegalArgumentException("Comment text must be between 1 and 300 characters.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setTicket(ticket);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Allow delete if owner OR admin OR technician
        boolean isOwner = comment.getUser().getId().equals(userId);
        boolean isStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.TECHNICIAN;

        if (!isOwner && !isStaff) {
            throw new RuntimeException("Unauthorized action. You do not have permission to delete this comment.");
        }

        commentRepository.delete(comment);
    }

    public Comment updateComment(Long commentId, Long userId, String newText) {
        if (newText == null || newText.trim().isEmpty() || newText.length() > 300) {
            throw new IllegalArgumentException("Comment text must be between 1 and 300 characters.");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Allow update if owner OR admin OR technician
        boolean isOwner = comment.getUser().getId().equals(userId);
        boolean isStaff = user.getRole() == Role.ADMIN || user.getRole() == Role.TECHNICIAN;

        if (!isOwner && !isStaff) {
            throw new RuntimeException("Unauthorized action. You do not have permission to edit this comment.");
        }

        comment.setText(newText);
        return commentRepository.save(comment);
    }
}
