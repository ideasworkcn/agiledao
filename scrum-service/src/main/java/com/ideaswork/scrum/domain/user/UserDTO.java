package com.ideaswork.scrum.domain.user;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class UserDTO extends User{
    @ApiModelProperty(value = "token", example = "xxx.xxx.xxx")
    private String token;

    @ApiModelProperty(value = "token有效时间", example = "0")
    private Date tokenDueDate;

}
