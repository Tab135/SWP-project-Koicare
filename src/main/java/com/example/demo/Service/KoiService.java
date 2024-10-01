package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KoiService {
@Autowired
    private KoiRepo koiR;
@Autowired
    private PondRepo pondR;
@Autowired
    private UserRepo userR;
public ResReqKoi addKoi(ResReqKoi request, int pondId, int userId ){
    ResReqKoi res = new ResReqKoi();

    List<KoiFishModel> kList = getAllKoiByPondId(pondId).getKoiList();
    Optional<UserModel> user = userR.findById(userId);
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
    koi.setUserId(user.get());
    koi.setKoiName(request.getKoiName());
    koi.setPhysique(request.getPhysique());
    koi.setInPondSince(request.getInPondSince());
    koi.setBreeder(request.getBreeder());
    koi.setAge(request.getAge());
    koi.setLength(request.getLength());
    koi.setWeight(request.getWeight());
    koi.setSex(request.getSex());
    koi.setVariety(request.getVariety());
    koi.setOrigin(request.getOrigin());
    koi.setPrice(request.getPrice());

    PondModel pondModel = pondR.findById(pondId).orElseThrow();
    pondModel.setNumberOfFish(pondModel.getNumberOfFish() +1);
    koi.setPondId(pondModel);
    pondR.save(pondModel);

    if(request.getImage() ==null) {

        koi.setImage(null);
    }else{
        byte[] imageByte = request.getImage().getBytes();
        koi.setImage(imageByte);
    }
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
    PondModel pond = pondR.findById(pondId).orElseThrow();
    pond.setNumberOfFish(pond.getNumberOfFish() - 1);
    koiR.deleteById(koiId);
    pondR.save(pond);

}
  public ResReqKoi getAllKoiByPondId(int pondId){
    ResReqKoi res = new ResReqKoi();
    Optional<PondModel> pondFind = pondR.findById(pondId);
    List<KoiFishModel> kList = koiR.findAllByPondId(pondFind.orElse(null));
    if(kList.isEmpty() || kList ==null){
        res.setStatusCode(404);
        res.setMessage("Koi's list empty");
        return res;
    }
        res.setStatusCode(200);
        res.setMessage("List");
        res.setKoiList(kList);

    return res;
  }

  public ResReqKoi getKoi(int pondId, int koiId){
    List<KoiFishModel> kList = getAllKoiByPondId(pondId).getKoiList();
    ResReqKoi res = new ResReqKoi();

    if(kList ==null || kList.isEmpty()){
        res.setStatusCode(404);
        res.setError("koi not exist");
        return res;
    }

    for (KoiFishModel k : kList) {
        if (k.getKoiId() == koiId) {

            res.setStatusCode(200);
            res.setMessage("Found koi");
            res.setKoi(k);
            return res;
        }

    }


        res.setStatusCode(404);
        res.setError("Koi not exist");

    return res;
  }

  public ResReqKoi updateKoi(int pondId, int koiId, ResReqKoi request){
        KoiFishModel koi = getKoi(pondId, koiId).getKoi();
       Optional<PondModel> pond = pondR.findById(pondId);
        ResReqKoi res = getKoi(pondId, koiId);

      if(!pond.isPresent()){
          ResReqKoi result = new ResReqKoi();
          result.setStatusCode(404);
          result.setError("Pond not found");
          return result;
      }

        ResReqKoi koiList = getAllKoiByPondId(pondId);
        if(koiList ==null || koiList.getKoiList() ==null || koiList.getKoiList().isEmpty()){
          ResReqKoi result = new ResReqKoi();
          result.setStatusCode(404);
          result.setError("koi's list empty");
          return result;
      }
        boolean exist = false;
      if(request.getPondId() != pondId) {
          try{
          ResReqKoi newPond = getAllKoiByPondId(request.getPondId());
          if (newPond.getKoiList() != null) {
              for (KoiFishModel n : newPond.getKoiList()) {
                  if (n.getKoiName().equals(request.getKoiName())) {
                      exist = true;
                  }
              }
          }}catch(Exception ex) {

              if(exist){
                  ResReqKoi result = new ResReqKoi();
                  result.setStatusCode(409);
                  result.setMessage("Koi with the same name already in pond");
                  return result;
              }

          }
      }


      for(KoiFishModel k: koiList.getKoiList()){
          try {
              if (k.getKoiName().equals(request.getKoiName()) && exist && koiId != k.getKoiId()) {
                  ResReqKoi result = new ResReqKoi();
                  result.setStatusCode(409);
                  result.setError("Koi existed");
                  return result;
              }
          }catch (Exception ex){

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
                if (!request.getPondId().equals(pondId)) {

                    PondModel oldPond = pondR.findById(pondId).orElseThrow();
                    oldPond.setNumberOfFish(oldPond.getNumberOfFish() -1);
                    pondR.save(oldPond);

                    PondModel pondModel = pondR.findById(request.getPondId()).orElseThrow();
                    pondModel.setNumberOfFish(pondModel.getNumberOfFish() +1);
                    koi.setPondId(pondModel);
                    pondR.save(pondModel);
                    koi.setPondId(pondModel);
                }


               if (request.getImage() != null) {

                   byte[] imageByte = request.getImage().getBytes();
                   koi.setImage(imageByte);
               }

                if(request.getPhysique() !=null){
                    koi.setPhysique(request.getPhysique());
                }
                if(request.getInPondSince() !=null){
                    koi.setInPondSince(request.getInPondSince());
                }
                if(request.getBreeder() !=null){
                    koi.setBreeder(request.getBreeder());
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
            return res;
        }

  }

}
