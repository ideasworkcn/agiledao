package com.ideaswork.scrum.domain.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findBySprintId(String sprintId);

    int countByStatusAndSprintIdAndProductBacklogId(String status, String sprintId, String productBacklogId);



    List<Task> findBySprintIdAndProductBacklogIdOrderByStatus(String sprintId, String backlogId);

    List<Task> findByProductId(String productId);
}
