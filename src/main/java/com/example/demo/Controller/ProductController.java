package com.example.demo.Controller;

import com.example.demo.DTO.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResProduct;
import com.example.demo.Service.ProductManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductManagement proM;
    @PostMapping("/auth/addPro")
    public ResponseEntity<ReqResProduct> addPro(@RequestBody ReqResProduct addProduct)
    {
        return ResponseEntity.ok(proM.addPro(addProduct));
    }
    @DeleteMapping("/auth/deletePro/{id}")
    public ResponseEntity<ReqResProduct> delePro(@PathVariable int id)
    {
        return ResponseEntity.ok(proM.delePro(id));
    }
    @PostMapping("/auth/updatePro/{id}")
    public ResponseEntity<ReqResProduct> updatePro(@PathVariable int id, @RequestBody ProductModel detail)
    {
        return ResponseEntity.ok(proM.updatePro(id,detail));
    }
}
