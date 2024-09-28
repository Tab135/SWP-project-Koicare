package com.example.demo.Service;


import com.example.demo.DTO.RegistrationForm;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResRegistrationForm;
import com.example.demo.Repo.RegistrationFormRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistationFormManagement {

    @Autowired
    private RegistrationFormRepo registrationFormRepo;

    @Autowired
    private UserRepo userRepo;

    public ReqResRegistrationForm createSignup(ReqResRegistrationForm shopSignup, int userId) {
        RegistrationForm rf = new RegistrationForm();
        ReqResRegistrationForm resp = new ReqResRegistrationForm();
        try {
            UserModel user = userRepo.findById(userId).orElseThrow(() -> new UsernameNotFoundException("Error finding user"));
            rf.setUser(user);
            rf.setSubmittedAt(LocalDateTime.now());
            rf.setShopName(shopSignup.getName());
            rf.setBank(shopSignup.getBank());
            rf.setAddress(shopSignup.getAddress());
            rf.setAdditionalInfo(shopSignup.getAdditional_info());
            rf.setBank_name(shopSignup.getBank_name());
            rf.setPhone(shopSignup.getPhone());
            rf.setStatus("Pending");
            RegistrationForm result = registrationFormRepo.save(rf);
            if(result.getFormId() > 0){
                resp.setMessage("Successfully verified");
                resp.setStatusCode(200);

            }
        }
        catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;

    }

//    public Optional<RegistrationForm> getSignupById(int id) {
//        return registrationFormRepo.findById(id);
//    }

    public ReqResRegistrationForm getAllSignups() {
        ReqResRegistrationForm resp = new ReqResRegistrationForm();
        try{
            List<RegistrationForm> result = registrationFormRepo.findAll();
            if(!result.isEmpty()){
                resp.setRFformList(result);
                resp.setStatusCode(200);
            }else {
                resp.setStatusCode(404);
                resp.setMessage("No Form found");
            }
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

//    public List<RegistrationForm> getSignupsByStatus(String status) {
//        return registrationFormRepo.findByStatus(status);
//    }


//    public RegistrationForm updateSignup(RegistrationForm shopSignup) {
//        return registrationFormRepo.save(shopSignup);
//    }

//    public void deleteSignup(int id) {
//        registrationFormRepo.deleteById(id);
//    }

    public RegistrationForm approveSignup(int id) {
        RegistrationForm signup = registrationFormRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signup not found"));
        signup.setStatus("approved");
        return registrationFormRepo.save(signup);
    }

    public RegistrationForm rejectSignup(int id) {
        RegistrationForm signup = registrationFormRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signup not found"));
        signup.setStatus("rejected");
        return registrationFormRepo.save(signup);
    }
}