package com.ideaswork.scrum.domain.task.taskhours;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "task_hours")
public class TaskHours {

    @Id
    @ApiModelProperty(value = "ID")
    private String id;

    @ApiModelProperty(value = "说明")
    private String note;

    @ApiModelProperty(value = "product ID")
    @Column(name = "product_id")
    private String productId;

    @ApiModelProperty(value = "sprint ID")
    @Column(name = "sprint_id")
    private String sprintId;

    @ApiModelProperty(value = "task ID")
    @Column(name = "task_id")
    private String taskId;

    @ApiModelProperty(value = "成员ID")
    @Column(name = "member_id")
    private String memberId;

    @ApiModelProperty(value = "负责人")
    @Column(name="assigner")
    private String assigner;

    @ApiModelProperty(value = "创建时间")
    @Column(name="create_time")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date createTime;

    // 创建时间，开始时间，完成时间，manday任务量
    @ApiModelProperty("用时")
    private Integer hours;

}
