package com.ideaswork.scrum.domain.sprint;


import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.sprint.sprintbacklog.SprintBacklogService;
import com.ideaswork.scrum.domain.task.BurnDownDTO;
import com.ideaswork.scrum.domain.task.Task;
import com.ideaswork.scrum.domain.task.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SprintServiceImpl implements SprintService {


    private SprintRepository sprintRepository;

    private SprintBacklogService sprintBacklogService;

    private BacklogService backlogService;

    private TaskRepository taskRepository;

    public SprintServiceImpl(SprintRepository sprintRepository, SprintBacklogService sprintBacklogService, BacklogService backlogService, TaskRepository taskRepository) {
        this.sprintRepository = sprintRepository;
        this.sprintBacklogService = sprintBacklogService;
        this.backlogService = backlogService;
        this.taskRepository = taskRepository;
    }

    @Override
    public Sprint createSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    @Override
    public Sprint getSprintById(String id) {
        return sprintRepository.findById(id).orElse(null);
    }

    @Override
    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    @Override
    public Sprint updateSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    @Override
    public void deleteSprint(String id) {
        sprintRepository.deleteById(id);
    }

    @Override
    public List<Sprint> getSprintListByProductId(String productId) {
        List<Sprint> byProductId = sprintRepository.findByProductId(productId);
        byProductId.sort(Comparator.comparing(Sprint::getName).reversed());
        return byProductId;
    }

    @Override

    public Sprint createEmptySprint(String productId) {
        synchronized(this) {
            Sprint sprint = new Sprint();
            sprint.setProductId(productId);
            sprint.setId(UUID.randomUUID().toString());
            // 查找productId的sprint数量
            List<Sprint> sprintList = sprintRepository.findByProductId(productId);
            sprint.setName("Sprint " + (sprintList.size() + 1));
            Date date = new Date();
            sprint.setStartDate(date);
            // 2 周后
            date.setTime(date.getTime() + 14 * 24 * 60 * 60 * 1000);
            sprint.setEndDate(date);

            sprint.setGoal("此处填写冲刺目标");
            sprint.setDemoDate(date);
            sprint.setStatus("计划中");
            sprint.setEstimateVelocity(0);
            sprint.setActualVelocity(0);
            sprint.setFocusFactor(75);
            sprint.setDailyStandup("上午 9:00, 会议室 ");
            sprint.setSprintReview("2024/5/12 上午 2：00, 会议室 ");

            return sprintRepository.save(sprint);
        }
    }

    @Override
    public List<Backlog> getBacklogListBySprintId(String sprintId) {
        return sprintBacklogService.getBacklogListBySprintId(sprintId);
    }

    public static List<BurnDownDTO> calculateBurndownChart(List<Task> sprintTasks, Date sprintStartDate, Date sprintEndDate) {

        // 计算总预估工时
        int totalEstimatedHours = sprintTasks.stream()
                .mapToInt(task -> task.getEstimatedHours() != null ? task.getEstimatedHours() : 0)
                .sum();

        // 初始化剩余工时
        int remainingHours = totalEstimatedHours;

        // 创建每日完成工时的映射
        Map<Date, Integer> dailyCompletedWork = new HashMap<>();

        for (Task task : sprintTasks) {
            Date endDate = task.getEndTime();


            // 转化为日期
            if (endDate != null) {
                // 转化为 yyyy-MM-dd
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(endDate);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.set(Calendar.MILLISECOND, 1);
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                endDate = calendar.getTime();
                Integer loggedHours = task.getHours();
                if (loggedHours != null) {
                    dailyCompletedWork.put(endDate, dailyCompletedWork.getOrDefault(endDate, 0) + loggedHours);
                }
            }
        }

        // 初始化燃尽图数据点
        List<BurnDownDTO> burndownDataPoints = new ArrayList<>();

        // 遍历冲刺中的每一天
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(sprintStartDate);

        while (!calendar.getTime().after(sprintEndDate)) {
            Date currentDate = calendar.getTime();
            // 转化为 yyyy-MM-dd
            Calendar currentCalendar = Calendar.getInstance();
            currentCalendar.setTime(currentDate);
            currentCalendar.set(Calendar.HOUR_OF_DAY, 0);
            currentCalendar.set(Calendar.MINUTE, 0);
            currentCalendar.set(Calendar.SECOND, 0);
            currentCalendar.set(Calendar.MILLISECOND, 1);
            // 将日期增加一天
            currentCalendar.add(Calendar.DAY_OF_MONTH, 1);
            currentDate = currentCalendar.getTime();

            // 减去当前日期完成的任务工时
            if (dailyCompletedWork.containsKey(currentDate)) {
                int completedWork = dailyCompletedWork.get(currentDate);
                remainingHours -= completedWork;

                // 确保剩余工时不为负数
                if (remainingHours < 0) {
                    remainingHours = 0;
                }
            }

            // 添加当前日期的数据点
            burndownDataPoints.add(new BurnDownDTO(currentDate, remainingHours));

            // 移动到下一天
            calendar.add(Calendar.DATE, 1);
        }

        return burndownDataPoints;
    }

    @Override
    public List<BurnDownDTO> burnDownChart(String sprintId) {
        Sprint sprint = getSprintById(sprintId);
        List<Task> sprintTasks = taskRepository.findBySprintId(sprintId);
        return calculateBurndownChart(sprintTasks, sprint.getStartDate(), sprint.getEndDate());
    }



    @Override
    public List<SprintVelocityDTO> velocityChart(String productId) {
        List<SprintVelocityDTO> velocityList = new ArrayList<>();
        List<Sprint> sprints = this.getSprintListByProductId(productId);
        List<Task> tasks = taskRepository.findByProductId(productId);
        for (Sprint sprint : sprints) {
            List<Task> sprintTasks = tasks.stream()
                    .filter(task -> task.getSprintId().equals(sprint.getId()))
                    .collect(Collectors.toList());

            int sum = sprintTasks.stream().mapToInt(Task::getPx).sum();
            SprintVelocityDTO velocityDTO = new SprintVelocityDTO();
            velocityDTO.setSprintName(sprint.getName());
            velocityDTO.setCompletedStoryPoints(sum);
            velocityList.add(velocityDTO);
        }
        sprintRepository.saveAll(sprints);

        return velocityList;
    }

    @Override
    public List<SprintWorkloadDTO> workloadChart(String sprintId) {
        List<Task> tasks = taskRepository.findBySprintId(sprintId);
        List<SprintWorkloadDTO> workloadList = new ArrayList<>();
        // 按照 assigner 给任务分组
        Map<String, List<Task>> assignerTasks = tasks.stream().collect(Collectors.groupingBy(Task::getAssigner));
        for (Map.Entry<String, List<Task>> entry : assignerTasks.entrySet()) {
            String assigner = entry.getKey();
            List<Task> assignerTaskList = entry.getValue();
            int sum = assignerTaskList.stream().mapToInt(Task::getPx).sum();
            SprintWorkloadDTO workloadDTO = new SprintWorkloadDTO();
            workloadDTO.setAssigner(assigner);
            workloadDTO.setWorkloadHours(sum);
            workloadList.add(workloadDTO);
        }
        return workloadList;
    }


}
