package com.ideaswork.scrum.domain.sprint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprintWorkloadDTO {
    private String assigner;
    private Integer workloadHours;
}
