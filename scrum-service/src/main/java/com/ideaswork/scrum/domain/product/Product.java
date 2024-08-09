package com.ideaswork.scrum.domain.product;


import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "product")
@Data
@Accessors(chain = true)
@ApiModel(value = "Product", description = "Product")
public class Product {
    @Id
    @ApiModelProperty(value = "ID", required = false)
    private String id;

    @ApiModelProperty(value = "产品名", required = true)
    @Column(name = "name")
    private String name;

    @ApiModelProperty(value = "产品描述", required = true)
    @Column(name = "description")
    private String description;

    @ApiModelProperty(value = "产品开始日期", required = true)
    @Column(name = "start_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @ApiModelProperty(value = "产品结束日期", required = true)
    @Column(name = "due_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dueDate;

    @ApiModelProperty(value = "项目经理", required = true)
    @Column(name = "manager")
    private String manager;

    @ApiModelProperty(value = "产品状态", required = true)
    @Column(name = "status")
    private String status;

    @ApiModelProperty(value = "产品负责人id", required = false)
    @Column(name = "product_owner_id")
    private String productOwnerId;

    @ApiModelProperty(value = "产品负责人", required = false)
    @Column(name = "product_owner")
    private String productOwner;

}
