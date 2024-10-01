package com.ideaswork.scrum.domain.sprint;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "sprint")
@ApiModel(description = "Sprint")
public class Sprint {

    @Id
    @ApiModelProperty(value = "ID", example = "1")
    private String id;

    @Column(name = "product_id")
    @ApiModelProperty(value = "产品ID", example = "1")
    private String productId;

    @Column(name = "name")
    @ApiModelProperty(value = "名称", example = "Sprint 1")
    private String name;

    @Column(name = "goal")
    @ApiModelProperty(value = "目标", example = "完成用户故事")
    private String goal;

    @Column(name = "start_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "开始日期", example = "2022-01-01")
    private Date startDate;

    @Column(name = "end_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "结束日期", example = "2022-01-31")
    private Date endDate;

    @Column(name = "demo_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @ApiModelProperty(value = "演示日期", example = "2022-02-01")
    private Date demoDate;

    @Column(name = "estimate_velocity")
    @ApiModelProperty(value = "估计生产力", example = "100")
    private Integer estimateVelocity;

    @Column(name = "focus_factor")
    @ApiModelProperty(value = "投入程度百分比", example = "70")
    private Integer focusFactor;

    @Column(name = "actual_velocity")
    @ApiModelProperty(value = "实际生产力", example = "80")
    private Integer actualVelocity;

    @Column(name = "daily_standup")
    @ApiModelProperty(value = "每日站会", example = "9:00 AM, Conference Room A")
    private String dailyStandup;

    @Column(name = "sprint_review")
    @ApiModelProperty(value = "冲刺评审", example = "2024/5/12 2:00 PM, Auditorium")
    private String sprintReview;

    @Column(name = "status")
    @ApiModelProperty(value = "状态")
    private String status;

    public static String getStatusString(Integer status) {
        switch (status) {
            case 0:
                return "未开始";
            case 1:
                return "进行中";
            case 2:
                return "已完成";
            case 3:
                return "已取消";
            default:
                return "计划中";
        }
    }
}
