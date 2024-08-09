package com.ideaswork.scrum.domain.backlog;

import com.ideaswork.scrum.domain.task.Task;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "backlog")
@Data
@ApiModel(value = "Backlog", description = "Backlog")
public class Backlog {
    @Id
    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "编号")
    @Column(name = "number")
    private String number;

    @Column(name = "product_id")
    @ApiModelProperty(value = "产品ID")
    private String productId;

    @Column(name = "feature_id")
    @ApiModelProperty(value = "特性id")
    private String featureId;

    @Column(name = "components")
    @ApiModelProperty(value = "组件")
    private String components;

    @Column(name = "name")
    @ApiModelProperty(value = "名称")
    private String name;

    @Column(name = "importance")
    @ApiModelProperty(value = "重要性")
    private Integer importance;

    @Column(name = "initial_estimate")
    @ApiModelProperty(value = "初始估计")
    private Integer initialEstimate;

    @Column(name = "how_to_demo")
    @ApiModelProperty(value = "如何测试演示")
    private String howToDemo;

    @Column(name = "notes")
    @ApiModelProperty(value = "备注")
    private String notes;

    @Column(name = "px")
    @ApiModelProperty(value = "px")
    private int px;

    @Column(name = "track")
    @ApiModelProperty(value = "分类：feature、bug、")
    private String track;

    @Column(name = "fzr")
    @ApiModelProperty(value = "负责人")
    private String fzr;

    @Column(name = "status")
    @ApiModelProperty(value = "状态")
    private String status;


//    @Column(name = "bug_tracking_id")
//    @ApiModelProperty(value = "Bug跟踪ID")
//    private String bugTrackingId;

    //    @Column(name = "sprint_id")
//    @ApiModelProperty(value = "冲刺ID")
//    private String sprintId;

    @Transient
    private List<Task> taskList;

}
