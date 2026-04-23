package backend_paf.Module3.controller;

import backend_paf.Module3.model.Comment;
import backend_paf.Module3.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @RequestParam("ticketId") Long ticketId,
            @RequestParam("userId") Long userId,
            @RequestParam("text") String text) {
        
        Comment comment = commentService.addComment(ticketId, userId, text);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Comment>> getCommentsByTicket(@PathVariable Long ticketId) {
        List<Comment> comments = commentService.getCommentsByTicket(ticketId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id,
            @RequestParam("userId") Long userId,
            @RequestParam("text") String text) {
        
        Comment updatedComment = commentService.updateComment(id, userId, text);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestParam("userId") Long userId) {
        
        commentService.deleteComment(id, userId);
        return ResponseEntity.noContent().build();
    }
}
