package com.ideaswork.scrum.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserService{
    User getUserById(String id);
    User getUserByEmail(String email);
    User getUserByName(String name);
    User saveUser(User user);
    User updateUser(User user);
    void deleteUser(String id);
    List<User> getAllUsers();

    String login(User userDb,String email, String password);

    boolean checkToken(String token);

    String refreshToken(String token);

    String modifyPassword(String email, String oldPassword, String newPassword);

    User getLoginUser();

    void resetPassword(String s, User user);
    String  getUserIdByToken(String token);
    User getUserByToken(String token);

    boolean isUserTableEmpty();
}
