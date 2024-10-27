package com.example.demo.Service;
import com.example.demo.DTO.RevenueModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResRevenue;
import com.example.demo.Repo.RevenueRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class RevenueService {

    @Autowired
    private RevenueRepo revenueRepo;
    @Autowired
    private UserRepo userRepo;

    public ReqResRevenue create(int userid, ReqResRevenue reqResRevenue) {
        ReqResRevenue resp = new ReqResRevenue();
        UserModel user = userRepo.findById(userid).orElseThrow();
        RevenueModel revenueModel = new RevenueModel();
        revenueModel.setUser(user);
        revenueModel.setAmount(reqResRevenue.getAmount());
        revenueModel.setDate(LocalDate.now());
        RevenueModel result = revenueRepo.save(revenueModel);
        if (result.getId() > 0) {
            resp.setAmount(reqResRevenue.getAmount());
            resp.setDate(reqResRevenue.getDate());
            resp.setMessage("Revenue created successfully");
        } else {
            resp.setMessage("Error creating revenue");
        }
        return reqResRevenue;
    }

    public ReqResRevenue listAllByDate(LocalDate start, LocalDate end) {
        ReqResRevenue resp = new ReqResRevenue();
        List<RevenueModel> result = revenueRepo.findAllByDateBetween(start, end);
        if (result != null && result.size() > 0) {
            resp.setMessage("Revenue list retrieved successfully");
            resp.setRevenueModelList(result);
        } else {
            resp.setMessage("Revenue list empty");
        }
        return resp;
    }

    public ReqResRevenue listAllRevenue() {
        ReqResRevenue resp = new ReqResRevenue();
        List<RevenueModel> revenueList = revenueRepo.findAll();
        BigDecimal totalRevenue = BigDecimal.ZERO; // Initialize total revenue

        if (revenueList != null && !revenueList.isEmpty()) {
            for (RevenueModel revenue : revenueList) {
                totalRevenue = totalRevenue.add(revenue.getAmount()); // Sum amounts
            }
            resp.setRevenueModelList(revenueList);
            resp.setTotalAmount(totalRevenue); // Assuming you add this field in ReqResRevenue
            resp.setMessage("Revenue list retrieved successfully, total: " + totalRevenue);
        } else {
            resp.setMessage("Revenue list empty");
        }
        return resp;
    }
}

