package com.ideaswork.scrum.domain.userstory.epic;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.userstory.UserStoryDTO;
import com.ideaswork.scrum.domain.userstory.feature.Feature;
import com.ideaswork.scrum.domain.userstory.feature.FeatureService;
import com.ideaswork.scrum.infrastructure.utils.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EpicServiceImpl implements EpicService {

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private FeatureService featureService;

    @Autowired
    private BacklogService backlogService;


    @Override
    public List<Epic> findAll() {
        return epicRepository.findAll();
    }

    @Override
    public Epic findById(String id) {
        return epicRepository.findById(id).orElse(null);
    }

    @Override
    public Epic save(Epic epic) {
        String productId = epic.getProductId();
        String number = epicRepository.findMaxNumber(productId);
        String s = IdGenerator.generateNextEpic(number);
        epic.setNumber(s);
        // 获取当前最大的px
//        Integer maxPx = epicRepository.findMaxPx(productId);
//        if (maxPx == null) {
//            maxPx = 0;
//        }
//        epic.setPx(maxPx + 1);
        // Find all epics with px greater than the current px
        List<Epic> epicsToUpdate = epicRepository.findByPxGreaterThan(epic.getPx());

        // Increment the px value for each epic
        for (Epic epicDB : epicsToUpdate) {
            epicDB.setPx(epicDB.getPx() + 1);
        }

        // Save the updated epics back to the repository
        epicRepository.saveAll(epicsToUpdate);
        return epicRepository.save(epic);
    }

    @Override
    public void deleteById(String id) {
        epicRepository.deleteById(id);
    }

    @Override
    public List<Epic> findByProductId(String productId) {
        return epicRepository.findByProductId(productId);
    }

    @Override
    public List<Epic> getUserStoryMapByProductId(String productId) {
        List<Epic> epics = epicRepository.findByProductIdOrderByPxAsc(productId);
        // 查找所有的Feature
        List<Feature> features = featureService.findByProductIdOrderByPxAsc(productId);
        // 查找所有的Backlog
        List<Backlog> backlogs = backlogService.findByProductIdOrderByPxAsc(productId);

//        System.out.println("epics = " + epics);
//        System.out.println("features = " + features);
//        System.out.println("backlogs = " + backlogs);

        // 遍历 Feature 和 Backlog，将Backlog放入对应的Feature中
        for (Feature feature : features) {
            List<Backlog> backlogList = new ArrayList<>();
            feature.setBacklogs(backlogList);
            for (Backlog backlog : backlogs) {
                if (backlog.getFeatureId().equals(feature.getId())) {
                    backlogList.add(backlog);
                }
            }
        }

        // 将Feature 放入对应的Epic中
          for (Epic epic : epics) {
              List<Feature> featureList = new ArrayList<>();
                epic.setFeatures(featureList);
                for (Feature feature : features) {
                    if (feature.getEpicId().equals(epic.getId())) {
                        featureList.add(feature);
                    }
                }
         }


    return epics;
    }

    @Override
    public Epic update(Epic epicDB) {
        return epicRepository.save(epicDB);
    }

    @Override
    public void updateEpicPx(List<Epic> epics) {
        for (int i = 0; i < epics.size(); i++) {
            Epic epic = epics.get(i);
            epicRepository.save(epic);
        }
    }


}
