package com.ideaswork.scrum.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ideaswork.scrum.domain.user.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);

    User findByName(String name);
}
