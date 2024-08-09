package com.ideaswork.scrum.domain.sprint.sprintbacklog;

import com.ideaswork.scrum.domain.backlog.Backlog;

import java.util.List;

public interface SprintBacklogService {
    
    SprintBacklog createSprintBacklog(SprintBacklog sprintBacklog);
    SprintBacklog readSprintBacklog(String id);
    SprintBacklog updateSprintBacklog(SprintBacklog sprintBacklog);
    void deleteSprintBacklog(String sprintId,String backlogId);

    List<Backlog> getBacklogListBySprintId(String sprintId);

    Boolean checkSprintHasBacklog(String sprintId, String backlogId);
}
