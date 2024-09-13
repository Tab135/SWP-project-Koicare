package com.example.demo.Service;

import com.example.demo.DTO.CategoryModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResCATE;
import com.example.demo.Repo.CategoryRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryManagement {

    @Autowired
    private CategoryRepo cateReposity;

   public ReqResCATE addCate(ReqResCATE addcate)
   {
       ReqResCATE req = new ReqResCATE();
       try{
           CategoryModel cm = new CategoryModel();
           cm.setName(addcate.getName());
          CategoryModel result = cateReposity.save(cm);
          req.setMessage("Category added successfully");
       }catch(Exception e){
           req.setMessage("Error while adding category");
           throw new RuntimeException(e);
       }
return req;
   }
   @Transactional
   public ReqResCATE deleteCate(int id){
       ReqResCATE req = new ReqResCATE();
       try{
           Optional<CategoryModel> cm = cateReposity.findByCateid(id);
           if(cm.isPresent())
           {
               cateReposity.deleteByCateid(id);
               req.setMessage("Delete successfully");
               req.setStatusCode(200);
           }
       } catch (Exception e) {
           req.setStatusCode(404);
           req.setMessage(e.getMessage());
       }
       return req;
   }

   public CategoryModel UpdateById(int id, CategoryModel detail)
   {
       ReqResCATE req = new ReqResCATE();
       try{
           Optional<CategoryModel> cm = cateReposity.findByCateid(id);
           if(cm.isPresent()){
               CategoryModel new_cate = cm.get();
               new_cate.setName(detail.getName());
               req.setMessage("Update success");
               req.setStatusCode(200);
               return cateReposity.save(new_cate);
           }
       } catch (Exception e) {
           req.setMessage("Update fail");
           req.setStatusCode(400);
       }
       return null;
   }
}
