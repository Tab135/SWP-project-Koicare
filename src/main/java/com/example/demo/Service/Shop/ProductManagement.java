package com.example.demo.Service.Shop;

import com.example.demo.DTO.ReviewModel;
import com.example.demo.DTO.Shop.CategoryModel;
import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResProduct;
import com.example.demo.Repo.ReviewRepo;
import com.example.demo.Repo.Shop.CategoryRepo;
import com.example.demo.Repo.Shop.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service
public class ProductManagement {
    @Autowired
    private ProductRepo proRepository;
    @Autowired
    private CategoryRepo cateRepo;
    @Autowired
    private ReviewRepo reviewRepo;

    public ReqResProduct searchByCategoryId(int categoryId) {
        ReqResProduct req = new ReqResProduct();

        try {
            // Check if the category exists before searching for products
            Optional<CategoryModel> category = cateRepo.findByCategoryId(categoryId);

            if (!category.isPresent()) {
                req.setMessage("Category not found");
                req.setStatusCode(404);
            } else {
                List<ProductModel> matchingProducts = proRepository.findByCategory_CategoryId(categoryId);

                if (matchingProducts.isEmpty()) {
                    req.setMessage("No products found for this category");
                    req.setStatusCode(404);
                } else {
                    req.setProductList(matchingProducts);
                    req.setMessage("Products found successfully");
                    req.setStatusCode(200);
                }
            }
        } catch (RuntimeException e) {
            req.setMessage("Error while searching for products: " + e.getMessage());
            req.setStatusCode(500);
        }

        return req;
    }

    public ReqResProduct addPro(ReqResProduct addPro, MultipartFile imageFile) {
        ReqResProduct req = new ReqResProduct();

        try {


            if (addPro.getName() == null || addPro.getPrice().compareTo(BigDecimal.ZERO) <= 0 ||
                    addPro.getCategoryId() <= 0 ||
                    addPro.getAmount() <= 0) {

                req.setMessage("Invalid product data");
                req.setStatusCode(400); // Bad Request
                return req;
            }

            Optional<CategoryModel> cm = cateRepo.findByCategoryId(addPro.getCategoryId());
            if (!cm.isPresent()) {
                req.setMessage("Category not found");
                req.setStatusCode(404); // Not Found
                return req;
            }

            ProductModel pm = new ProductModel();
            pm.setProductName(addPro.getName());
            pm.setPrice(addPro.getPrice());
            pm.setDescription(addPro.getDescription());
            pm.setCategory(cm.get());
            pm.setProductRating(0.0);
            pm.setAmount(addPro.getAmount());

            // Handle image upload if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageBytes = imageFile.getBytes();
                pm.setProductImage(imageBytes);  // Make sure ProductModel has byte[] field for image
            }

            // Save the product to the database
            proRepository.save(pm);

            req.setMessage("Product added successfully");
            req.setStatusCode(200);
        } catch (RuntimeException | IOException e) {
            // Handle any exceptions and return appropriate message
            req.setMessage("Error while adding product: " + e.getMessage());
            req.setStatusCode(500); // Internal Server Error
        }

