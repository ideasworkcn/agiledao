package com.ideaswork.scrum.domain.sprint.sprintuser_del;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "sprint_member")
@IdClass(SprintUserId.class)
@ApiModel(value = "SprintMember", description = "Sprint member entity")
public class SprintUser {

    @Id
    @Column(name = "sprint_id")
    @ApiModelProperty(value = "Sprint id", example = "1")
    private String sprintId;

    @Id
    @Column(name = "member_id")
    @ApiModelProperty(value = "Member id", example = "1")
    private String memberId;

    @Column(name = "available_days")
    @ApiModelProperty(value = "Available days", example = "10")
    private Integer availableDays;

    @Column(name = "involvement")
    @ApiModelProperty(value = "Member involvement", example = "80")
    private Integer involvement;

}
