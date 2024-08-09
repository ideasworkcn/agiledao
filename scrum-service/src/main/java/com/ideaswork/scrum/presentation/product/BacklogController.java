package com.ideaswork.scrum.presentation.product;

import com.ideaswork.scrum.application.BacklogDomain;
import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogDTO;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.product.ProductService;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import com.ideaswork.scrum.domain.userstory.feature.Feature;
import com.ideaswork.scrum.domain.userstory.feature.FeatureService;
import io.swagger.annotations.ApiOperation;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/backlog")
@CrossOrigin
@ApiOperation(value = "backlog", notes = "backlog")
public class BacklogController {

    @Autowired
    private BacklogService backlogService;

    @Autowired
    private BacklogDomain backlogDomain;

    @Autowired
    private ProductService productService;

    @Autowired
    private FeatureService featureService;

    @Autowired
    private UserService userService;

    @GetMapping("/backlogList")
    @ApiOperation(value = "get backlog list", notes = "get backlog list")
    public List<Backlog> getBacklogList() {
        return backlogService.findAll();
    }


    // 根据产品获取backlog列表
    // get backlog list by product
    @GetMapping("/backlogListByProduct/{productId}")
    @ResponseBody
    @ApiOperation(value = "get backlog list by product", notes = "get backlog list by product")
    public ResponseEntity<List<Backlog>> getBacklogListByProduct(@PathVariable String productId) {
        List<Backlog> allByProductId = backlogService.findAllByProductId(productId);
        return ResponseEntity.ok(allByProductId);
    }

    // 获取feature列表
    // get feature list
    @GetMapping("/featureListByProduct")
    @ApiOperation(value = "get feature list", notes = "get feature list")
    public List<Feature> getFeatureListByProductId(@RequestParam String productId) {
        return featureService.findAllByProductId(productId);
    }


    @PostMapping("/addBacklog")
    @ApiOperation(value = "add backlog", notes = "add backlog")
    public Backlog addBacklog(@RequestBody Backlog backlog) {
        backlog.setId(UUID.randomUUID().toString());
        return backlogService.save(backlog);
    }

    @PutMapping("/modifyBacklog")
    @ApiOperation(value = "modify backlog", notes = "modify backlog")
    public ResponseEntity<?> modifyBacklog(@RequestBody Backlog backlog, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }else if ("Scrum Master".equals(userByToken.getRole())||"Product Owner".equals(userByToken.getRole())) {
             return ResponseEntity.ok(backlogService.update(backlog));
        }else {
            return ResponseEntity.badRequest().body("无权限");
        }
    }

    @DeleteMapping("/removeBacklog")
    @ApiOperation(value = "remove backlog", notes = "remove backlog")
    public ResponseEntity removeBacklog(String backlogId) {
        backlogService.deleteByBacklogId(backlogId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getBacklogDetail")
    @ApiOperation(value = "get backlog detail", notes = "get backlog detail")
    public Backlog getBacklogDetail(String backlogId) {
        return backlogService.findById(backlogId);
    }
}
