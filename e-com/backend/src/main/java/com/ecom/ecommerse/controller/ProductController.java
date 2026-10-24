
package com.ecom.ecommerse.controller;

import com.ecom.ecommerse.dto.ProductResponse;
import com.ecom.ecommerse.entity.Product;
import com.ecom.ecommerse.repository.ProductRepository;
import com.ecom.ecommerse.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<ProductResponse<List<Product>>> allProducts(@RequestParam(value = "query", required = false) String query) {
        if(query == null) {
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ProductResponse<>(
                        true,
                        "All products fetched successfully",
                        productService.getAllProduct()
                ));
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ProductResponse<>(
                        true,
                        "All products fetched successfully",
                        productRepository.searchProducts(query)
                ));
    }

    @PostMapping(
            value = "/add",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("imageFile") MultipartFile imageFile) {
        System.out.println("Heer");

        try {
            Product product = new ObjectMapper()
                .readValue(productJson, Product.class);
            Product savedProduct =
                    productService.addProduct(product, imageFile);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ProductResponse<>(
                            true,
                            "Product added successfully",
                            savedProduct
                    ));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ProductResponse<>(
                            false,
                            "Image upload failed. Please try again.",
                            null
                    ));

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductResponse<>(
                            false,
                            "Unable to add product. Please try again later.",
                            null
                    ));
        }
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse<?>> updateProduct(
            @PathVariable("id") String id,
            @RequestPart("product") Product productJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

        try {
            Product updatedProduct = productService.updateProduct(id, productJson, imageFile);

            return ResponseEntity.ok(
                    new ProductResponse<>(
                            true,
                            "Product updated successfully",
                            updatedProduct
                    )
            );

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ProductResponse<>(false, e.getMessage(), null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ProductResponse<>(false, e.getMessage(), null));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProductResponse<>(
                            false,
                            "Failed to update product: " + e.getMessage(),
                            null
                    ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") String id){
        productService.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProductResponse<>(true, "Product deleted Successfully", null));
    }
}
