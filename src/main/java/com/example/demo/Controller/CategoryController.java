package com.example.demo.Controller;

import com.example.demo.DTO.CategoryModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResCATE;
import com.example.demo.Service.CategoryManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class CategoryController {
    @Autowired
    private CategoryManagement cateM;
    @PostMapping("/auth/addCate")
    public ResponseEntity<ReqResCATE> addCate(@RequestBody ReqResCATE addCategory){
        return ResponseEntity.ok(cateM.addCate(addCategory));
    }
    @DeleteMapping("/auth/deleteCate/{cateId}")
    public ResponseEntity<ReqResCATE> deleCate(@PathVariable int cateId){
        return ResponseEntity.ok(cateM.deleteCate(cateId));
    }

    @PostMapping("/auth/updateCate/{cateId}")
    public ResponseEntity<ReqResCATE> updateCate(@PathVariable int cateId , @RequestBody CategoryModel detail){
        return ResponseEntity.ok(cateM.updateById(cateId,detail));
    }

    @GetMapping("/public/category")
    public ResponseEntity<List<CategoryModel>> showCate()
    {
        try{
            List<CategoryModel> cm = cateM.showCate(new CategoryModel());
                    if(cm.isEmpty()){
                        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
                    }else{
                        return ResponseEntity.ok(cm);
                    }
        }catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
