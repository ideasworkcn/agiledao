package com.ideaswork.scrum.domain.userstory.feature;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.userstory.epic.Epic;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "feature")
@Data
@ApiModel(value = "Feature", description = "Feature")
public class Feature {
    @Id
    private String id;

    @Column(name = "number")
    @ApiModelProperty(value = "编号")
    private String number;

    @Column(name = "product_id")
    @ApiModelProperty(value = "产品ID")
    private String productId;

    @Column(name = "epic_id")
    private String epicId;

    @Column(name = "content")
    @ApiModelProperty(value = "特性描述")
    private String content;

    @Column(name = "px")
    @ApiModelProperty(value = "px")
    private int px;

    @Transient
    @ApiModelProperty(value = "Backlogs")
    private List<Backlog> backlogs;

}