        return req;
    }

    @Transactional
    public ReqResProduct delePro(int id) {
        ReqResProduct req = new ReqResProduct();
        try {
            Optional<ProductModel> pm = proRepository.findById(id);
            if (pm.isPresent()) {
                proRepository.deleteById(id);
                req.setMessage("Delete Successfully");
                req.setStatusCode(200);
            } else {
                req.setMessage("Product not found");
                req.setStatusCode(400);
            }
        } catch (RuntimeException e) {
            req.setMessage("Error in deleting Product: " + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }

    @Transactional
    public ReqResProduct updatePro(int id, ReqResProduct reqResProduct, MultipartFile imageFile) {
        ReqResProduct response = new ReqResProduct();
        System.out.println("Incoming ReqResProduct: " + reqResProduct);
        try {
            // Fetch the existing product
            ProductModel existingProduct = proRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Update fields from ReqResProduct
            if (reqResProduct.getName() != null && !reqResProduct.getName().isEmpty()) {
                existingProduct.setProductName(reqResProduct.getName());
            }
            System.out.println("Name: " + reqResProduct.getName());

            if (reqResProduct.getPrice() != null && reqResProduct.getPrice().compareTo(BigDecimal.ZERO) > 0) {
                existingProduct.setPrice(reqResProduct.getPrice());
            }
            System.out.println("Price: " + reqResProduct.getPrice());

            if (reqResProduct.getDescription() != null && !reqResProduct.getDescription().isEmpty()) {
                existingProduct.setDescription(reqResProduct.getDescription());
            }
            System.out.println("Description: " + reqResProduct.getDescription());


            if (reqResProduct.getAmount() > 0) {
                existingProduct.setAmount(reqResProduct.getAmount());
            }
            System.out.println("Amount: " + reqResProduct.getAmount());

            // Update category if it's provided and not null
            if (reqResProduct.getCategoryId() != 0 && reqResProduct.getCategoryId() > 0) {
                Optional<CategoryModel> category = cateRepo.findByCategoryId(reqResProduct.getCategoryId());
                if (category.isPresent()) {
                    existingProduct.setCategory(category.get());
                } else {
                    response.setMessage("Category not found");
                    response.setStatusCode(404);
                    return response;
                }
            }

            // Handle image upload if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    byte[] imageBytes = imageFile.getBytes(); // Convert MultipartFile to byte[]
                    existingProduct.setProductImage(imageBytes);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image file", e);
                }
            }

            // Save the updated product
            proRepository.save(existingProduct);
            response.setStatusCode(200);
            response.setMessage("Product updated successfully");
        } catch (Exception e) {
            // Logging general error
            response.setMessage("Error: " + e.getMessage());
            response.setStatusCode(400);
        }
        return response;
    }

    public List<ProductModel> showProduct(ProductModel model) {
        try {
            List<ProductModel> list = proRepository.findAll(Sort.by(Sort.DEFAULT_DIRECTION, "id"));
            if (list.isEmpty()) {
                return new ArrayList<>();
            }

            // Calculate average rating for each product
            for (ProductModel product : list) {
                double averageRating = reviewRepo.findByProductId(product.getId()).stream()
                        .mapToDouble(ReviewModel::getRating)
                        .average()
                        .orElse(0.0); // Default to 0 if no ratings
                product.setProductRating(averageRating); // Update the product's rating
            }

            return list;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public ReqResProduct getProductById(int id) {
        ReqResProduct reqResProduct = new ReqResProduct();

        // Fetch the product by ID
        Optional<ProductModel> optionalProduct = proRepository.findById(id);

        if (!optionalProduct.isPresent()) {
            reqResProduct.setStatusCode(404); // Not Found
            reqResProduct.setMessage("Product not found");
            return reqResProduct;
        }

        // Get the product from the Optional
        ProductModel foundProduct = optionalProduct.get();

        // Populate ReqResProduct with product details
        reqResProduct.setStatusCode(200); // OK
        reqResProduct.setName(foundProduct.getProductName());
        reqResProduct.setPrice(foundProduct.getPrice());
        reqResProduct.setDescription(foundProduct.getDescription());
        reqResProduct.setAmount(foundProduct.getAmount());
        reqResProduct.setCategoryName(foundProduct.getCategory().getCategoryName());
        reqResProduct.setCategoryId(foundProduct.getCategory().getCategoryId());
        double averageRating = calculateAverageRating(id);
        reqResProduct.setProductRating(averageRating);

        // Convert product image to Base64 if present
        if (foundProduct.getProductImage() != null && foundProduct.getProductImage().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(foundProduct.getProductImage());
            reqResProduct.setProductImageBase64(base64Image); // Set as Base64 string
        }

        reqResProduct.setMessage("Product details retrieved successfully");
        return reqResProduct;
    }

    public double calculateAverageRating(int productId) {
        List<ReviewModel> reviews = reviewRepo.findByProductId(productId);

        return reviews.stream()
                .mapToDouble(ReviewModel::getRating)
                .average()
                .orElse(0.0); // Calculate the average
    }
}
