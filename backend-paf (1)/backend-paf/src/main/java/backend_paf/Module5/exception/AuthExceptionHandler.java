package backend_paf.Module5.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

/**
 * Module 5 – Global exception handler for auth-related errors.
 *
 * Returns clean JSON error bodies instead of Spring's default HTML error page.
 */
@RestControllerAdvice
public class AuthExceptionHandler {

    /** 401 – not authenticated */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(errorBody(401, "Unauthorized", ex.getMessage()));
    }

    /** 403 – authenticated but insufficient role */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorBody(403, "Forbidden", "You do not have permission to access this resource."));
    }

    /** 404 – user not found after OAuth login */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        if (ex.getMessage() != null && ex.getMessage().startsWith("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(errorBody(404, "Not Found", ex.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody(500, "Internal Server Error", ex.getMessage()));
    }

    private Map<String, Object> errorBody(int status, String error, String message) {
        return Map.of(
                "timestamp", Instant.now().toString(),
                "status",    status,
                "error",     error,
                "message",   message != null ? message : ""
        );
    }
}
