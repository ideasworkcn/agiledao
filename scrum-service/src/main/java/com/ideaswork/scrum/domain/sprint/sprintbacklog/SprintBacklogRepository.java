package com.ideaswork.scrum.domain.sprint.sprintbacklog;

import com.ideaswork.scrum.domain.backlog.Backlog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintBacklogRepository extends JpaRepository<SprintBacklog, String> {
    List<SprintBacklog> findBySprintId(String sprintId);

    int countByBacklogId(String backlogId);

    int countBySprintIdAndBacklogId(String sprintId, String backlogId);

    List<SprintBacklog> findBySprintIdAndBacklogId(String sprintId, String backlogId);
}
