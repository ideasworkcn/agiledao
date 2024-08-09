package com.ideaswork.scrum.domain.sprint;

import lombok.Data;

@Data
public class SprintVelocityDTO {
    private String sprintName;
    private Integer completedStoryPoints;
}