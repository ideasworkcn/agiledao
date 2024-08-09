package com.ideaswork.scrum.presentation.sprint;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.sprint.SprintService;
import com.ideaswork.scrum.domain.task.BurnDownDTO;
import com.ideaswork.scrum.domain.task.Task;
import com.ideaswork.scrum.domain.task.TaskService;
import com.ideaswork.scrum.domain.task.taskhours.TaskHours;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import com.ideaswork.scrum.infrastructure.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/v1/task")
public class TaskController {
    @Autowired
    private TaskService sprintTaskService;

    @Autowired
    private SprintService sprintService;

    @Autowired
    private UserService userService;

    // 获取某个 Sprint 的所有 Backlog 和任务列表
    @GetMapping("/getSprintBacklogsAndTasks/{sprintId}")
    public ResponseEntity<List<Backlog>> getSprintBacklogsAndTasks(@PathVariable String sprintId) {
        // 获取当前sprint的 backlogList
        List<Backlog> backlogList = sprintService.getBacklogListBySprintId(sprintId);
        // 获取当前sprint的所有 task
        List<Task> tasks = sprintTaskService.getTaskListBySprintId(sprintId);
        // 拼接 backlog 与 task
        backlogList.forEach(backlog -> {
            List<Task> backlogTasks = tasks.stream()
                    .filter(task -> task.getProductBacklogId().equals(backlog.getId()))
                    .collect(Collectors.toList());
            backlog.setTaskList(backlogTasks);
        });
        return ResponseEntity.ok(backlogList);
    }

    // 获取某个 Sprint 的 Backlog 的列表
    @GetMapping("/backlogListBySprint/{sprintId}/{backlogId}")
    public ResponseEntity<Backlog> getBacklogBySprintIdAndBacklogId(@PathVariable String sprintId, @PathVariable String backlogId) {
        Backlog backlog = sprintTaskService.getBacklogWithTaskList(sprintId, backlogId);
        return ResponseEntity.ok(backlog);
    }


    // 为某个 Sprint 的 Backlog 添加任务
    @PostMapping("/addTaskToSprint")
    public ResponseEntity<Task> addTaskToSprint(@RequestBody Task task) {
        System.out.println("task: " + task);
         task = sprintTaskService.createTask(task);
        return ResponseEntity.ok(task);
    }

    // 获取某个 Sprint 的任务列表
    @GetMapping("/taskListBySprint/{sprintId}")
    public ResponseEntity<List<Task>> getTaskListBySprintId(@PathVariable String sprintId) {
        List<Task> tasks = sprintTaskService.getTaskListBySprintId(sprintId);
        return ResponseEntity.ok(tasks);
    }

    // 修改任务
    @PutMapping("/modifyTask")
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {
        Task updatedTask = sprintTaskService.updateTask(task);
        return ResponseEntity.ok(updatedTask);
    }

    // 删除任务
    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        System.out.println("token = " + token);
        User userByToken = userService.getUserByToken(token);
        System.out.println("userByToken = " + userByToken);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())) {
            sprintTaskService.deleteTask(id);
        } else {
            Task task = sprintTaskService.getTaskById(id);
            if (!task.getMemberId().equals(userByToken.getId())) {
                throw new UnauthorizedException("无权限删除任务");
            }
            sprintTaskService.deleteTask(id);
        }
        return ResponseEntity.ok().build();
    }

    // 获取任务详情
    @GetMapping("/getTaskDetail/{id}")
    public ResponseEntity<Task> getTaskDetail(@PathVariable String id) {
        Task task = sprintTaskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    // 排序任务列表(根据任务索引)
    @PutMapping("/updateTaskListPx")
    public ResponseEntity<List<Task>> sortTaskList(@RequestBody List<Task> taskList) {
        List<Task> sortedTaskList = sprintTaskService.sortTaskList(taskList);
        return ResponseEntity.ok(sortedTaskList);
    }

    // 修改工时信息
    @PutMapping("/updateTaskHours")
    public ResponseEntity<?> updateTaskHours(@RequestBody List<TaskHours> taskHoursList, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        System.out.println("token = " + token);
        User userByToken = userService.getUserByToken(token);
        System.out.println("userByToken = " + userByToken);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())) {
            List<TaskHours> taskHours = sprintTaskService.updateTaskHours(taskHoursList);
            return ResponseEntity.ok(taskHours);
        } else {
            if (taskHoursList.stream().anyMatch(taskHours -> !taskHours.getMemberId().equals(userByToken.getId()))) {
                throw new UnauthorizedException("无权限修改工时");
            }else{
                List<TaskHours> taskHours = sprintTaskService.updateTaskHours(taskHoursList);
                return ResponseEntity.ok(taskHours);
            }
        }

    }



}
