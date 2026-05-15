package com.taskflow.backend.dto.request;

import com.taskflow.backend.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank @Size(max = 200)
    private String title;

    private String description;
    private Task.Priority priority;
    private String assigneeId;
    private LocalDateTime dueDate;
}
