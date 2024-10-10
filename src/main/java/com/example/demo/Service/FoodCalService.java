package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResFood;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodCalService {

    @Autowired
    private KoiRepo koiRepo;
    @Autowired
    private PondRepo pondRepo;
    public ReqResFood CalculateFood(int pond_id, int temperature, int desireGrowth ){
        ReqResFood resp = new ReqResFood();
        float amount_when_split = 0;
        float amount_of_food = 0;
        float food = 0;
        String feeding_time = "";
        String message = "";
        if(desireGrowth == 1){
            food = 2.0f /100.0f;
        }
        else if(desireGrowth == 2){
            food = 3.0f /100.0f;
        }
        else if(desireGrowth == 3){
            food = 4.0f /100.0f;
        }
        Optional<PondModel> pondFind = pondRepo.findById(pond_id);
        List<KoiFishModel> koi = koiRepo.findAllByPondId(pondFind.get());
        if(!koi.isEmpty()){
            for (KoiFishModel koiFish : koi){
                double weight = koiFish.getWeight();

                amount_of_food += weight * food;
            }
        }
        amount_of_food = Math.round(amount_of_food * 100.0f) / 100.0f;
        resp.setFood_amount(amount_of_food);
        //amount_when_split = amount_of_food / food_split;
        //resp.setFood_split(amount_when_split);

        //temperature > 5 && temperature <= 8 ====> 1
        //temperature >= 9 && temperature <=12 ====> 2
        //temperature > 12 && temperature <=15 ====> 3
        //temperature > 15 && temperature <=20 ====> 4
        //temperature >20 && temperature <=28 ====> 5

        if (temperature == 1){
            feeding_time = "every 2 - 3 days";
            message = "It is not recommend to feed when below 5 Degree Celsius";
        } else if (temperature == 2) {
            feeding_time = "1 per 2 - 3 days";
        } else if (temperature == 3) {
            feeding_time = "1 - 2 per day";
        }else if (temperature == 4){
            feeding_time = "2 - 3 per day";
        } else if (temperature == 5) {
            feeding_time = "2 - 4 per day";
            message = "It is not recommend to feed when above 28 Degree Celsius";
        }
        resp.setMessage(message);
        resp.setFeeding_time(feeding_time);
        return resp;
    }


}
//temperature / feeding time
//6 - 8 = 1 - 2 day
// 9 - 12 = 1 - 2 per day
// 13 - 16 = 2 - 3 per day
// 17 - 20 = 2 - 3 per day
// 21 - 28 = 2 - 4 per day