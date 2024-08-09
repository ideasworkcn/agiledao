package com.ideaswork.scrum.application;

import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.backlog.BacklogRepository;
import com.ideaswork.scrum.domain.backlog.BacklogService;
import com.ideaswork.scrum.domain.product.Product;
import com.ideaswork.scrum.domain.product.ProductService;
import com.ideaswork.scrum.domain.sprint.SprintRepository;
import com.ideaswork.scrum.domain.sprint.sprintbacklog.SprintBacklogRepository;
import com.ideaswork.scrum.domain.product.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ProductDomain {
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ProductService productService;

    @Autowired
    private BacklogService backendlogService;

    @Autowired
    private BacklogRepository backlogRepository;

//    public List<ProductDTO> getProductList() {
//        String sql = "SELECT p.id, p.name, p.description,p.status,p.manager,p.start_date,p.due_date, p.product_owner_id, p.product_owner_name " +
//                "FROM product p  ";
//        List<ProductDTO> query = jdbcTemplate.query(sql, (rs, rowNum) -> {
//            ProductDTO productDTO = new ProductDTO();
//            productDTO.setId(rs.getString("id"));
//            productDTO.setName(rs.getString("name"));
//            productDTO.setDescription(rs.getString("description"));
//            productDTO.setProductOwnerId(rs.getString("product_owner_id"));
//            productDTO.setOwnerName(rs.getString("user_name"));
//            productDTO.setStatus(rs.getString("status"));
//            productDTO.setManager(rs.getString("manager"));
//            productDTO.setStartDate(rs.getDate("start_date"));
//            productDTO.setDueDate(rs.getDate("due_date"));
//
//            return productDTO;
//        });
//
//        //  将 sql 映射为对象
//
//        return query;
//    }

    public Product addProduct(Product product) {
        return productService.create(product);
    }

    public Product modifyProduct(Product product) {
        return productService.update(product);
    }

    public void deleteProduct(String id) {
        productService.delete(id);
    }

    public Backlog addBacklog(Backlog backlog) {
        return backendlogService.save(backlog);
    }

    public List<Backlog> getBacklogListByProductId(String productId) {
        return backlogRepository.findByProductId(productId);
    }
}
