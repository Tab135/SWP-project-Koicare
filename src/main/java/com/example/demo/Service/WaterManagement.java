package com.example.demo.Service;

import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.WaterModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResWater;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import com.example.demo.Repo.WaterRepo;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class WaterManagement {
    @Autowired
    private WaterRepo waterRepository;
    @Autowired
    private PondRepo pondRepository;
    @Autowired
    private UserRepo userRepo;
    @Transactional
    public ReqResWater addWaterMeasurement(ReqResWater addWater, int pond_id) {
        ReqResWater req = new ReqResWater();

        try {
            // Retrieve pond based on ID from request
            Optional<PondModel> pm = pondRepository.findById(pond_id);
            if (pm.isEmpty()) {
                req.setMessage("Pond not found");
                req.setStatusCode(404);
                return req;
            }


            WaterModel monitorM = new WaterModel();
            monitorM.setPond(pm.get());
            monitorM.setDate(addWater.getDate());
            monitorM.setNitrite(addWater.getNitrite());
            monitorM.setNitrate(addWater.getNitrate());
            monitorM.setPhosphate(addWater.getPhosphate());
            monitorM.setAmmonium(addWater.getAmmonium());
            monitorM.setOxygen(addWater.getOxygen());
            monitorM.setHardnessGH(addWater.getHardnessGH());
            monitorM.setTemperature(addWater.getTemperature());
            monitorM.setpH(addWater.getpH()); // Ensure field and method names match in WaterModel
            monitorM.setCarbonHardnessKH(addWater.getCarbonHardnessKH());
            monitorM.setSalt(addWater.getSalt());
            monitorM.setCO2(addWater.getCO2());
            monitorM.setTotalChlorine(addWater.getTotalChlorine());
            monitorM.setOutdoorTemperature(addWater.getOutdoorTemperature());
            monitorM.setAmountFed(addWater.getAmountFed());

            // Save the water monitor data
            waterRepository.save(monitorM);

            // Set success response
            req.setMessage("Water monitor added successfully");
            req.setStatusCode(200);

        } catch (RuntimeException e) {
            // Capture full stack trace for troubleshooting
            e.printStackTrace();
            req.setMessage("Error while adding Water monitor: " + e.getMessage());
            req.setStatusCode(500);
        }

        return req;
    }
    @Transactional
    public ReqResWater deleteWater(int id)
    {
        ReqResWater req = new ReqResWater();
        try{
            Optional<WaterModel> wm = waterRepository.findById(id);
            if(wm.isPresent())
            {
            waterRepository.deleteById(id);
            req.setMessage("Delete successfully");
            req.setStatusCode(200);
            }else{
                req.setMessage("Water monitor not found");
                req.setStatusCode(404);
            }
        }catch (Exception e)
        {
            req.setMessage("Error while deleting water monitor: "  + e.getMessage());
            req.setStatusCode(500);
        }
        return req;
    }
    @Transactional
    public ReqResWater updateWater(int id, WaterModel updatedModel) {
        ReqResWater req = new ReqResWater();

        try {
            Optional<WaterModel> wm = waterRepository.findById(id);

            if (!wm.isPresent()) {
                req.setMessage("Water record not found");
                req.setStatusCode(404);
                return req;
            }

            // Get the existing water model
            WaterModel existingModel = wm.get();

            // Update fields with values from the provided model
            existingModel.setNitrite(updatedModel.getNitrite());
            existingModel.setNitrate(updatedModel.getNitrate());
            existingModel.setPhosphate(updatedModel.getPhosphate());
            existingModel.setAmmonium(updatedModel.getAmmonium());
            existingModel.setHardnessGH(updatedModel.getHardnessGH());
            existingModel.setOxygen(updatedModel.getOxygen());
            existingModel.setTemperature(updatedModel.getTemperature());
            existingModel.setpH(updatedModel.getpH());
            existingModel.setCarbonHardnessKH(updatedModel.getCarbonHardnessKH());
            existingModel.setSalt(updatedModel.getSalt());
            existingModel.setCO2(updatedModel.getCO2());
            existingModel.setTotalChlorine(updatedModel.getTotalChlorine());
            existingModel.setOutdoorTemperature(updatedModel.getOutdoorTemperature());
            existingModel.setAmountFed(updatedModel.getAmountFed());
            existingModel.setDate(updatedModel.getDate());

            // Save the updated model back to the database
            waterRepository.save(existingModel);

            req.setMessage("Water monitor updated successfully");
            req.setStatusCode(200);
        } catch (RuntimeException e) {
            req.setMessage("Error while updating Water monitor: " + e.getMessage());
            req.setStatusCode(500);
        }

        return req;
    }

    public ReqResWater getTemperature(int pondId){
        ReqResWater resp = new ReqResWater();
        List<WaterModel> water = waterRepository.findByPondIdOrderByIdDesc(pondId);
        resp.setTemperature(water.get(0).getTemperature());
        return resp;
    }

    public ReqResWater getWater(int pondId){
        ReqResWater resp = new ReqResWater();

        List<WaterModel> water = waterRepository.findAllByPondId(pondId);
        if(!water.isEmpty()){
            resp.setWaterModelList(water);
        }
        return resp;
    }

    public  ReqResWater detailsWater(int waterId){
        ReqResWater resp = new ReqResWater();

        Optional<WaterModel> water = waterRepository.findById(waterId);
        if(water.isPresent()){
            resp.setWaterModel(water.get());
            resp.setMessage("ok");
        }else {
            resp.setError("error water parameter not found");
        }
        return  resp;
    }

    public ReqResWater listAllByDateTime(LocalDateTime start, LocalDateTime end, int pondId, int userId){
        ReqResWater resp = new ReqResWater();
        Optional<PondModel> pond = pondRepository.findById(pondId);
        if(pond.isEmpty()){
            resp.setStatusCode(404);
            resp.setError("Pond not found");
            return resp;
        }
        if(pond.get().getUser().getId() != userId){
            resp.setStatusCode(403);
            resp.setError("Invalid user");
            return resp;
        }
        List<WaterModel> result = waterRepository.findAllByDateBetweenAndPondId(start, end, pondId);

        if (result != null && !result.isEmpty()) {
            resp.setStatusCode(200);
            resp.setMessage("Water list retrieved successfully");
            resp.setWaterModelList(result);
        } else {
            resp.setStatusCode(404);
            resp.setMessage("Water list empty");
        }
        return resp;
    }
}


