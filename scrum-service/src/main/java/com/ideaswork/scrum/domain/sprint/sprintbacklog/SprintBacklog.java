package com.ideaswork.scrum.domain.sprint.sprintbacklog;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "sprint_backlog")
@ApiModel(value = "SprintBacklog", description = "冲刺待办项")
public class SprintBacklog {

    @Id
    @ApiModelProperty(value = "id", required = true)
    @Column(name = "id")
    private String id;

    @ApiModelProperty(value = "冲刺ID", required = true)
    @Column(name = "sprint_id")
    private String sprintId;

    @ApiModelProperty(value = "产品待办ID", required = true)
    @Column(name = "backlog_id")
    private String backlogId;
//
//    @ApiModelProperty(value = "产品待办状态", required = true)
//    @Column(name = "product_backlog_status")
//    private Integer productBacklogStatus;

}
