package com.taskflow.backend.controller;

import com.taskflow.backend.dto.request.ProjectRequest;
import com.taskflow.backend.dto.response.ProjectResponse;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAllForUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest req,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.create(req, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody ProjectRequest req,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.update(id, req, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal User user) {
        projectService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members/{memberId}")
    public ResponseEntity<ProjectResponse> addMember(@PathVariable String id,
                                                      @PathVariable String memberId,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.addMember(id, memberId, user.getId()));
    }
}
