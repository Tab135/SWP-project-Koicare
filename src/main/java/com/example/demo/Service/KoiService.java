package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.KoiRequest;
import com.example.demo.DTO.PondModel;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KoiService {
@Autowired
    private KoiRepo koiR;
@Autowired
    private PondRepo pondR;

public KoiFishModel addKoi(KoiRequest request, int pondId){
    KoiFishModel koi = new KoiFishModel();

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

    koi.setHealthStatus(request.getHealthStatus());
    koi.setLastMedicalCheck(request.getLastMedicalCheck());
    koi.setFeedingSchedule(request.getFeedingSchedule());
    koi.setImage(request.getImage());
    return koiR.save(koi);
}

public void deleteKoi(int koiId, int pondId){

    KoiFishModel koi = koiR.findById(koiId).orElseThrow(()->new RuntimeException("Not found"));
    PondModel pond = pondR.findById(pondId).orElseThrow(()->new RuntimeException(""));
    pond.setNumberOfFish(pond.getNumberOfFish() - 1);
    koiR.deleteById(koiId);
    pondR.save(pond);

}
  public List<KoiFishModel> getAllKoiByPondId(int pondId){
    return koiR.findAllByPondId(pondId);
  }

  public KoiFishModel getKoi(int pondId, int koiId){
    List<KoiFishModel> kList = getAllKoiByPondId(pondId);
    for(KoiFishModel k: kList){
        if(k.getKoiId()==koiId){
            return k;
        }
    }
    return null;
  }

  public KoiFishModel updateKoi(int pondId, int koiId, KoiRequest request){
        KoiFishModel koi = getKoi(pondId, koiId);
        if(request.getKoiName() !=null){
            koi.setKoiName(request.getKoiName());
        }

        if(request.getAge() !=null){
            koi.setAge(request.getAge());
        }
        if(request.getLength() !=null){
            koi.setLength(request.getLength());
        }
        if(request.getWeight() !=null){
            koi.setWeight(request.getWeight());
        }
        if(request.getSex() !=null){
            koi.setSex(request.getSex());
        }
        if(request.getVariety() !=null){
            koi.setVariety(request.getVariety());
        }
        if(request.getOrigin() !=null){
            koi.setOrigin(request.getOrigin());
        }
        if(request.getPrice() !=null){
            koi.setPrice(request.getPrice());
        }
        if(request.getPondId() !=null){
            koi.setPondId(request.getPondId());
        }
        if(request.getHealthStatus() !=null){
            koi.setHealthStatus(request.getHealthStatus());
        }
        if(request.getLastMedicalCheck() !=null){
            koi.setLastMedicalCheck(request.getLastMedicalCheck());
        }
        if(request.getFeedingSchedule() !=null){
            koi.setFeedingSchedule(request.getFeedingSchedule());
        }
        if(request.getImage() !=null){
            koi.setImage(request.getImage());
        }
        return koiR.save(koi);

  }

}
