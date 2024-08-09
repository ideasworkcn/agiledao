package com.ideaswork.scrum.domain.user;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTPayload;
import cn.hutool.jwt.JWTUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByName(String name) {
        return userRepository.findByName(name);
    }

    public User saveUser(User user) {

        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public String login(User userDb,String email, String password) {
        Digester md5 = new Digester(DigestAlgorithm.SHA1);
        String passEncode = md5.digestHex(password + userDb.getId());
        if (userDb.getPassword().equals(passEncode)) {
            return generateToken(userDb.getId(), userDb.getName(), userDb.getRole());
        } else {
            return null;
        }
    }

    private String generateToken(String userId, String name, String role) {
        byte[] bytes = {1, 2, 3, 4};//定义byte数组的原因是因为JWTUtil.createToken(map,byte[])需要两个参数，其中一个为byte[]
        DateTime now = DateTime.now();

        DateTime dateTime = now.offsetNew(DateField.DAY_OF_YEAR, 7);//jwt的过期时间  当前时间+7天;

        HashMap<String, Object> map = new HashMap<>();
        //签发时间
        map.put(JWTPayload.ISSUED_AT, now);
        //过期时间
        map.put(JWTPayload.EXPIRES_AT, dateTime);
        //生效时间
        map.put(JWTPayload.NOT_BEFORE, now);

        map.put("userId", userId);
        map.put("name", name);
        map.put("role", role);
        return JWTUtil.createToken(map, bytes);
    }

    // token 获取 userId
    @Override
    public String getUserIdByToken(String token) {
        JWT jwt = JWTUtil.parseToken(token);
        JWTPayload payload = jwt.getPayload();
        return payload.getClaim("userId").toString();
    }

    @Override
    public User getUserByToken(String token) {
        String userId = getUserIdByToken(token);
        return getUserById(userId);
    }

    @Override
    public boolean isUserTableEmpty() {
        return userRepository.count() == 0;
    }

    @Override
    public boolean checkToken(String token) {
        boolean verify = JWTUtil.verify(token, new byte[]{1, 2, 3, 4});
        return verify;
    }

    @Override
    public String refreshToken(String token) {
        // 获取token中的payload
        JWT jwt = JWTUtil.parseToken(token);
        JWTPayload payload = jwt.getPayload();
        // 获取token中的userId
        String userId = payload.getClaim("userId").toString();
        // 获取token中的name
        String name = payload.getClaim("name").toString();
        // 获取token中的role
        String role = payload.getClaim("role").toString();
        // 生成新的token
        return generateToken(userId, name, role);
    }

    @Override
    public String modifyPassword(String email, String oldPassword, String newPassword) {
        // 根据email获取用户
        User userByEmail = userRepository.findByEmail(email);
        // 对新密码进行加密
        Digester md5 = new Digester(DigestAlgorithm.SHA1);
        String passEncode = md5.digestHex(newPassword + userByEmail.getId());
        // 将新密码赋值给用户
        userByEmail.setPassword(passEncode);
        // 保存用户
        userRepository.save(userByEmail);
        // 生成新的token
        return generateToken(userByEmail.getId(), userByEmail.getName(), userByEmail.getRole());
    }

    @Override
    public User getLoginUser() {
        // 获取当前请求的request
         HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 获取请求中的token
        String token = request.getHeader("Authorization");
//        System.out.println(token);
        // token 去掉 Bearer 前缀
        token = token.substring(7);
        // 获取token中的payload
        JWT jwt = JWTUtil.parseToken(token);
        JWTPayload payload = jwt.getPayload();
        // 获取token中的userId
        String userId = payload.getClaim("userId").toString();
        System.out.println(userId);
        // 根据userId获取用户
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public void resetPassword(String password, User user) {
        // 对新密码进行加密
        Digester md5 = new Digester(DigestAlgorithm.SHA1);
        String passEncode = md5.digestHex(password + user.getId());
        // 将新密码赋值给用户
        user.setPassword(passEncode);
        // 保存用户
        userRepository.save(user);
    }
}
