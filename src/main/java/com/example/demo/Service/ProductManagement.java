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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

 @Service
public class ProductManagement {
    @Autowired
    private ProductRepo proRepository;
    @Autowired
    private CategoryRepo cateRepo;
    public ReqResProduct searchName(ReqResProduct searchPro) {
        ReqResProduct req = new ReqResProduct();

        try {
            // Use custom query method from repository
            List<ProductModel> matchingProducts = proRepository.searchProductsByName(searchPro.getName());

            if (matchingProducts.isEmpty()) {
                req.setMessage("No products found");
                req.setStatusCode(404);
            } else {
                req.setProductList(matchingProducts);  // Set matching products in the response
                req.setMessage("Products found successfully");
                req.setStatusCode(200);
            }
        } catch (RuntimeException e) {
            req.setMessage("Error while searching for product: " + e.getMessage());
            req.setStatusCode(500);
        }

        return req;
    }

     public ReqResProduct addPro(ReqResProduct addPro, MultipartFile imageFile) {
         ReqResProduct req = new ReqResProduct();

             try {
             if (addPro.getName() == null || addPro.getPrice() <= 0 || addPro.getStockQuantity() <= 0 || addPro.getCategoryId() <= 0 ||
                     addPro.getAmount() <= 0) {
                 System.out.println(addPro.getName());
                 System.out.println(addPro.getPrice());
                 System.out.println(addPro.getCategoryId());
                 System.out.println(addPro.getStockQuantity());
                 System.out.println(addPro.getAmount());
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



}