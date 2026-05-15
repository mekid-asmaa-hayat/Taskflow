package com.taskflow.backend.service;

import com.taskflow.backend.dto.request.TaskRequest;
import com.taskflow.backend.dto.response.TaskResponse;
import com.taskflow.backend.entity.Project;
import com.taskflow.backend.entity.Task;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.exception.ResourceNotFoundException;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.repository.ProjectRepository;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getByProject(String projectId) {
        return taskRepository.findByProjectIdOrderByPosition(projectId)
                .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getById(String id) {
        return TaskResponse.from(findTask(id));
    }

    @Transactional
    public TaskResponse create(String projectId, TaskRequest req, String creatorId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? req.getPriority() : Task.Priority.MEDIUM)
                .project(project)
                .createdBy(creator)
                .dueDate(req.getDueDate())
                .build();

        if (req.getAssigneeId() != null) {
            User assignee = userRepository.findById(req.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(String id, TaskRequest req, String userId) {
        Task task = findTask(id);
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        if (req.getAssigneeId() != null) {
            User assignee = userRepository.findById(req.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateStatus(String id, String status) {
        Task task = findTask(id);
        task.setStatus(Task.Status.valueOf(status));
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void reorder(String projectId, List<Map<String, Object>> positions) {
        positions.forEach(entry -> {
            String taskId = (String) entry.get("id");
            int pos = (int) entry.get("position");
            Task t = findTask(taskId);
            t.setPosition(pos);
            taskRepository.save(t);
        });
    }

    @Transactional
    public void delete(String id, String userId) {
        Task task = findTask(id);
        if (!task.getCreatedBy().getId().equals(userId))
            throw new UnauthorizedException("Only creator can delete");
        taskRepository.delete(task);
    }

    private Task findTask(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }
}
