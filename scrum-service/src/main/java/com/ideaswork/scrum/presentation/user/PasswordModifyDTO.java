package com.ideaswork.scrum.presentation.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordModifyDTO {
    private String email;
    private  String oldPassword;
    private String newPassword;
}
