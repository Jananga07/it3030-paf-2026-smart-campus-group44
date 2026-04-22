package backend_paf.Module1.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(Long id) {
        super("Resource not found with id: " + id);
    }
 Module1-feature/Validation
=======

    public ResourceNotFoundException(String message) {
        super(message);
    }
 Module1
}
