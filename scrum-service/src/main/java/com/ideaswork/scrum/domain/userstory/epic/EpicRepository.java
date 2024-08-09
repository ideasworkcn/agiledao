package com.ideaswork.scrum.domain.userstory.epic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EpicRepository extends JpaRepository<Epic, String> {
    List<Epic> findByProductId(String productId);

    @Query(value = "select max(number) from epic where product_id = ?1", nativeQuery = true)
    String findMaxNumber(String productId);

    List<Epic> findByProductIdOrderByPxAsc(String productId);

    @Query(value = "select max(px) from epic where product_id = ?1", nativeQuery = true)
    Integer findMaxPx(String productId);
}
