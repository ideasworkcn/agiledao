package com.ideaswork.scrum.domain.userstory.feature;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeatureRepository extends JpaRepository<Feature, String> {
    List<Feature> findByProductId(String productId);

    @Query(value = "select max(number) from feature where product_id = ?1", nativeQuery = true)
    String findMaxNumber(String productId);

    List<Feature> findByEpicId(String id);

    @Query(value = "select max(px) from feature where epic_id = ?1", nativeQuery = true)
    Integer findMaxPx(String epicId);

    List<Feature> findByProductIdOrderByPxAsc(String productId);
}
