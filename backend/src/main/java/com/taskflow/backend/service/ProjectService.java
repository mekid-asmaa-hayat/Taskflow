package com.taskflow.backend.service;

import com.taskflow.backend.dto.request.ProjectRequest;
import com.taskflow.backend.dto.response.ProjectResponse;
import com.taskflow.backend.entity.Project;
import com.taskflow.backend.entity.User;
import com.taskflow.backend.exception.ResourceNotFoundException;
import com.taskflow.backend.exception.UnauthorizedException;
import com.taskflow.backend.repository.ProjectRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<ProjectResponse> getAllForUser(String userId) {
        return projectRepository.findAllForUser(userId)
                .stream().map(ProjectResponse::from).toList();
    }

    public ProjectResponse getById(String id, String userId) {
        Project p = findAndCheckAccess(id, userId);
        return ProjectResponse.from(p);
    }

    @Transactional
    public ProjectResponse create(ProjectRequest req, String ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Project project = Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .dueDate(req.getDueDate())
                .owner(owner)
                .build();
        project.addMember(owner);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(String id, ProjectRequest req, String userId) {
        Project p = findAndCheckAccess(id, userId);
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setDueDate(req.getDueDate());
        return ProjectResponse.from(projectRepository.save(p));
    }

    @Transactional
    public void delete(String id, String userId) {
        Project p = findAndCheckOwner(id, userId);
        projectRepository.delete(p);
    }

    @Transactional
    public ProjectResponse addMember(String projectId, String memberId, String requesterId) {
        Project p = findAndCheckOwner(projectId, requesterId);
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        p.addMember(member);
        return ProjectResponse.from(projectRepository.save(p));
    }

    private Project findAndCheckAccess(String id, String userId) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        boolean isMember = p.getOwner().getId().equals(userId)
                || p.getMembers().stream().anyMatch(m -> m.getId().equals(userId));
        if (!isMember) throw new UnauthorizedException("Access denied");
        return p;
    }

    private Project findAndCheckOwner(String id, String userId) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (!p.getOwner().getId().equals(userId)) throw new UnauthorizedException("Only owner can do this");
        return p;
    }
}
