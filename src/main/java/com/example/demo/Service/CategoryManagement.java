package com.example.demo.Service;

import com.example.demo.DTO.CategoryModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResCATE;
import com.example.demo.Repo.CategoryRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryManagement {

    @Autowired
    private CategoryRepo cateReposity;

    public ReqResCATE addCate(ReqResCATE addcate) {
        ReqResCATE req = new ReqResCATE();
        try {
            // Validate input
            if (addcate.getCategoryName() == null || addcate.getCategoryName().isEmpty()) {
                req.setMessage("Category name cannot be null or empty");
                return req;
            }

            // Create a new category model object
            CategoryModel cm = new CategoryModel();
            cm.setCategoryName(addcate.getCategoryName());

            // Save the category to the repository
            CategoryModel result = cateReposity.save(cm);

            if (result != null) {
                req.setMessage("Category added successfully");
                req.setStatusCode(200);
            } else {
                req.setMessage("Failed to add category");
                req.setStatusCode(400);
            }
        } catch (DataAccessException e) {
            // Specific database-related exception handling
            req.setMessage("Error while adding category: " + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }

    @Transactional
    public ReqResCATE deleteCate(int id) {
        ReqResCATE req = new ReqResCATE();
        try {
            Optional<CategoryModel> cm = cateReposity.findByCategoryId(id);
            if (cm.isPresent()) {
                cateReposity.deleteByCategoryId(id);
                req.setMessage("Category deleted successfully");
                req.setStatusCode(200);
            } else {
                req.setMessage("Category not found");
                req.setStatusCode(404);
            }
        } catch (DataAccessException e) {
            req.setMessage("Error while deleting category: " + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }

    @Transactional
    public ReqResCATE updateById(int id, CategoryModel detail) {
        ReqResCATE req = new ReqResCATE();
        try {
            Optional<CategoryModel> cm = cateReposity.findByCategoryId(id);
            if (cm.isPresent()) {
                CategoryModel new_cate = cm.get();
                new_cate.setCategoryName(detail.getCategoryName());
                cateReposity.save(new_cate);

                req.setMessage("Category updated successfully");
                req.setStatusCode(200);
                return req;
            } else {
                req.setMessage("Category not found");
                req.setStatusCode(404);
            }
        } catch (DataAccessException e) {
            req.setMessage("Error while updating category: " + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }
}
