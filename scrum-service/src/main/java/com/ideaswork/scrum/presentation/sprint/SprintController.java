package com.ideaswork.scrum.presentation.sprint;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.sprint.Sprint;
import com.ideaswork.scrum.domain.sprint.SprintService;
import com.ideaswork.scrum.domain.sprint.SprintVelocityDTO;
import com.ideaswork.scrum.domain.sprint.SprintWorkloadDTO;
import com.ideaswork.scrum.domain.sprint.sprintbacklog.SprintBacklog;
import com.ideaswork.scrum.domain.sprint.sprintbacklog.SprintBacklogService;
import com.ideaswork.scrum.domain.task.BurnDownDTO;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/sprint")
@CrossOrigin
@ApiOperation(value = "sprint", notes = "sprint")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @Autowired
    private UserService userService;

    @Autowired
    private SprintBacklogService sprintBacklogService;

    // 获取冲刺列表
    @GetMapping ("/sprintList/{productId}")
    @ApiOperation(value = "get sprint list", notes = "get sprint list")
    public ResponseEntity<?> getSprintListByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(sprintService.getSprintListByProductId(productId));
    }

    // 添加冲刺
    @PostMapping("/addSprint")
    @ApiOperation(value = "add sprint", notes = "add sprint")
    public ResponseEntity<?> addSprint(@RequestBody Sprint sprint) {
        Sprint sprint1 = sprintService.createSprint(sprint);
        return ResponseEntity.ok(sprint1);
    }

    // 添加冲刺
    @PostMapping("/addSprint/{productId}")
    @ApiOperation(value = "add sprint", notes = "add sprint")
    public ResponseEntity<?> addSprintEmpaty(@PathVariable String productId) {
        Sprint sprint1 = sprintService.createEmptySprint(productId);
        return ResponseEntity.ok(sprint1);
    }

    // 获取冲刺
    @GetMapping("/getSprint/{id}")
    @ApiOperation(value = "get sprint", notes = "get sprint")
    public ResponseEntity<?> getSprintById(@PathVariable String id) {
        Sprint sprint = sprintService.getSprintById(id);
        return ResponseEntity.ok(sprint);
    }

    // 修改冲刺
    @PutMapping("/updateSprint")
    @ApiOperation(value = "update sprint", notes = "update sprint")
    public ResponseEntity<?> updateSprint(@RequestBody Sprint sprint) {
        Sprint sprint1 = sprintService.updateSprint(sprint);
        return ResponseEntity.ok(sprint1);
    }

    // 删除冲刺
    @DeleteMapping("/deleteSprint/{id}")
    @ApiOperation(value = "delete sprint", notes = "delete sprint")
    public ResponseEntity<?> deleteSprint(@PathVariable String id, HttpServletRequest request) {
        // 从 token 中获取用户信息
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())) {
            sprintService.deleteSprint(id);
        } else {
            return ResponseEntity.badRequest().body("无权限");
        }
        return ResponseEntity.ok("删除成功");
    }


    // 获取 sprint 的 backlogList
    @GetMapping("/getBacklogList/{sprintId}")
    @ApiOperation(value = "get backlog list", notes = "get backlog list")
    public ResponseEntity<?> getBacklogListBySprintId(@PathVariable String sprintId) {
        List<Backlog> backlogListBySprintId = sprintService.getBacklogListBySprintId(sprintId);
        return ResponseEntity.ok(backlogListBySprintId);
    }

    // 移除sprint中的backlog
    @DeleteMapping("/removeSprintBacklog/{sprintId}/{backlogId}")
    @ApiOperation(value = "remove backlog", notes = "remove backlog")
    public ResponseEntity<?> removeBacklogFromSprint(@PathVariable String sprintId,@PathVariable String backlogId) {
        sprintBacklogService.deleteSprintBacklog(sprintId,backlogId);
        return ResponseEntity.ok("移除成功");
    }

    // 添加sprint中的backlog
    @PostMapping("/addSprintBacklog/{sprintId}/{backlogId}")
    @ApiOperation(value = "add backlog", notes = "add backlog")
    @Transactional
    public ResponseEntity<?> addBacklogToSprint(@PathVariable String sprintId, @PathVariable String backlogId) {
        SprintBacklog sprintBacklog = new SprintBacklog();
        sprintBacklog.setSprintId(sprintId);
        sprintBacklog.setBacklogId(backlogId);
        Boolean hadBacklog = sprintBacklogService.checkSprintHasBacklog(sprintId,backlogId);
        if (!hadBacklog){
            sprintBacklogService.createSprintBacklog(sprintBacklog);
        }

        return ResponseEntity.ok("添加成功");
    }


    // 根据sprint计算燃尽图
    @GetMapping("/burnDownChart/{sprintId}")
    public ResponseEntity<List<BurnDownDTO>> burnDownChart(@PathVariable String sprintId) {
        List<BurnDownDTO> taskHours = sprintService.burnDownChart(sprintId);
        return ResponseEntity.ok(taskHours);
    }

    // 根据sprint计算 velocity chart 速度图
    @GetMapping("/velocityChart/{productId}")
    public ResponseEntity<List<SprintVelocityDTO>> velocityChart(@PathVariable String productId) {
        List<SprintVelocityDTO> taskHours = sprintService.velocityChart(productId);
        return ResponseEntity.ok(taskHours);
    }

    // 根据sprint计算workloadChart 工作量图
    @GetMapping("/workloadChart/{sprintId}")
    public ResponseEntity<List<SprintWorkloadDTO>> workloadChart(@PathVariable String sprintId) {
        List<SprintWorkloadDTO> taskHours = sprintService.workloadChart(sprintId);
        return ResponseEntity.ok(taskHours);
    }


}
