package com.ideaswork.scrum.domain.sprint;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SprintRepository extends JpaRepository<Sprint, String> {
    List<Sprint> findByProductId(String productId);
}
