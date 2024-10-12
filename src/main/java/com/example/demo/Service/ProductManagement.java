 package com.example.demo.Service;
import com.example.demo.DTO.CategoryModel;
import com.example.demo.DTO.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResProduct;
import com.example.demo.Repo.CategoryRepo;
import com.example.demo.Repo.ProductRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

 @Service
public class ProductManagement {
    @Autowired
    private ProductRepo proRepository;
    @Autowired
    private CategoryRepo cateRepo;

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
                 System.out.println(addPro.getCategoryId());
                 System.out.println(addPro.getAmount());
                 System.out.println(addPro.getPrice());
                 System.out.println(addPro.getStockQuantity());
                 System.out.println(addPro.getName());
             if (addPro.getName() == null || addPro.getPrice() <= 0 || addPro.getStockQuantity() <= 0 || addPro.getCategoryId() <= 0 ||
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
             pm.setStockQuantity(addPro.getStockQuantity());
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
    public ReqResProduct delePro(int id){
        ReqResProduct req = new ReqResProduct();
        try{
            Optional<ProductModel> pm = proRepository.findById(id);
            if(pm.isPresent()){
                proRepository.deleteById(id);
                req.setMessage("Delete Successfully");
                req.setStatusCode(200);
            }else{
                req.setMessage("Product not found");
                req.setStatusCode(400);
            }
        }catch(RuntimeException e)
        {
            req.setMessage("Error in deleting Product: " + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }
    @Transactional
    public ReqResProduct updatePro(int id, ProductModel detail) {
        ReqResProduct req = new ReqResProduct();
        try {
            Optional<ProductModel> pm = proRepository.findById(id);
            if (!pm.isPresent()) {
                req.setMessage("Product not found");
                req.setStatusCode(404);
                return req;
            }
            ProductModel newProduct = pm.get();
            // Only update fields if they are not null or not zero in the request
            if (detail.getProductName() != null) {
                newProduct.setProductName(detail.getProductName());
            }
            if (detail.getPrice() > 0) {
                newProduct.setPrice(detail.getPrice());
            }
            if (detail.getDescription() != null) {
                newProduct.setDescription(detail.getDescription());
            }
            if (detail.getStockQuantity() > 0) {
                newProduct.setStockQuantity(detail.getStockQuantity());
            }
            if(detail.getAmount() > 0)
            {
                newProduct.setAmount(detail.getAmount());
            }

            // Update category only if it's provided in the request
            if (detail.getCategory() != null && detail.getCategory().getCategoryId() > 0) {
                Optional<CategoryModel> category = cateRepo.findByCategoryId(detail.getCategory().getCategoryId());
                if (category.isPresent()) {
                    newProduct.setCategory(category.get());
                } else {
                    req.setMessage("Category not found");
                    req.setStatusCode(404);
                    return req;
                }
            }

            // Save the updated product
            proRepository.save(newProduct);

            req.setStatusCode(200);
            req.setMessage("Update successfully");

        } catch (DataAccessException e) {
            req.setMessage("Error while updating product: " + e.getMessage());
            req.setStatusCode(500);
        }

        return req;
    }
    public List<ProductModel> showProduct(ProductModel model)
    {

        try{
            List<ProductModel> list = proRepository.findAll(Sort.by(Sort.DEFAULT_DIRECTION, "id"));
            if(list.isEmpty())
            {
                return new ArrayList<>();
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
         reqResProduct.setStockQuantity(foundProduct.getStockQuantity());
         reqResProduct.setAmount(foundProduct.getAmount());
         reqResProduct.setCategoryName(foundProduct.getCategory().getCategoryName());

         // Convert product image to Base64 if present
         if (foundProduct.getProductImage() != null && foundProduct.getProductImage().length > 0) {
             String base64Image = Base64.getEncoder().encodeToString(foundProduct.getProductImage());
             reqResProduct.setProductImageBase64(base64Image);// Set as Base64 string
         }

         reqResProduct.setMessage("Product details retrieved successfully");
         return reqResProduct;
     }
 }
