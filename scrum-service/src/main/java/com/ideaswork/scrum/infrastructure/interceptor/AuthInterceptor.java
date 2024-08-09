package com.ideaswork.scrum.infrastructure.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ideaswork.scrum.domain.user.UserService;
import com.ideaswork.scrum.infrastructure.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

// Implement HandlerInterceptor interface
public class AuthInterceptor implements HandlerInterceptor {
    private UserService userService;

    public AuthInterceptor() {
    }

    public AuthInterceptor(UserService userService) {
        this.userService = userService;
    }

    // Override preHandle method to intercept requests before they are handled by the controller
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Add code to check for token and authenticate user
        String token = request.getHeader("Authorization");
        System.out.println("token: " + token);
//        if (token == null || !token.startsWith("Bearer ")) {
        if (token == null ) {
            // 未登录自定义异常
            throw new UnauthorizedException("Unauthorized");
        }
        // veryfiy token
        if (token.startsWith("Bearer ")){
            token = token.substring(7);
        }
        if (!userService.checkToken(token)) {
            throw new UnauthorizedException("Unauthorized");
        }
        return true; // Return true to allow the request to proceed to the controller
    }

}

