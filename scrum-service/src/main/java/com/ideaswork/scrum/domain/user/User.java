package com.ideaswork.scrum.domain.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "user")
@ApiModel(description = "用户信息")
public class User {
    @Id
    @ApiModelProperty(value = "用户ID", example = "1")
    private String id;

    @ApiModelProperty(value = "用户名", example = "张三")
    private String name;

    @ApiModelProperty(value = "用户邮箱", example = "zhangsan@example.com")
    private String email;

    @ApiModelProperty(value = "用户密码", example = "123456")
    private String password;

    @ApiModelProperty(value = "验证码", example = "ssf5")
    private String code;

    @ApiModelProperty(value = "用户角色", example = "开发者")
    private String role;

}
