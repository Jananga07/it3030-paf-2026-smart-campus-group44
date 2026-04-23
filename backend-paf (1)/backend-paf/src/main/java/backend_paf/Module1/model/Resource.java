package backend_paf.Module1.model;

import backend_paf.Module1.enums.ResourceStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String location;
    private Integer capacity;
    private String description;
    private LocalDate availableFrom;
    private LocalDate availableTo;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    public Resource() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public LocalDate getAvailableFrom() { return availableFrom; }
    public LocalDate getAvailableTo() { return availableTo; }
    public ResourceStatus getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDescription(String description) { this.description = description; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }
    public void setAvailableTo(LocalDate availableTo) { this.availableTo = availableTo; }
    public void setStatus(ResourceStatus status) { this.status = status; }
}