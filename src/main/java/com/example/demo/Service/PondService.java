package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import com.example.demo.Repo.WaterRepo;
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
    @Autowired
    private WaterRepo waterR;
    public ResReqPond createP(ResReqPond request, int userId) {
        ResReqPond res = new ResReqPond();
        Optional<UserModel> user = userR.findById(userId);
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
        Optional<UserModel> user = userR.findById(userId);
        if(findPond.isPresent()) {
            if (!findPond.get().getUser().equals(user.get())) {
                res.setStatusCode(403);
                res.setError("Invalid user");
                return res;
            }

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
        waterR.deleteByPondId(pondId);
        pondR.deleteById(pondId);
    }

    public ResReqPond updatePond(int userId, int pondId, ResReqPond request){
        ResReqPond res = getPond(pondId, userId);
        PondModel pond = res.getPond();
        Optional<UserModel> user = userR.findById(userId);
        if(user.isEmpty()){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(404);
            result.setError("User not found");
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

    public ResReqPond moveAllFish (int pondId, int newPondId, int userId){
        ResReqPond res = new ResReqPond();
        Optional<PondModel> oldPond = pondR.findById(pondId);
        Optional<PondModel> newPond = pondR.findById(newPondId);
        Optional<UserModel> user = userR.findById(userId);
        if(oldPond.isEmpty()){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(404);
            result.setError("Pond not found");
            return result;
        } else if (newPond.isEmpty()) {
            ResReqPond result = new ResReqPond();
            result.setStatusCode(404);
            result.setError("Pond not found");
            return result;
        }

        if(!oldPond.get().getUser().equals(user.get()) || !newPond.get().getUser().equals(user.get())){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(403);
            result.setError("Invalid user");
            return result;
        }
        if(newPondId != pondId) {
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

        return  res;
    }

public ResReqPond moveFish (int oldPondId, int newPondId, int fishId, int userId){
    Optional<PondModel> oldPond = pondR.findById(oldPondId);
    Optional<PondModel> newPond = pondR.findById(newPondId);
    Optional<UserModel> user = userR.findById(userId);
    Optional<KoiFishModel> koi = koiR.findById(fishId);
    if(oldPond.isEmpty()){
        ResReqPond result = new ResReqPond();
        result.setStatusCode(404);
        result.setError("Pond not found");
        return result;
    }
    if(newPond.isEmpty()){
        ResReqPond result = new ResReqPond();
        result.setStatusCode(404);
        result.setError("Pond not found");
        return result;
    }
    if(!oldPond.get().getUser().equals(user.get()) || !newPond.get().equals(user.get())){
        ResReqPond result = new ResReqPond();
        result.setStatusCode(403);
        result.setError("Invalid user");
        return result;
    }
    if(koi.isEmpty()){
        ResReqPond res = new ResReqPond();
        res.setStatusCode(404);
        res.setError("Koi not found");
        return res;
    }


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

    public ResReqPond moveManyFish (int oldPondId, int newPondId, List<Integer> koiId, int userId){
        Optional<PondModel> oldPond = pondR.findById(oldPondId);
        Optional<PondModel> newPond = pondR.findById(newPondId);
        Optional<UserModel> user = userR.findById(userId);
        if(oldPond.isEmpty()){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(404);
            result.setError("Old pond not found");
            return result;
        }
        if(newPond.isEmpty()){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(404);
            result.setError("New pond not found");
            return result;
        }
        if(!oldPond.get().getUser().equals(user.get()) || !newPond.get().getUser().equals(user.get())){
            ResReqPond result = new ResReqPond();
            result.setStatusCode(403);
            result.setError("Invalid user");
            return result;
        }
        int fishMoved = 0;
        for(Integer id: koiId){
            Optional<KoiFishModel> koi = koiR.findById(id);
            if(koi.isPresent() && koi.get().getPondId().equals(oldPond.get())){
                koi.get().setPondId(newPond.get());
                koiR.save(koi.get());
                fishMoved++;
            }else{
                ResReqPond res = new ResReqPond();
                res.setStatusCode(404);
                res.setError("One or more not in old pond");
                return res;
            }
        }
        oldPond.get().setNumberOfFish(oldPond.get().getNumberOfFish()-fishMoved);
        newPond.get().setNumberOfFish(newPond.get().getNumberOfFish()+fishMoved);
        pondR.save(oldPond.get());
        PondModel result = pondR.save(newPond.get());
        ResReqPond res = new ResReqPond();
        res.setPond(result);
        res.setStatusCode(200);
        res.setMessage("Move success");
        return res;
    }

}
