package com.ideaswork.scrum.domain.backlog;

import com.ideaswork.scrum.infrastructure.utils.IdGenerator;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BacklogServiceImpl implements BacklogService {


    private final BacklogRepository backlogRepository;

    public BacklogServiceImpl(BacklogRepository backlogRepository) {
        this.backlogRepository = backlogRepository;
    }

    // Create
    public Backlog save(Backlog backlog) {
        String productId = backlog.getProductId();
        Integer number = backlogRepository.countByProductId(productId);
        String s = IdGenerator.generateNextBacklog(number);
        backlog.setNumber(s);
        // 获取当前最大的px
        String featureId = backlog.getFeatureId();
        Integer maxPx = backlogRepository.findMaxPx(featureId);
        if (maxPx == null) {
            maxPx = 0;
        }
        backlog.setPx(maxPx + 1);
        backlog.setStatus("计划中");
        return backlogRepository.save(backlog);
    }

    // Read
    public Backlog findById(String id) {
        return backlogRepository.findById(id).orElse(null);
    }

    public List<Backlog> findAll() {
        List<Backlog> all = backlogRepository.findAll();
        // 按照 featureId 分组后根据px排序
        all.sort((o1, o2) -> {
            if (o1.getFeatureId().equals(o2.getFeatureId())) {
                return o1.getPx() - o2.getPx();
            }
            return 0;
        });
        return all;
    }

    // Update
    public Backlog update(Backlog backlog) {
        return backlogRepository.save(backlog);
    }

    @Override
    public List<Backlog> findAllByProductId(String productId) {
        List<Backlog> byProductId = backlogRepository.findByProductIdOrderByFeatureId(productId);
        // 按照 featureId 分组后根据px排序
        byProductId.sort((o1, o2) -> {
            if (o1.getFeatureId().equals(o2.getFeatureId())) {
                return o1.getPx() - o2.getPx();
            }
            return 0;
        });
        return byProductId;
    }

    @Override
    public void deleteByBacklogId(String backlogId) {
        backlogRepository.deleteById(backlogId);
    }

    @Override
    public List<Backlog> findByProductId(String productId) {
        return backlogRepository.findByProductId(productId);
    }

    @Override
    public List<Backlog> findByFeatureId(String id) {
        return backlogRepository.findByFeatureId(id);
    }

    @Override
    public List<Backlog> findByProductIdOrderByPxAsc(String productId) {
        return backlogRepository.findByProductIdOrderByPxAsc(productId);
    }

    @Override
    public void updateBacklogPx(List<Backlog> backlogs) {
        for (int i = 0; i < backlogs.size(); i++) {
            Backlog backlog = backlogs.get(i);
            backlogRepository.save(backlog);
        }
    }

    @Override
    public List<Backlog> findByIds(List<String> backlogIds) {
        return backlogRepository.findByIdIn(backlogIds);
    }


}
