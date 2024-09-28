package com.example.demo.Service;

import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PondService {
    @Autowired
    private PondRepo pondR;
    @Autowired
    private UserRepo userR;

    public ResReqPond createP(ResReqPond request, int userId) {
        ResReqPond res = new ResReqPond();
        Optional<UserModel> user = userR.findById(userId);
        List<PondModel> pList = getPondsByUserId(userId).getPondList();
        if(pList !=null) {
            for (PondModel list : pList) {
                if (list.getPondName().equals(request.getPondName())) {
                    res.setUserId(userId);
                    res.setError("Pond existed");
                    res.setStatusCode(409);
                    return res;

                }
            }
        }
        try {
            PondModel pondModel = new PondModel();
            pondModel.setUser(user.get());
            pondModel.setPondName(request.getPondName());
            pondModel.setPicture(request.getPicture());
            pondModel.setDepth(request.getDepth());
            pondModel.setVolume(request.getVolume());
            pondModel.setPumpingCapacity(request.getPumpingCapacity());
            pondModel.setDrain(request.getDrain());
            pondModel.setSkimmers(request.getSkimmers());
            pondModel.setLocation(request.getLocation());
            pondModel.setWaterSource(request.getWaterSource());

            PondModel result = pondR.save(pondModel);
            if(result.getId() >0){
                res.setMessage("Pond created successfully");
                res.setUserId(userId);
                res.setStatusCode(200);
                res.setPond(result);
            }
        } catch (Exception ex) {
            res.setStatusCode(500);
            res.setError(ex.getMessage());

        }

        return res;
    }

    //
    public ResReqPond getPondsByUserId(int userId) {
        ResReqPond res = new ResReqPond();
        List<PondModel> pondList = pondR.findAllByUserId(userId);
        if(pondList.isEmpty()){
            res.setUserId(userId);
            res.setStatusCode(404);
            res.setMessage("Pond's list is empty");

        }else{
            res.setUserId(userId);
            res.setStatusCode(200);
            res.setMessage("List");
            res.setPondList(pondList);
        }
        return res;
    }

    public ResReqPond getPond(int pondId, int userId) {
        List<PondModel> pList = getPondsByUserId(userId).getPondList();
        ResReqPond res = new ResReqPond();
        boolean existed = false;
        for(PondModel list: pList){
            if(list.getId() ==pondId){
                res.setStatusCode(200);
                res.setMessage("Found pond");
                res.setPond(list);
                existed = true;

            }
        }
        if(!existed){
            res.setStatusCode(404);
            res.setError("Pond not exist");
        }
        return res;
    }


    public void deletePondById (int pondId){
        pondR.deleteById(pondId);
    }

    public ResReqPond updatePond(int userId, int pondId, ResReqPond request){
        ResReqPond res = getPond(pondId, userId);
        PondModel pond = res.getPond();
        ResReqPond pList = getPondsByUserId(userId);
        for(PondModel list: pList.getPondList()){
            if(list.getPondName().equals(request.getPondName())){
                ResReqPond result = new ResReqPond();
                result.setStatusCode(409);
                result.setError("Pond existed");
                return result;
            }
        }
    try {
        if (res.getStatusCode() == 200) {
            if (request.getPondName() != null) {
                pond.setPondName(request.getPondName());//
            }
            if (request.getPicture() != null) {
                pond.setPicture(request.getPicture());
            }
            if (request.getDepth() != null) {
                pond.setDepth(request.getDepth());
            }
            if (request.getVolume() != null) {
                pond.setVolume(request.getVolume());
            }

            if (request.getPumpingCapacity() != null) {
                pond.setPumpingCapacity(request.getPumpingCapacity());
            }
            if (request.getDrain() != null) {
                pond.setDrain(request.getDrain());
            }
            if (request.getSkimmers() != null) {
                pond.setSkimmers(request.getSkimmers());
            }
            if (request.getLocation() != null) {
                pond.setLocation(request.getLocation());
            }
            if (request.getWaterSource() != null) {
                pond.setWaterSource(request.getWaterSource());
            }


            pondR.save(pond);
            res.setStatusCode(200);
            res.setMessage("Updated successfully");
            res.setPond(pond);
            return res;
        } else {
            return res;
        }
    }catch (Exception ex){
       res.setStatusCode(500);
       res.setError("Error in PondService: "+ex.getMessage());
    }
        return res;



    }




}
