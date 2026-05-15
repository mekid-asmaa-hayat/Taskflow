package com.taskflow.backend.controller;

import com.taskflow.backend.dto.request.TaskRequest;
import com.taskflow.backend.dto.response.TaskResponse;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(taskService.getByProject(projectId));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> create(@PathVariable String projectId,
                                                @Valid @RequestBody TaskRequest req,
                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.create(projectId, req, user.getId()));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable String id,
                                                @Valid @RequestBody TaskRequest req,
                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.update(id, req, user.getId()));
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable String id,
                                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(taskService.updateStatus(id, body.get("status")));
    }

    @PatchMapping("/projects/{projectId}/tasks/reorder")
    public ResponseEntity<Void> reorder(@PathVariable String projectId,
                                         @RequestBody List<Map<String, Object>> positions) {
        taskService.reorder(projectId, positions);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal User user) {
        taskService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
