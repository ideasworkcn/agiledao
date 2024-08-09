package com.ideaswork.scrum.presentation.product;

import com.ideaswork.scrum.application.ProductDomain;
import com.ideaswork.scrum.domain.backlog.Backlog;
import com.ideaswork.scrum.domain.product.Product;
import com.ideaswork.scrum.domain.product.ProductDTO;
import com.ideaswork.scrum.domain.product.ProductService;
import com.ideaswork.scrum.domain.user.User;
import com.ideaswork.scrum.domain.user.UserService;
import com.ideaswork.scrum.infrastructure.exception.UnauthorizedException;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/product")
@CrossOrigin
@ApiOperation(value = "product", notes = "product")
public class ProductController {
    @Autowired
    UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductDomain productDomain;

    // get product list
    @GetMapping("/productList")
    @ApiOperation(value = "get product list", notes = "get product list")
    public ResponseEntity<?> getProductList() {
        User user = userService.getLoginUser();
        System.out.println("user: " + user);
        if (user == null) {
            return ResponseEntity.badRequest().body("用户未登录");
        }
        List<Product> allProducts = productService.getAllProducts();
        if (allProducts.size()==0) {
            Product product = new Product();
            product.setId(UUID.randomUUID().toString());
            product.setName("demo product");
            product.setDescription("product description");
            Product product1 = productService.create(product);
            allProducts.add(product1);
        }
        return ResponseEntity.ok(allProducts);
    }

    // create product
    @PostMapping("/addProduct")
    @ApiOperation(value = "add product", notes = "add product")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        product.setId(UUID.randomUUID().toString());


        System.out.println("product: " + product);
        return ResponseEntity.ok(productDomain.addProduct(product));
    }

    // modify product
    @PutMapping("/modifyProduct")
    @ApiOperation(value = "modify product", notes = "modify product")
    public Product modifyProduct(@RequestBody Product product) {
        return productDomain.modifyProduct(product);
    }

    // delete product
    @DeleteMapping("/deleteProduct/{id}")
    @ApiOperation(value = "delete product", notes = "delete product")
    public ResponseEntity deleteProduct(@PathVariable String id, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return ResponseEntity.badRequest().body("无效的token");
        }
        // 提取 Barer 后面的token
        token = token.substring(7);
        User userByToken = userService.getUserByToken(token);
        if (userByToken == null) {
            return ResponseEntity.badRequest().body("无效的token");

        }else if ("Scrum Master".equals(userByToken.getRole())) {
        productDomain.deleteProduct(id);
        } else {
            throw new UnauthorizedException("无权限删除");
        }
        return ResponseEntity.ok().build();
    }

}
