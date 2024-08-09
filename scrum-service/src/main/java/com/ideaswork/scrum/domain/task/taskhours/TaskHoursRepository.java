package com.ideaswork.scrum.domain.task.taskhours;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TaskHoursRepository extends JpaRepository<TaskHours, String> {
    List<TaskHours> findBySprintId(String sprintId);

    List<TaskHours> findByMemberId(String memberId);

    List<TaskHours> findByTaskIdOrderByCreateTime(String taskId);
}
