package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.DTO.PondModel;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KoiService {
@Autowired
    private KoiRepo koiR;
@Autowired
    private PondRepo pondR;

public ResReqKoi addKoi(ResReqKoi request, int pondId, int userId){
    ResReqKoi res = new ResReqKoi();
    List<KoiFishModel> kList = getAllKoiByPondId(pondId).getKoiList();
    if(kList !=null){

        for (KoiFishModel koi : kList) {
            if (koi.getKoiName().equals(request.getKoiName())) {
                res.setError("Koi's name existed");
                res.setStatusCode(409);
                return res;
            }
        }
    }
    if(!pondR.existsById(pondId)){
        res.setStatusCode(404);
        res.setError("Pond not found");
        return res;
    }
    try{

    KoiFishModel koi = new KoiFishModel();
    koi.setUserId(userId);
    koi.setKoiName(request.getKoiName());
    koi.setAge(request.getAge());
    koi.setLength(request.getLength());
    koi.setWeight(request.getWeight());
    koi.setSex(request.getSex());
    koi.setVariety(request.getVariety());
    koi.setOrigin(request.getOrigin());
    koi.setPrice(request.getPrice());

    PondModel pondModel = pondR.findById(pondId).orElseThrow(() ->new RuntimeException("Pond not found."));
    pondModel.setNumberOfFish(pondModel.getNumberOfFish() +1);
    koi.setPondId(pondId);
    pondR.save(pondModel);


    koi.setLastMedicalCheck(request.getLastMedicalCheck());
    koi.setFeedingSchedule(request.getFeedingSchedule());
    koi.setImage(request.getImage());

    KoiFishModel result = koiR.save(koi);
    if(koi.getKoiId() >0){
        res.setMessage("Koi added");
        res.setStatusCode(200);
        res.setKoi(result);
    }
    }catch(Exception ex){
        res.setStatusCode(500);
        res.setError(ex.getMessage());
    }
    return res;
}

public void deleteKoi(int koiId, int pondId){

    KoiFishModel koi = koiR.findById(koiId).orElseThrow(()->new RuntimeException("Not found"));
    PondModel pond = pondR.findById(pondId).orElseThrow(()->new RuntimeException(""));
    pond.setNumberOfFish(pond.getNumberOfFish() - 1);
    koiR.deleteById(koiId);
    pondR.save(pond);

}
  public ResReqKoi getAllKoiByPondId(int pondId){
    ResReqKoi res = new ResReqKoi();
    List<KoiFishModel> kList = koiR.findAllByPondId(pondId);
    if(kList.isEmpty()){
        res.setStatusCode(404);
        res.setMessage("Koi's list empty");
    }else{
        res.setStatusCode(200);
        res.setMessage("List");
        res.setKoiList(kList);
    }
    return res;
  }

  public ResReqKoi getKoi(int pondId, int koiId){
    List<KoiFishModel> kList = getAllKoiByPondId(pondId).getKoiList();
    ResReqKoi res = new ResReqKoi();
    boolean exist = false;

    for(KoiFishModel k: kList){
        if(k.getKoiId()==koiId){
            exist = true;
            res.setStatusCode(200);
            res.setMessage("Found koi");
            res.setKoi(k);
        }

    }
    if(!exist){
        res.setStatusCode(404);
        res.setError("Koi not exist");
    }
    return res;
  }

  public ResReqKoi updateKoi(int pondId, int koiId, ResReqKoi request){
        KoiFishModel koi = getKoi(pondId, koiId).getKoi();
        ResReqKoi res = getKoi(pondId, koiId);
        ResReqKoi koiList = getAllKoiByPondId(pondId);
        for(KoiFishModel k: koiList.getKoiList()){
            if(k.getKoiName().equals(request.getKoiName())){
                ResReqKoi result = new ResReqKoi();
                result.setStatusCode(409);
                result.setError("Koi's name existed");
                return result;
            }
        }
        try {
            if (res.getStatusCode() == 200) {
                if (request.getKoiName() != null) {
                    koi.setKoiName(request.getKoiName());
                }

                if (request.getAge() != null) {
                    koi.setAge(request.getAge());
                }
                if (request.getLength() != null) {
                    koi.setLength(request.getLength());
                }
                if (request.getWeight() != null) {
                    koi.setWeight(request.getWeight());
                }
                if (request.getSex() != null) {
                    koi.setSex(request.getSex());
                }
                if (request.getVariety() != null) {
                    koi.setVariety(request.getVariety());
                }
                if (request.getOrigin() != null) {
                    koi.setOrigin(request.getOrigin());
                }
                if (request.getPrice() != null) {
                    koi.setPrice(request.getPrice());
                }
                if (request.getPondId() != null) {
                    koi.setPondId(request.getPondId());
                }

                if (request.getLastMedicalCheck() != null) {
                    koi.setLastMedicalCheck(request.getLastMedicalCheck());
                }
                if (request.getFeedingSchedule() != null) {
                    koi.setFeedingSchedule(request.getFeedingSchedule());
                }
                if (request.getImage() != null) {
                    koi.setImage(request.getImage());
                }

                koiR.save(koi);
                res.setStatusCode(200);
                res.setMessage("Updated successfully");
                res.setKoi(koi);
                return res;
            } else {
                return res;
            }
        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError("Error in KoiService: "+ex.getMessage());
        }
        return res;
  }

}
