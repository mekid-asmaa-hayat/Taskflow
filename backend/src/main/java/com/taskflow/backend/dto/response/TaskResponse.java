package com.taskflow.backend.dto.response;

import com.taskflow.backend.entity.Task;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Integer position;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private String projectId;
    private String assigneeId;
    private String assigneeName;
    private String createdById;

    public static TaskResponse from(Task t) {
        return TaskResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .priority(t.getPriority().name())
                .position(t.getPosition())
                .dueDate(t.getDueDate())
                .createdAt(t.getCreatedAt())
                .projectId(t.getProject().getId())
                .assigneeId(t.getAssignee() != null ? t.getAssignee().getId() : null)
                .assigneeName(t.getAssignee() != null
                        ? t.getAssignee().getFirstName() + " " + t.getAssignee().getLastName() : null)
                .createdById(t.getCreatedBy().getId())
                .build();
    }
}
