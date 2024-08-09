package com.ideaswork.scrum.domain.backlog;

import java.util.List;

public interface BacklogService {
    // Create
    public Backlog save(Backlog backlog);

    // Read
    public Backlog findById(String id);
    public List<Backlog> findAll();

    // Update
    public Backlog update(Backlog backlog);


    // All By ProductId
    List<Backlog> findAllByProductId(String productId);

    // Delete
    void deleteByBacklogId(String backlogId);

    List<Backlog> findByProductId(String productId);

    List<Backlog> findByFeatureId(String id);

    List<Backlog> findByProductIdOrderByPxAsc(String productId);

    void updateBacklogPx(List<Backlog> backlogs);

    List<Backlog> findByIds(List<String> backlogIds);

}
