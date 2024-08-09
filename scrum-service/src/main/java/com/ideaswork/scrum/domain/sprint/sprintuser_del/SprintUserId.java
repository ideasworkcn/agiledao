package com.ideaswork.scrum.domain.sprint.sprintuser_del;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprintUserId  implements Serializable {
    private String sprintId;

    private String memberId;
}
