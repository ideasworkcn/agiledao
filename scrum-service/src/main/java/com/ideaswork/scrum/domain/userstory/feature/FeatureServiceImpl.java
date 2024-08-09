package com.ideaswork.scrum.domain.userstory.feature;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.infrastructure.utils.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeatureServiceImpl implements FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public List<Feature> findAll() {
        return featureRepository.findAll();
    }

    @Override
    public Feature findById(String id) {
        return featureRepository.findById(id).orElse(null);
    }

    @Override
    public Feature save(Feature feature) {
        String productId = feature.getProductId();
        String number = featureRepository.findMaxNumber(productId);
        String s = IdGenerator.generateNextFeature(number);
        feature.setNumber(s);
        String epicId = feature.getEpicId();
        // 获取当前最大的px
        Integer maxPx = featureRepository.findMaxPx(epicId);
        if (maxPx == null) {
            maxPx = 0;
        }
        feature.setPx(maxPx + 1);

        return featureRepository.save(feature);
    }

    @Override
    public void deleteById(String id) {
        featureRepository.deleteById(id);
    }

    @Override
    public List<Feature> findByProductId(String productId) {
        return featureRepository.findByProductId(productId);
    }

    @Override
    public Feature update(Feature featureDB) {
        return featureRepository.save(featureDB);
    }

    @Override
    public List<Feature> findByEpicId(String id) {
        return featureRepository.findByEpicId(id);
    }

    @Override
    public List<Feature> findByProductIdOrderByPxAsc(String productId) {
        return featureRepository.findByProductIdOrderByPxAsc(productId);
    }

    @Override
    public void updateFeaturePx(List<Feature> features) {
        for (int i = 0; i < features.size(); i++) {
            Feature feature = features.get(i);
            featureRepository.save(feature);
        }
    }

    @Override
    public List<Feature> findAllByProductId(String productId) {
        List<Feature> byProductId = featureRepository.findByProductIdOrderByPxAsc(productId);
        return byProductId;
    }
}
