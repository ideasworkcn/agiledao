package com.ideaswork.scrum.domain.task;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ideaswork.scrum.domain.task.taskhours.TaskHours;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "task")
public class Task {

    @Id
    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "名称")
    private String name;

    @ApiModelProperty(value = "描述")
    private String description;

    @ApiModelProperty(value = "产品id")
    @Column(name = "product_id")
    private String productId;

    @ApiModelProperty(value = "产品待办ID")
    @Column(name = "product_backlog_id")
    private String productBacklogId;

    @ApiModelProperty(value = "sprint ID")
    @Column(name = "sprint_id")
    private String sprintId;

    @ApiModelProperty(value = "成员ID")
    @Column(name = "member_id")
    private String memberId;

    @ApiModelProperty(value = "负责人")
    @Column(name="assigner")
    private String assigner;

    @ApiModelProperty(value = "排序")
    private Integer px;

    // 创建时间，开始时间，完成时间，manday任务量
    @ApiModelProperty("预估时间")
    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    @ApiModelProperty("已用时间")
    private Integer hours;

    @ApiModelProperty("开始时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date startTime;

    @ApiModelProperty("完成时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date endTime;

    @ApiModelProperty("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;


    @ApiModelProperty(value = "状态:todo inprogress  done ")
    private String status;

    @Transient
    private List<TaskHours> taskHoursList;
}
