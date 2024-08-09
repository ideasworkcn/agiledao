package com.ideaswork.scrum.domain.userstory.epic;

import com.ideaswork.scrum.domain.userstory.feature.Feature;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "epic")
@Data
@ApiModel(value = "Epic", description = "Epic")
public class Epic {
    @Id
    private String id;

    @Column(name = "number")
    @ApiModelProperty(value = "编号")
    private String number;

    @Column(name = "product_id")
    @ApiModelProperty(value = "产品ID")
    private String productId;

    @Column(name = "name")
    @ApiModelProperty(value = "Epic name")
    private String name;

    @Column(name = "px")
    @ApiModelProperty(value = "px")
    private int px;


    @Transient
    @ApiModelProperty(value = "Features")
    private List<Feature> features;
}
