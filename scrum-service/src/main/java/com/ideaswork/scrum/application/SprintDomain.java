package com.ideaswork.scrum.application;

import com.ideaswork.scrum.domain.sprint.Sprint;
import com.ideaswork.scrum.domain.sprint.SprintRepository;
import com.ideaswork.scrum.domain.sprint.SprintService;
import com.ideaswork.scrum.domain.sprint.sprintbacklog.SprintBacklogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class SprintDomain {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private SprintBacklogRepository sprintBacklogRepository;

    @Autowired
    private SprintService sprintService;

    public Sprint startSprint(String sprintId) {
        Sprint sprintById = sprintService.getSprintById(sprintId);
        sprintById.setStatus("进行中");
        // TODO 计算冲刺的完成度
        return sprintService.updateSprint(sprintById);
    }

    public Sprint finishSprint(String sprintId) {
        Sprint sprintById = sprintService.getSprintById(sprintId);
        sprintById.setStatus("完成");
        // TODO 计算冲刺的完成度
        return sprintService.updateSprint(sprintById);
    }

    public Sprint cancelSprint(String sprintId) {
        Sprint sprintById = sprintService.getSprintById(sprintId);
        sprintById.setStatus("取消");
        // TODO 取消的其他动作
        return sprintService.updateSprint(sprintById);
    }

    public List<Sprint> getSprintsByProductId(String productId) {
        return sprintRepository.findByProductId(productId);
    }
}
