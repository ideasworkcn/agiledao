package com.ideaswork.scrum.domain.backlog;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BacklogRepository extends JpaRepository<Backlog, String> {

    @Query(value = "select * from backlog where product_id = ?1", nativeQuery = true)
    List<Backlog> findByProductId(String productId);


    @Query(value = "select * from backlog where product_id = ?1 order by feature_id, px  ", nativeQuery = true)
    List<Backlog> findByProductIdOrderByFeatureId(String productId);

    @Query(value = "select max(number) from backlog where product_id = ?1", nativeQuery = true)
    String findMaxNumber(String productId);

    List<Backlog> findByFeatureId(String id);

    @Query(value = "select max(px) from backlog where feature_id = ?1", nativeQuery = true)
    Integer findMaxPx(String featureId);

    List<Backlog> findByProductIdOrderByPxAsc(String productId);

    Integer countByProductId(String productId);

    List<Backlog> findByIdIn(List<String> backlogIds);
}
