package com.ideaswork.scrum.domain.task;


import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.sprint.Sprint;
import com.ideaswork.scrum.domain.sprint.SprintRepository;
import com.ideaswork.scrum.domain.task.Task;
import com.ideaswork.scrum.domain.task.TaskRepository;
import com.ideaswork.scrum.domain.task.TaskService;
import com.ideaswork.scrum.domain.task.taskhours.TaskHours;
import com.ideaswork.scrum.domain.task.taskhours.TaskHoursService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskHoursService taskHoursService;
    private final BacklogService backlogService;
    private final SprintRepository sprintRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskHoursService taskHoursService, BacklogService backlogService, SprintRepository sprintRepository) {
        this.taskRepository = taskRepository;
        this.taskHoursService = taskHoursService;
        this.backlogService = backlogService;
        this.sprintRepository = sprintRepository;
    }

    @Override
    public Task createTask(Task task) {
        task.setId(UUID.randomUUID().toString());
        // 查找改status和sprintId和backlogId的task数量
        int count = taskRepository.countByStatusAndSprintIdAndProductBacklogId(task.getStatus(), task.getSprintId(), task.getProductBacklogId());
        task.setPx(++count);
        task.setCreateTime(new java.util.Date());
        task.setEstimatedHours(0);
        task.setHours(0);
        task.setStatus("todo");
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        Task existingTask = taskRepository.findById(task.getId()).get();
        BeanUtils.copyProperties(task, existingTask, "id");
        if (!task.getStatus().equals(existingTask.getStatus())) {
            if (task.getStatus().equals("done")) {
                existingTask.setEndTime(new java.util.Date());
            }
            if (task.getStatus().equals("inprogress")) {
                existingTask.setStartTime(new java.util.Date());
            }
        }
        Task save = taskRepository.save(existingTask);
        Optional<Sprint> byId = sprintRepository.findById(existingTask.getSprintId());
        if (byId.isPresent()) {
            Sprint sprint = byId.get();
            List<Task> taskList = taskRepository.findBySprintId(sprint.getId());
            int estimatedHours = taskList.stream().mapToInt(Task::getEstimatedHours).sum();
            sprint.setEstimateVelocity(estimatedHours);
            sprintRepository.save(sprint);
        }
        return save;
    }

    @Override
    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task assignTaskToUser(String taskId, String userId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setMemberId(userId);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTaskListBySprintId(String sprintId) {
        return  taskRepository.findBySprintId(sprintId);
    }

    @Override
    public Task getTaskById(String id) {
        Optional<Task> byId = taskRepository.findById(id);
        if (byId.isPresent()) {
            Task task = byId.get();
            task.setTaskHoursList(taskHoursService.findByTaskId(task.getId()));
            return task;
        }else{
            return null;
        }

    }

    @Override
    public Backlog getBacklogWithTaskList(String sprintId, String backlogId) {
        List<Task> taskList = taskRepository.findBySprintIdAndProductBacklogIdOrderByStatus(sprintId, backlogId);
        // 每种 status 按照 px  排序
        List<Task> todoList = taskList.stream().filter(task -> task.getStatus().equals("todo")).collect(Collectors.toList());
        List<Task> doingList = taskList.stream().filter(task -> task.getStatus().equals("inprogress")).collect(Collectors.toList());
        List<Task> doneList = taskList.stream().filter(task -> task.getStatus().equals("done")).collect(Collectors.toList());
        todoList.sort((o1, o2) -> o1.getPx() - o2.getPx());
        doingList.sort((o1, o2) -> o1.getPx() - o2.getPx());
        doneList.sort((o1, o2) -> o1.getPx() - o2.getPx());
        // 合并3个list

        ArrayList<Task> tasks = new ArrayList<>();
        tasks.addAll(todoList);
        tasks.addAll(doingList);
        tasks.addAll(doneList);

        Backlog backlog = backlogService.findById(backlogId);
        backlog.setTaskList(tasks);
        return backlog;
    }

    @Override
    public List<Task> sortTaskList(List<Task> taskList) {
        List<Task> tasks = taskRepository.saveAll(taskList);
        return tasks;
    }

    @Override
    public List<TaskHours> updateTaskHours(List<TaskHours> taskHoursList) {

        return taskHoursService.saveAll(taskHoursList);
    }


}
