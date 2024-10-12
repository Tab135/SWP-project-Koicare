package JUnit;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.example.demo.DTO.CategoryModel;
import com.example.demo.DTO.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResProduct;
import com.example.demo.Repo.CategoryRepo;
import com.example.demo.Repo.ProductRepo;
import com.example.demo.Service.ProductManagement;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
@ExtendWith(MockitoExtension.class)
class TestProduct{
    @InjectMocks
    private ProductManagement proM;
    @Mock
    private ProductRepo proRepository;
    @Mock
    private CategoryRepo cateRepository;
    @Test
    void TestaddProduct()
    {
        ReqResProduct invalid = new ReqResProduct();
        invalid.setName(null);
        invalid.setAmount(200);
        invalid.setPrice(10);
        invalid.setStockQuantity(10);
        invalid.setCategoryId(1);
        ReqResProduct req = proM.addPro(invalid, (MultipartFile) null);
        assertEquals("Invalid product data", req.getMessage());
    }
    @Test
    void TestaddProduct2()
    {
        ReqResProduct invalid = new ReqResProduct();
        invalid.setName("loc");
        invalid.setAmount(200);
        invalid.setPrice(10);
        invalid.setStockQuantity(10);
        invalid.setCategoryId(4);
        ReqResProduct req = proM.addPro(invalid, (MultipartFile) null);
        assertEquals("Category not found", req.getMessage());
    }
    @Test
    void TestDelteProduct(){
        ProductModel pm = new ProductModel();
        int id = 1;
        pm.setId(id);
        when(proRepository.findById(id)).thenReturn(Optional.of(pm));
        ReqResProduct req = proM.delePro(id);
        assertEquals("Delete Successfully", req.getMessage());
    }
    @Test
    void TestDeleteProduct2(){
        ProductModel pm = new ProductModel();
        int id = 999;
        pm.setId(id);
        when(proRepository.findById(id)).thenReturn(Optional.empty());
        ReqResProduct req = proM.delePro(id);
        assertEquals("Product not found", req.getMessage());
    }

}
