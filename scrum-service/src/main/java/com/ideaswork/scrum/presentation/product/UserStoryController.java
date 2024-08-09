package com.ideaswork.scrum.presentation.product;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import com.ideaswork.scrum.domain.userstory.UserStoryDTO;
import com.ideaswork.scrum.domain.userstory.epic.Epic;
import com.ideaswork.scrum.domain.userstory.epic.EpicService;
import com.ideaswork.scrum.domain.userstory.feature.Feature;
import com.ideaswork.scrum.domain.userstory.feature.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/v1/userstory")
public class UserStoryController {


    @Autowired
    private EpicService epicService;

    @Autowired
    private FeatureService featureService;

    @Autowired
    private BacklogService backlogService;

    @Autowired
    private UserService userService;

    // 为某一产品添加一个Epic
    @PostMapping("/epics")
    public ResponseEntity<?> createEpic(@RequestBody Epic epic) {
        epic.setId(UUID.randomUUID().toString());
        Epic save = epicService.save(epic);
        List<Feature> features = new ArrayList<>();
        save.setFeatures(features);
        return ResponseEntity.ok(save);
    }

    // 为某一Epic添加一个Feature
    @PostMapping("/features")
    public ResponseEntity<?> createFeature(@RequestBody Feature feature) {
        feature.setId(UUID.randomUUID().toString());
        Feature save = featureService.save(feature);
        List<Backlog> backlogs = new ArrayList<>();
        save.setBacklogs(backlogs);
        return ResponseEntity.ok(save);
    }


    // 为某一Feature添加一个Backlog
    @PostMapping("/backlogs")
    public ResponseEntity<?> createBacklog(@RequestBody Backlog backlog) {
        backlog.setId(UUID.randomUUID().toString());
        return ResponseEntity.ok(backlogService.save(backlog));
    }


    // 修改某个Backlog
    @PutMapping("/backlogs")
    public ResponseEntity<?> updateBacklog( @RequestBody Backlog backlog, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())||"Product Owner".equals(userByToken.getRole())) {
            String id = backlog.getId();
            Backlog backlogDB = backlogService.findById(id);
            if (backlogDB != null) {
                backlogDB.setName(backlog.getName());
                backlogDB.setImportance(backlog.getImportance());
                backlogDB.setInitialEstimate(backlog.getInitialEstimate());
                backlogDB.setPx(backlog.getPx());
                backlogDB.setFeatureId(backlog.getFeatureId());
                backlogDB.setNotes(backlog.getNotes());

                return ResponseEntity.ok(backlogService.update(backlog));
            } else {
                return ResponseEntity.notFound().build();
            }
        }else {
            return ResponseEntity.badRequest().body("无权限");
        }

    }

    // 删除某个Backlog
    @DeleteMapping("/backlogs/{id}")
    public ResponseEntity<?> deleteBacklog(@PathVariable String id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Product Owner".equals(userByToken.getRole()) || "Scrum Master".equals(userByToken.getRole()) ) {
            backlogService.deleteByBacklogId(id);
        }else {
            return ResponseEntity.badRequest().body("无权限删除");
        }

        return ResponseEntity.ok().build();
    }

    // 修改某个Feature
    @PutMapping("/features")
    public ResponseEntity<?> updateFeature(@RequestBody Feature feature) {
        String id = feature.getId();
        Feature featureDB = featureService.findById(id);
        if (featureDB != null) {
            featureDB.setContent(feature.getContent());
            return ResponseEntity.ok(featureService.update(featureDB));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 删除某个Feature
    @DeleteMapping("/features/{id}")
    public ResponseEntity<?> deleteFeature(@PathVariable String id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Product Owner".equals(userByToken.getRole()) || "Scrum Master".equals(userByToken.getRole()) ) {
            // 查找feature下的backlog
            List<Backlog> backlogs = backlogService.findByFeatureId(id);
            for (Backlog backlog : backlogs) {
                backlogService.deleteByBacklogId(backlog.getId());
            }
            featureService.deleteById(id);
        }else {
            return ResponseEntity.badRequest().body("无权限删除");
        }
        return ResponseEntity.ok().build();
    }

    // 修改某个Epic
    @PutMapping("/epics")
    public ResponseEntity<?> updateEpic( @RequestBody Epic epic) {
        String id = epic.getId();
        Epic epicDB = epicService.findById(id);
        if (epicDB != null) {
            epicDB.setName(epic.getName());
            return ResponseEntity.ok(epicService.update(epicDB));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 删除某个Epic
    @DeleteMapping("/epics/{id}")
    public ResponseEntity<?> deleteEpic(@PathVariable String id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Product Owner".equals(userByToken.getRole()) || "Scrum Master".equals(userByToken.getRole()) ) {

            // 查找epic下的feature
            List<Feature> features = featureService.findByEpicId(id);
            for (Feature feature : features) {
                // 查找feature下的backlog
                List<Backlog> backlogs = backlogService.findByFeatureId(feature.getId());
                for (Backlog backlog : backlogs) {
                    backlogService.deleteByBacklogId(backlog.getId());
                }
                featureService.deleteById(feature.getId());
            }
            epicService.deleteById(id);
        }else {
            return ResponseEntity.badRequest().body("无权限删除");
        }
        return ResponseEntity.ok().build();
    }


    // 查询某一产品的用户故事地图
    @GetMapping("/userStoryMapByProductId/{productId}")
    public List<Epic> getUserStoryMapByProductId(@PathVariable String productId) {
        return epicService.getUserStoryMapByProductId(productId);
    }

    // 批量更新 Epic px
    @PutMapping("/epics/px")
    public void updateEpicPx(@RequestBody List<Epic> epics) {
        epicService.updateEpicPx(epics);
    }

    // 批量更新 Feature px
    @PutMapping("/features/px")
    public void updateFeaturePx(@RequestBody List<Feature> features) {
        featureService.updateFeaturePx(features);
    }

    // 批量更新 Backlog px
    @PutMapping("/backlogs/px")
    public void updateBacklogPx(@RequestBody List<Backlog> backlogs) {
        backlogService.updateBacklogPx(backlogs);
    }

}
