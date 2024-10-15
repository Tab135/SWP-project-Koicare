package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.KoiRepo;
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
    @Autowired
    private KoiRepo koiR;
    public ResReqPond createP(ResReqPond request, int userId) {
        ResReqPond res = new ResReqPond();
        Optional<UserModel> user = userR.findById(userId);
        Optional<PondModel> checkPond = pondR.findByPondName(request.getPondName());
        if(checkPond.isPresent()){
            res.setError("Pond existed");
            res.setStatusCode(409);
            return res;
        }
        try {
            PondModel pondModel = new PondModel();
            pondModel.setUser(user.get());
            pondModel.setPondName(request.getPondName());
            if(request.getPicture() ==null){
                pondModel.setPicture(null);
            }else {
byte[] picByte =request.getPicture().getBytes();
                pondModel.setPicture(picByte);
            }
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
        ResReqPond res = new ResReqPond();
        Optional<PondModel> findPond = pondR.findById(pondId);
        if(findPond.isPresent()){
            res.setStatusCode(200);
            res.setMessage("Found pond");
            res.setPond(findPond.get());
            return res;
        }
            res.setStatusCode(404);
            res.setError("Pond not exist");

        return res;
    }


    public void deletePondById (int pondId){

        pondR.deleteById(pondId);
    }

    public ResReqPond updatePond(int userId, int pondId, ResReqPond request){
        ResReqPond res = getPond(pondId, userId);
        PondModel pond = res.getPond();
        ResReqPond pList = getPondsByUserId(userId);
        Optional<PondModel> checkName = pondR.findByPondName(request.getPondName());
        if(checkName.isPresent() && checkName.get().getId() != pondId){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(409);
            result.setError("Pond existed");
            return result;
        }


    try {
        if (res.getStatusCode() == 200) {
            if (request.getPondName() != null) {
                pond.setPondName(request.getPondName());//
            }
            if (request.getPicture() != null) {
                byte[] picByte =request.getPicture().getBytes();
                pond.setPicture(picByte);
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

    public ResReqPond moveAllFish (int pondId, int newPondId){
        ResReqPond res = new ResReqPond();
        Optional<PondModel> oldPond = pondR.findById(pondId);
        Optional<PondModel> newPond = pondR.findById(newPondId);
        if(newPond.isPresent() && oldPond.isPresent() &&newPondId != pondId) {
            List<KoiFishModel> koiList = koiR.findAllByPondId(oldPond.get());

            for (KoiFishModel koi : koiList) {
                koi.setPondId(newPond.get());
                koiR.save(koi);
            }


            PondModel upOldPond = oldPond.get();
            PondModel upNewPond = newPond.get();

            upNewPond.setNumberOfFish(upNewPond.getNumberOfFish() + upOldPond.getNumberOfFish());
            upOldPond.setNumberOfFish(0);
            pondR.save(upNewPond);
            pondR.save(upOldPond);
            res.setStatusCode(200);
            res.setMessage("Move success");
            res.setKoiList(koiR.findAllByPondId(upNewPond));

            return res;
        }
        res.setStatusCode(404);
        res.setError("Pond not found");
        return  res;
    }

public ResReqPond moveFish (int oldPondId, int newPondId, int fishId){
    Optional<PondModel> oldPond = pondR.findById(oldPondId);
    Optional<PondModel> newPond = pondR.findById(newPondId);
    Optional<KoiFishModel> koi = koiR.findById(fishId);
    if(oldPond.isPresent() && newPond.isPresent() && koi.isPresent()){
        koi.get().setPondId(newPond.get());
        oldPond.get().setNumberOfFish(oldPond.get().getNumberOfFish()-1);
        newPond.get().setNumberOfFish(newPond.get().getNumberOfFish()+1);
        koiR.save(koi.get());
        pondR.save(oldPond.get());
       PondModel result = pondR.save(newPond.get());
        ResReqPond res = new ResReqPond();
        res.setPond(result);
        res.setStatusCode(200);
        res.setMessage("Move success");
        return res;
    }
    if(koi.isEmpty()){
        ResReqPond res = new ResReqPond();
        res.setStatusCode(404);
        res.setError("Koi not found");
        return res;
    }
    if(oldPond.isEmpty()){
        ResReqPond res = new ResReqPond();
        res.setStatusCode(404);
        res.setError("Pond not exist");
        return res;
    }
    ResReqPond res = new ResReqPond();
    res.setStatusCode(404);
    res.setError("Pond not found");
    return res;
}


}
