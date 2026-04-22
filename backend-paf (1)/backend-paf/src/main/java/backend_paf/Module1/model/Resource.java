package backend_paf.Module1.model;

import jakarta.persistence.*;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
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