package backend_paf.Module1.dto;

import backend_paf.Module1.enums.ResourceStatus;
import java.time.LocalTime;

public class ResourceResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String location;
    private Integer capacity;
    private String description;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;

    public ResourceResponseDTO() {}

    public ResourceResponseDTO(Long id, String name, String type, String location,
                                Integer capacity, String description,
                                LocalTime availableFrom, LocalTime availableTo,
                                ResourceStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.capacity = capacity;
        this.description = description;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public LocalTime getAvailableFrom() { return availableFrom; }
    public LocalTime getAvailableTo() { return availableTo; }
    public ResourceStatus getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDescription(String description) { this.description = description; }
    public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }
    public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
    public void setStatus(ResourceStatus status) { this.status = status; }
}
