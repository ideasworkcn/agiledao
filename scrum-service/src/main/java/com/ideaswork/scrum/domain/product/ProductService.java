package com.ideaswork.scrum.domain.product;

import java.util.List;

public interface ProductService {
    Product create(Product product);

    Product read(String id);

    Product update(Product product);

    void delete(String id);

    List<Product> getAllProducts();
}
