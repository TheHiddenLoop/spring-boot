package com.ecom.ecommerse.service;

import com.ecom.ecommerse.entity.Product;
import com.ecom.ecommerse.repository.ProductRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Data
public class ProductService {
    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final CloudinaryService cloudinaryService;


    public List<Product> getAllProduct(){
        return productRepository.findAll();
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        String imageUrl = cloudinaryService.uploadImage(imageFile);
        product.setImageUrl(imageUrl);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }


    public Product updateProduct(
            String id,
            Product productDetails,
            MultipartFile imageFile) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Product not found with id: " + id
                        )
                );

        if (productDetails == null) {
            throw new IllegalArgumentException(
                    "Product details cannot be empty"
            );
        }

        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String newImageUrl = cloudinaryService.uploadImage(imageFile);

                if (newImageUrl == null || newImageUrl.isBlank()) {
                    throw new RuntimeException(
                            "Cloudinary returned an empty image URL"
                    );
                }

                existingProduct.setImageUrl(newImageUrl);
            }

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to upload image to Cloudinary",
                    e
            );
        }

        existingProduct.setName(productDetails.getName());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setDescription(productDetails.getDescription());

        existingProduct.setBrand(productDetails.getBrand());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setQuantity(productDetails.getQuantity());
        existingProduct.setAvailable(productDetails.isAvailable());

        return productRepository.save(existingProduct);
    }

}
