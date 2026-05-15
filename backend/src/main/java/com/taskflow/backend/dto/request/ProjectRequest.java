package com.taskflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectRequest {
    @NotBlank @Size(max = 100)
    private String name;

    private String description;
    private LocalDateTime dueDate;
}
