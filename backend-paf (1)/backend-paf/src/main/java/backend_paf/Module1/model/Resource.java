package backend_paf.Module1.model;

Module1-feature/CRUD
import jakarta.persistence.*;
=======
 Module1-feature/Availability
import jakarta.persistence.*;
import java.time.LocalDate;
=======
Module1-feature/Validation
import jakarta.persistence.*;
=======
import backend_paf.Module1.enums.ResourceStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
Module1
 Module1
 Module1

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
Module1-feature/CRUD
    private Integer capacity;
    private String location;

    private String type;   // simple string (CRUD branch)
    private String status; // simple string (CRUD branch)

    private String availabilityWindow;

    public Resource() {
    }

    public Resource(Long id, String name, Integer capacity, String location,
                    String type, String status, String availabilityWindow) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.location = location;
        this.type = type;
        this.status = status;
        this.availabilityWindow = availabilityWindow;
    }

    // GETTERS

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    public String getType() {
        return type;
    }

    public String getStatus() {
        return status;
    }

    public String getAvailabilityWindow() {
        return availabilityWindow;
    }

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAvailabilityWindow(String availabilityWindow) {
        this.availabilityWindow = availabilityWindow;
    }
}
=======
    private String type;
    private String location;
    private Integer capacity;
    private String description;
 Module1-feature/Availability
    private String status;

    // Feature: Availability
    private LocalDate availableFrom;
    private LocalDate availableTo;
=======
Module1-feature/Validation
    private String status;
    private String availabilityWindow;
 Module1

    public Resource() {}

    // GETTERS
 Module1-feature/Availability

=======
 Module1
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
 Module1-feature/Availability
    public LocalDate getAvailableFrom() { return availableFrom; }
    public LocalDate getAvailableTo() { return availableTo; }

    // SETTERS

=======
    public String getAvailabilityWindow() { return availabilityWindow; }

    // SETTERS
 Module1
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(String status) { this.status = status; }
 Module1-feature/Availability
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }
    public void setAvailableTo(LocalDate availableTo) { this.availableTo = availableTo; }
=======
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
=======

    // Feature: Availability
    private LocalDate availableFrom;
    private LocalDate availableTo;

    // Feature: Status
    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    public Resource() {}

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
 Module1
}
Module1
