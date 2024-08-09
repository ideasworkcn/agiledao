package com.ideaswork.scrum.presentation.user;

import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/user")
@CrossOrigin
@ApiOperation(value = "user", notes = "user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/listUser")
    @ApiOperation(value = "get user list", notes = "get user list")
    public List<User> list() {
        return userService.getAllUsers().stream().peek(user -> user.setPassword(null)).collect(Collectors.toList());
    }

    @PostMapping("/createUser")
    @ApiOperation(value = "create user", notes = "create user")
    public ResponseEntity create(@RequestBody User user) {
        // 检查用户是否存在
        User userByEmail = userService.getUserByEmail(user.getEmail());
        if (userByEmail != null) {
            return ResponseEntity.badRequest().body("用户已存在");
        }
        user.setId(UUID.randomUUID().toString());
        // 设置初始密码为 bilibli:ideaswork
        String password = "bilibli:ideaswork";
        // 对新密码进行加密
        Digester md5 = new Digester(DigestAlgorithm.SHA1);
        String passEncode = md5.digestHex(password + user.getId());
        user.setPassword(passEncode);
        System.out.println("user = " + user);
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @PutMapping("/updateUser")
    @ApiOperation(value = "update user", notes = "update user")
    public User update(@RequestBody User user) {
        String userId = user.getId();
        User userById = userService.getUserById(userId);
        userById.setEmail(user.getEmail());
        userById.setName(user.getName());
        userById.setRole(user.getRole());
        return userService.updateUser(userById);
    }

    @DeleteMapping("/deleteUser/{id}")
    @ApiOperation(value = "delete user", notes = "delete user")
    public ResponseEntity<?> delete(@PathVariable String id,HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())) {
            userService.deleteUser(id);
            System.out.println("delete user id = " + id);
        } else {
            return ResponseEntity.badRequest().body("无权限删除");
        }
        return ResponseEntity.ok().build();

    }

    @GetMapping("/getUserById")
    @ApiOperation(value = "get user by id", notes = "get user by id")
    public User getById(String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/login")
    @ApiOperation(value = "login", notes = "login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) {
        // 检查用户表是否为空，如果为空则进行初始化
        if (userService.isUserTableEmpty()) {
            User initialUser = new User();
            initialUser.setId("a8b9d4dd-702f-477d-b986-c2be02dac959");
            initialUser.setCode("ssf5");
            initialUser.setEmail("123@qq.com");
            initialUser.setName("William");
            initialUser.setPassword("43f0e138d78c676075951250d35675eea2121317");
            initialUser.setRole("Scrum Master");
            userService.saveUser(initialUser);
        }

        // 检查用户是否存在
        User userDb = userService.getUserByEmail(loginRequest.getEmail());
        System.out.println("userDb = " + userDb);
        if (userDb == null) {
            return ResponseEntity.badRequest().body("账号或密码错误");
        }
        String token = userService.login(userDb, loginRequest.getEmail(), loginRequest.getPassword());
        Map<String, String> ret = Map.of("token", token, "username", userDb.getName(), "email", userDb.getEmail(), "id", userDb.getId(), "role", userDb.getRole());
        if (token != null) {
            return ResponseEntity.ok(ret);
        } else {
            return ResponseEntity.badRequest().body("账号或密码错误");
        }
    }

    @GetMapping("/refreshToken")
    @ApiOperation(value = "refresh token", notes = "refresh token")
    public ResponseEntity refreshToken(String token) {
        // 验证token是否有效
        if (!userService.checkToken(token)) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        String newToken = userService.refreshToken(token);
        if (newToken != null) {
            return ResponseEntity.ok(newToken);
        } else {
            return ResponseEntity.badRequest().body("无效的token");
        }
    }

//    modifyPassword
    @PutMapping("/modifyPassword")
    @ApiOperation(value = "modify password", notes = "modify password")
    public ResponseEntity modifyPassword(@RequestBody PasswordModifyDTO passwordModifyDTO) {
        String email = passwordModifyDTO.getEmail();
        String oldPassword = passwordModifyDTO.getOldPassword();
        String newPassword = passwordModifyDTO.getNewPassword();
        // 检查用户是否存在
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("账号或密码错误");
        }
        // 验证旧密码是否正确
        String token = userService.login(user,email, oldPassword);
        if (token == null) {
            return ResponseEntity.badRequest().body("账号或密码错误");
        }
        token = userService.modifyPassword(email, oldPassword, newPassword);
        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.badRequest().body("账号或密码错误");
        }
    }

    // resetPassword
    @PutMapping("/resetPassword/{userId}")
    @ApiOperation(value = "reset password", notes = "reset password")
    public ResponseEntity resetPassword(@PathVariable String userId , HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
//        System.out.println("token = " + token);
        User userByToken = userService.getUserByToken(token);
//        System.out.println("userByToken = " + userByToken);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");

        }else if ("Scrum Master".equals(userByToken.getRole())) {
            // 检查用户是否存在
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.badRequest().body("用户不存在");
            }
            userService.resetPassword("bilibli:ideaswork", user);
        }else {
            return ResponseEntity.badRequest().body("无权限操作");
        }
        return ResponseEntity.ok().build();
    }




}
