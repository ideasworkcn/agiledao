package com.ideaswork.scrum.presentation.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel(description = "用户信息")
public class LoginRequest {

    @ApiModelProperty(value = "用户邮箱", example = "zhangsan@example.com")
    private String email;

    @ApiModelProperty(value = "用户密码", example = "123456")
    private String password;
}
