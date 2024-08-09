package com.ideaswork.scrum.domain.userstory.feature;

import com.ideaswork.scrum.domain.backlog.Backlog;

import java.util.List;

public interface FeatureService {
    List<Feature> findAll();
    Feature findById(String id);
    Feature save(Feature feature);
    void deleteById(String id);

    List<Feature> findByProductId(String productId);

    Feature update(Feature featureDB);

    List<Feature> findByEpicId(String id);

    List<Feature> findByProductIdOrderByPxAsc(String productId);

    void updateFeaturePx(List<Feature> features);

    List<Feature> findAllByProductId(String productId);
}
