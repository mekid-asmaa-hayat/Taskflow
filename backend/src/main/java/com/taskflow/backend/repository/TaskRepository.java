package com.taskflow.backend.repository;

import com.taskflow.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByProjectIdOrderByPosition(String projectId);
    List<Task> findByAssigneeId(String assigneeId);
    List<Task> findByProjectIdAndStatus(String projectId, Task.Status status);
}
