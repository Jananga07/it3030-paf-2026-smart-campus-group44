package backend_paf.Module1.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ResourceRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String description;

    private String status;

    private String availabilityWindow;

    public ResourceRequestDTO() {}

    // GETTERS
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getAvailabilityWindow() { return availabilityWindow; }

    // SETTERS
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setLocation(String location) { this.location = location; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(String status) { this.status = status; }
    public void setAvailabilityWindow(String availabilityWindow) { this.availabilityWindow = availabilityWindow; }
}
