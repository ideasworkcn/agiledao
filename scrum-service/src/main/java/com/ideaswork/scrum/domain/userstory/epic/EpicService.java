package com.ideaswork.scrum.domain.userstory.epic;

import com.ideaswork.scrum.domain.userstory.UserStoryDTO;

import java.util.List;

public interface EpicService {
    List<Epic> findAll();
    Epic findById(String id);
    Epic save(Epic epic);
    void deleteById(String id);
    List<Epic> findByProductId(String productId);
    List<Epic> getUserStoryMapByProductId(String productId);

    Epic update(Epic epicDB);

    void updateEpicPx(List<Epic> epics);
}
