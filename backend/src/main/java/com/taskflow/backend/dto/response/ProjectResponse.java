package com.taskflow.backend.dto.response;

import com.taskflow.backend.entity.Project;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class ProjectResponse {
    private String id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private String ownerId;
    private String ownerName;
    private int memberCount;
    private int taskCount;

    public static ProjectResponse from(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .status(p.getStatus().name())
                .dueDate(p.getDueDate())
                .createdAt(p.getCreatedAt())
                .ownerId(p.getOwner().getId())
                .ownerName(p.getOwner().getFirstName() + " " + p.getOwner().getLastName())
                .memberCount(p.getMembers().size())
                .taskCount(p.getTasks().size())
                .build();
    }
}
