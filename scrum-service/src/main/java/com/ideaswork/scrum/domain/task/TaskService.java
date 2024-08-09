package com.ideaswork.scrum.domain.task;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.task.taskhours.TaskHours;

import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    Task updateTask(Task task);
    void deleteTask(String id);
    List<Task> getAllTasks();
    Task assignTaskToUser(String taskId, String userId);

    List<Task> getTaskListBySprintId(String sprintId);

    Task getTaskById(String id);

    Backlog getBacklogWithTaskList(String sprintId, String backlogId);

    List<Task> sortTaskList(List<Task> taskList);

    List<TaskHours> updateTaskHours(List<TaskHours> taskHoursList);

}
