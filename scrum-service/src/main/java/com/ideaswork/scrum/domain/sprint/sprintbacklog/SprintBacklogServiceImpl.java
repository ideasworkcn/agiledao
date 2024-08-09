package com.ideaswork.scrum.domain.sprint.sprintbacklog;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SprintBacklogServiceImpl implements SprintBacklogService {
    
    private final SprintBacklogRepository sprintBacklogRepository;
    private final BacklogService backlogService;

    public SprintBacklogServiceImpl(SprintBacklogRepository sprintBacklogRepository, BacklogService backlogService) {
        this.sprintBacklogRepository = sprintBacklogRepository;
        this.backlogService = backlogService;
    }

    @Override
    @Transactional
    public SprintBacklog createSprintBacklog(SprintBacklog sprintBacklog) {
        String backlogId = sprintBacklog.getBacklogId();
        Backlog byId = backlogService.findById(backlogId);
        byId.setStatus("进行中");
        backlogService.update(byId);
        sprintBacklog.setId(UUID.randomUUID().toString());
        return sprintBacklogRepository.save(sprintBacklog);
    }

    @Override
    public SprintBacklog readSprintBacklog(String id) {
        return sprintBacklogRepository.findById(id).orElse(null);
    }

    @Override
    public SprintBacklog updateSprintBacklog(SprintBacklog sprintBacklog) {
        return sprintBacklogRepository.save(sprintBacklog);
    }

    @Override
    public void deleteSprintBacklog(String sprintId,String backlogId) {

        List<SprintBacklog> sprintBacklogList =  sprintBacklogRepository.findBySprintIdAndBacklogId(sprintId,backlogId);
        if (sprintBacklogList.size()>0) {
            SprintBacklog sprintBacklog = sprintBacklogList.get(0);
            // 查找当前 backlog 的所有 SprintBacklog
            int backlogSprintNums = sprintBacklogRepository.countByBacklogId(sprintBacklog.getBacklogId());
            System.out.println(backlogSprintNums);
            if (backlogSprintNums == 1) {
                Backlog byId1 = backlogService.findById(sprintBacklog.getBacklogId());
                byId1.setStatus("计划中");
                backlogService.update(byId1);
            }

            sprintBacklogRepository.deleteById(sprintBacklog.getId());

        }
    }

    @Override
    public List<Backlog> getBacklogListBySprintId(String sprintId) {
        List<SprintBacklog> bySprintId = sprintBacklogRepository.findBySprintId(sprintId);
        List<String> backlogIds = bySprintId.stream().map(SprintBacklog::getBacklogId).collect(Collectors.toList());
        List<Backlog> backlogs = new ArrayList<>();
        if (!backlogIds.isEmpty()) {
            backlogs = backlogService.findByIds(backlogIds);
        }
        return backlogs;
    }

    @Override
    public Boolean checkSprintHasBacklog(String sprintId, String backlogId) {

        int num = sprintBacklogRepository.countBySprintIdAndBacklogId(sprintId,backlogId);
        if (num>=1){
            return true;
        }else{
            return false;
        }
    }
}
