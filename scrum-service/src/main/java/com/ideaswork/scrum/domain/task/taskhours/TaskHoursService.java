package com.ideaswork.scrum.domain.task.taskhours;

import java.util.List;

public interface TaskHoursService {
    List<TaskHours> findBySprintId(String sprintId);
    List<TaskHours> findByTaskId(String taskId);

    List<TaskHours> findByMemberId(String memberId);

    TaskHours createTaskHours(TaskHours taskHours);
    TaskHours updateTaskHours(TaskHours taskHours);
    void deleteTaskHours(String id);

    List<TaskHours> saveAll(List<TaskHours> taskHoursList);
}
