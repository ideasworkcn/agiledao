package com.ideaswork.scrum.domain.product;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ideaswork.scrum.domain.product.Product;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Id;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO  {
    @ApiModelProperty(value = "ID", required = false)
    private String id;

    @ApiModelProperty(value = "产品名", required = true)
    private String name;

    @ApiModelProperty(value = "产品描述", required = true)
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
    private String productOwnerId;

    @ApiModelProperty(value = "owner", required = false)
    private String ownerName;

}
