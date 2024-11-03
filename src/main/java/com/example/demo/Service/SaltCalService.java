package com.example.demo.Service;

import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResSaltCal;
import com.example.demo.Repo.PondRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class SaltCalService {
    @Autowired
    private PondRepo pondRepo;
    public ReqResSaltCal saltCal(float Concentration, float waterChange, int pond_id ){
        ReqResSaltCal saltCal = new ReqResSaltCal();
        float volume = 0;
        Optional<PondModel> pond = pondRepo.findById(pond_id);
        if(pond.isPresent()){
            volume = pond.get().getVolume().floatValue();
        }
        float salt = (float) (volume * (Concentration / 100)); // calculate salt
        float waterChange_ = salt * (waterChange /100);
        salt += salt + waterChange_;
        saltCal.setSalt(Float.parseFloat(String.format("%.2f",salt)));
        saltCal.setWater_change_salt(Float.parseFloat(String.format("%.2f",waterChange_)));
        return saltCal;
    }

}
