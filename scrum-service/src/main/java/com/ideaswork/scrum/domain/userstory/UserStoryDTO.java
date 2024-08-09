package com.ideaswork.scrum.domain.userstory;

import com.ideaswork.scrum.domain.userstory.epic.Epic;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Transient;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStoryDTO {
    @Transient
    @ApiModelProperty(value = "Epics")
    private List<Epic> Epics;

}