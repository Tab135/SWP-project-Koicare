package com.example.demo.Controller.Shop;
import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResProduct;
import com.example.demo.Service.Shop.ProductManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductManagement proM;

    @PostMapping("/shop/addPro")
    public ResponseEntity<ReqResProduct> addPro(
            @ModelAttribute ReqResProduct addProduct,
            @RequestParam(value = "productImage", required = false) MultipartFile imageFile) {
        ReqResProduct response = proM.addPro(addProduct, imageFile);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/shop/updatePro/{id}")
    public ResponseEntity<ReqResProduct> updatePro(
            @PathVariable int id,
            @ModelAttribute ReqResProduct detail, // Use @RequestBody to map the JSON payload
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        return ResponseEntity.ok(proM.updatePro(id, detail, imageFile));
    }
    @DeleteMapping("/shop/deletePro/{id}")
    public ResponseEntity<ReqResProduct> delePro(@PathVariable int id)
    {
        return ResponseEntity.ok(proM.delePro(id));
    }
    @GetMapping("/public/product")
    public ResponseEntity<List<ProductModel>> show()
    {
        try {
            List<ProductModel> pm = proM.showProduct(new ProductModel());
            if (pm.isEmpty()) {
                //return 204 if there no product
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.ok(pm);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/shop/product")
    public ResponseEntity<List<ProductModel>> shopShow()
    {
        try {
            List<ProductModel> pm = proM.showProduct(new ProductModel());
            if (pm.isEmpty()) {
                //return 204 if there no product
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.ok(pm);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/public/product/search/{id}")
    public ResponseEntity<ReqResProduct> searchByCateId(@PathVariable int id) {
       return ResponseEntity.ok(proM.searchByCategoryId(id));
    }



    @GetMapping("/public/product/{id}")
    public ResponseEntity<ReqResProduct> getProById(@PathVariable int id){
        return ResponseEntity.ok(proM.getProductById(id));
    }






}