package com.ideaswork.scrum.domain.sprint;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.task.BurnDownDTO;

import java.util.List;

public interface SprintService {
    Sprint createSprint(Sprint sprint);

    Sprint getSprintById(String id);

    List<Sprint> getAllSprints();

    Sprint updateSprint(Sprint sprint);

    void deleteSprint(String id);

    List<Sprint> getSprintListByProductId(String productId);

    Sprint createEmptySprint(String productId);

    List<Backlog> getBacklogListBySprintId(String sprintId);

    List<BurnDownDTO> burnDownChart(String sprintId);

    List<SprintVelocityDTO> velocityChart(String sprintId);

    List<SprintWorkloadDTO> workloadChart(String sprintId);
}
