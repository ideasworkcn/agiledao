package com.ideaswork.scrum.domain.task.taskhours;


import com.ideaswork.scrum.domain.task.Task;
import com.ideaswork.scrum.domain.task.TaskRepository;
import com.ideaswork.scrum.domain.task.TaskService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class TaskHoursServiceImpl implements TaskHoursService {

    private final TaskHoursRepository taskHoursRepository;
    private final TaskRepository taskRepository;

    public TaskHoursServiceImpl(TaskHoursRepository taskHoursRepository, TaskRepository taskRepository) {
        this.taskHoursRepository = taskHoursRepository;
        this.taskRepository = taskRepository;
    }


    @Override
    public List<TaskHours> findBySprintId(String sprintId) {
        return taskHoursRepository.findBySprintId(sprintId);
    }

    @Override
    public List<TaskHours> findByTaskId(String taskId) {
        return taskHoursRepository.findByTaskIdOrderByCreateTime(taskId);
    }


    @Override
    public List<TaskHours> findByMemberId(String memberId) {
        return taskHoursRepository.findByMemberId(memberId);
    }

    @Override
    public TaskHours createTaskHours(TaskHours taskHours) {
        taskHours.setId(UUID.randomUUID().toString());
        taskHours.setCreateTime(new Date());
        return taskHoursRepository.save(taskHours);
    }

    @Override
    public TaskHours updateTaskHours(TaskHours taskHours) {
        return taskHoursRepository.save(taskHours);
    }

    @Override
    public void deleteTaskHours(String id) {
        taskHoursRepository.deleteById(id);
    }

    @Override
    public List<TaskHours> saveAll(List<TaskHours> taskHoursList) {
        taskHoursList.forEach(taskHours -> {
            if (taskHours.getId() == null || taskHours.getId().isEmpty()) {
                taskHours.setId(UUID.randomUUID().toString());
                taskHours.setCreateTime(new Date());
                taskHoursRepository.save(taskHours);
            }else {
                taskHoursRepository.save(taskHours);
            }
        });
        if (taskHoursList.size() > 0) {
            // 统计工时
            int allHours = taskHoursList.stream().mapToInt(TaskHours::getHours).sum();
            // 更新task的工时
            String taskId = taskHoursList.get(0).getTaskId();
            Task taskById = taskRepository.findById(taskId).get();
            taskById.setHours(allHours);
            taskById.setEndTime(new Date());
            taskRepository.save(taskById);
            return taskHoursRepository.findByTaskIdOrderByCreateTime(taskHoursList.get(0).getTaskId());

        }else{
            return taskHoursList;
        }
    }


}
