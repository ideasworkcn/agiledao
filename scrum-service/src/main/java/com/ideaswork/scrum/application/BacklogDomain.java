package com.ideaswork.scrum.application;

import cn.hutool.core.map.MapUtil;
import com.ideaswork.scrum.domain.backlog.BacklogDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BacklogDomain {
    @Resource
    private JdbcTemplate jdbcTemplate;

    public List<BacklogDTO> findAllByProductId(String productId) {
        List<Map<String, Object>> maps = jdbcTemplate.queryForList("select b.*,p.name as productName from backlog b left join product p  on b.product_id=p.id and b.product_id =?", productId);

        return mapsToDTO(maps);

    }

    private List<BacklogDTO> mapsToDTO(List<Map<String, Object>> maps) {
        List<BacklogDTO> backlogDTOS = new ArrayList<>();
        for (int i = 0; i < maps.size(); i++) {
            Map<String, Object> stringObjectMap = maps.get(i);
            BacklogDTO backlogDTO = new BacklogDTO();
            backlogDTO.setId(MapUtil.getStr(stringObjectMap, "id"));
            backlogDTO.setProductId(MapUtil.getStr(stringObjectMap, "product_id"));
            backlogDTO.setProductName(MapUtil.getStr(stringObjectMap, "productName"));
            backlogDTO.setName(MapUtil.getStr(stringObjectMap, "name"));
            backlogDTO.setImportance(MapUtil.getInt(stringObjectMap, "importance"));
            backlogDTO.setInitialEstimate(MapUtil.getInt(stringObjectMap, "initial_estimate"));
            backlogDTO.setHowToDemo(MapUtil.getStr(stringObjectMap, "how_to_demo"));
            backlogDTO.setNotes(MapUtil.getStr(stringObjectMap, "notes"));
//            backlogDTO.setSprintId(MapUtil.getStr(stringObjectMap, "sprint_id"));
//            backlogDTO.setSprintName(MapUtil.getStr(stringObjectMap, "sprint_name"));
            backlogDTOS.add(backlogDTO);
        }
        return backlogDTOS;
    }


}
