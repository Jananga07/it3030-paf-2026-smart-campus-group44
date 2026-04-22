package backend_paf.Module1.dto;

Module1-feature/Validation
=======
import backend_paf.Module1.enums.ResourceStatus;
import java.time.LocalDate;

Module1
public class ResourceResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String location;
    private Integer capacity;
    private String description;
Module1-feature/Validation
    private String status;
    private String availabilityWindow;
=======
    private LocalDate availableFrom;
    private LocalDate availableTo;
    private ResourceStatus status;
Module1

    public ResourceResponseDTO() {}

    public ResourceResponseDTO(Long id, String name, String type, String location,
                                Integer capacity, String description,
Module1-feature/Validation
                                String status, String availabilityWindow) {
=======
                                LocalDate availableFrom, LocalDate availableTo,
                                ResourceStatus status) {
Module1
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.capacity = capacity;
        this.description = description;
Module1-feature/Validation
        this.status = status;
        this.availabilityWindow = availabilityWindow;
    }

    // GETTERS
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getAvailabilityWindow() { return availabilityWindow; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(String status) { this.status = status; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
=======
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }

    public LocalDate getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalDate availableTo) { this.availableTo = availableTo; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }
Module1
}
