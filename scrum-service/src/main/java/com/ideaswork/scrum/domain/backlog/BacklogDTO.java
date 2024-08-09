package com.ideaswork.scrum.domain.backlog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BacklogDTO extends Backlog{
    private String productName;
//    private String sprintName;

}
