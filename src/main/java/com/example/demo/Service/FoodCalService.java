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
    public ReqResFood CalculateFood(int pond_id, int temperature, float desiredGrowth ){
        ReqResFood resp = new ReqResFood();
        float amount_of_food = 0;
        String feeding_time = "";
        String message = "";

        //temperature > 5 && temperature <= 8 ====> 1
        //temperature >= 9 && temperature <=12 ====> 2
        //temperature > 12 && temperature <=15 ====> 3
        //temperature > 15 && temperature <=20 ====> 4
        //temperature >20 && temperature <=28 ====> 5

        switch (temperature) {
            case 1:
                feeding_time = "every 2 - 3 days";
                message = "It is not recommended to feed when the temperature is below 5°C.";
                desiredGrowth -= 2 / 100.0f;
                break;
            case 2:
                feeding_time = "once every 2 - 3 days";
                message = "Feeding less frequently at this temperature helps prevent overfeeding.";
                desiredGrowth -= 1.5 / 100.0f;
                break;
            case 3:
                feeding_time = "1 - 2 times per day";
                message = "This temperature range is suitable for moderate feeding.";
                desiredGrowth -= 1 / 100.0f;
                break;
            case 4:
                feeding_time = "2 - 3 times per day";
                message = "Optimal temperature for more frequent feeding.";
                desiredGrowth -= 0.5 / 100.0f;
                break;
            case 5:
                feeding_time = "2 - 4 times per day";
                message = "It is not recommended to feed when the temperature is above 28°C.";
                break;
            default:
                message = "Invalid temperature range provided.";
                return resp;
        }

        Optional<PondModel> pondFind = pondRepo.findById(pond_id);
        List<KoiFishModel> koi = koiRepo.findAllByPondId(pondFind.get());
        if(!koi.isEmpty()){
            for (KoiFishModel koiFish : koi){
                double weight = koiFish.getWeight();

                amount_of_food += (float) (weight * desiredGrowth);
            }
        }
        amount_of_food = Math.round(amount_of_food * 100.0f) / 100.0f;
        resp.setFood_amount(amount_of_food);


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