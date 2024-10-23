package com.example.demo.Service;

import com.example.demo.DTO.GrowthRecord;
import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.KoiStatisticId;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResGrowth;
import com.example.demo.Repo.GrowthRecordRepo;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GrowthRecordService {
    @Autowired
    private GrowthRecordRepo growRepo;
    @Autowired
    private KoiRepo koiRepo;
    @Autowired
    private UserRepo userR;

    public ReqResGrowth addRecord(ReqResGrowth growth, Integer koiFishId, int userId){
        ReqResGrowth res = new ReqResGrowth();
        KoiStatisticId koiId = null;
        if(growth.getDate() !=null){
            koiId= new KoiStatisticId(growth.getDate(), koiFishId);
        }else {
            koiId = new KoiStatisticId(LocalDate.now(), koiFishId);
        }

        Optional<UserModel> user = userR.findById(userId);
        Optional<KoiFishModel> koi = koiRepo.findById(koiFishId);

        if(koi.isEmpty()){
            res.setStatusCode(404);
            res.setError("Koi fish not found");
            return res;
        }
        if(user.isEmpty()){
            res.setStatusCode(404);
            res.setError("User not exist");
            return res;
        }
        if(growRepo.existsByKoiId(koiId)){
            res.setError("Record existed");
            res.setStatusCode(409);
            return res;
        }
        if(!koi.get().getUserId().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }
        try{

            KoiFishModel koiFish = koi.get();


            Optional<GrowthRecord> preRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateLessThanOrderByKoiId_DateDesc(koiFishId, LocalDate.now());
            Double preWeight = null;
            Double preLength = null;

            if(preRecord.isPresent()){
                preWeight = preRecord.get().getWeight();
                preLength = preRecord.get().getLength();
            }

            GrowthRecord record = new GrowthRecord();
            record.setKoiId(koiId);

            record.setUpdateAt(LocalDateTime.now());
            record.setWeight(growth.getWeight());
            record.setLength(growth.getLength());
            record.setPhysique(growth.getPhysique());

        if(preRecord.isPresent()) {
            if (preRecord.get().getWeight() != null) {
                Double weightRate = ((growth.getWeight() - preWeight) / preWeight) * 100;
                record.setWeightRate(Math.max(weightRate,0.0));
            } else {
                record.setWeightRate(0.0);
            }

            if (preRecord.get().getLength() != null) {
                Double lengthRate = ((growth.getLength() - preLength) / preLength) * 100;
                record.setLengthRate(Math.max(lengthRate, 0.0));
            } else {
                record.setLengthRate(0.0);
            }

        }else{
            record.setWeightRate(0.0);
            record.setLengthRate(0.0);
        }
            record.setKoiFish(koiFish);
            GrowthRecord result = growRepo.save(record);

            Optional<GrowthRecord> latestRecord = growRepo.findFirstByKoiFish_KoiIdOrderByKoiId_DateDesc(koiFishId);

            if (latestRecord.isPresent() && !result.getKoiId().getDate().isBefore(latestRecord.get().getKoiId().getDate())) {
                koiFish.setWeight(growth.getWeight());
                koiFish.setLength(growth.getLength());
                koiFish.setPhysique(growth.getPhysique());
                koiRepo.save(koiFish);
            }
            else if(latestRecord.isEmpty()){
                koiFish.setWeight(growth.getWeight());
                koiFish.setLength(growth.getLength());
                koiFish.setPhysique(growth.getPhysique());
                koiRepo.save(koiFish);
            }

            Optional<GrowthRecord> nextRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateGreaterThanOrderByKoiId_DateAsc(koiFishId, result.getKoiId().getDate());
            if(nextRecord.isPresent()){
                Double weightRate = ((nextRecord.get().getWeight()-growth.getWeight())/growth.getWeight())*100;
                Double lengthRate = ((nextRecord.get().getLength()-growth.getLength())/growth.getLength())*100;
                nextRecord.get().setWeightRate(Math.max(weightRate, 0.0));
                nextRecord.get().setLengthRate(Math.max(lengthRate, 0.0));
                growRepo.save(nextRecord.get());


            }

            if(result.getKoiId() !=null ){
                res.setMessage("Growth record added successfully");
                res.setStatusCode(200);
                res.setGrowthRecord(result);

            }
        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError(ex.getMessage());
        }
    return res;
    }

    public ReqResGrowth getRecords(Integer koiFishId, int userId){
        ReqResGrowth res = new ReqResGrowth();
        Optional<KoiFishModel> koi = koiRepo.findById(koiFishId);
        Optional<UserModel> user = userR.findById(userId);
        if(koi.isEmpty()){
            res.setStatusCode(404);
            res.setError("Koi not found");
            return res;
        }
        if(!koi.get().getUserId().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }



        List<GrowthRecord> gList = growRepo.findByKoiFish_KoiIdOrderByKoiId_DateDesc(koiFishId);

        if(gList.isEmpty()){
            res.setError("This koi does not have any record");
            res.setStatusCode(404);
            return res;
        }
        else{
            res.setKoiFishId(koiFishId);
            res.setGrowthRecordList(gList);
            res.setMessage("Growth record");
            res.setStatusCode(200);
        }
        return res;
    }

    public ReqResGrowth getRecord(Integer koiFishId, LocalDate date, int userId){
        ReqResGrowth res = new ReqResGrowth();
        KoiStatisticId id = new KoiStatisticId(date, koiFishId);
        boolean exist = false;
        Optional<UserModel> user = userR.findById(userId);
        Optional<KoiFishModel> koi = koiRepo.findById(koiFishId);
        if(koi.isEmpty()){
            res.setStatusCode(404);
            res.setError("Koi not found");
            return res;
        }
        if(user.isEmpty()){
            res.setStatusCode(404);
            res.setError("User not exist");
            return res;
        }
        if(!koi.get().getUserId().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }


        Optional<GrowthRecord> growth = growRepo.findById(id);
        if(growth.isPresent()){
            res.setStatusCode(200);
            res.setMessage("Found record");
            res.setGrowthRecord(growth.get());
            exist = true;
        }

        if(!exist){
            res.setStatusCode(404);
            res.setError("Record not exist");
        }
        return res;
    }

    public void deleteRecord(KoiStatisticId id){
        Optional<KoiFishModel> koiCheck = koiRepo.findById(id.getKoiId());
        KoiFishModel koi = koiCheck.get();
//        GrowthRecord delRecord = getRecord(id.getKoiId(), id.getDate(), userId).getGrowthRecord();
        GrowthRecord delRecord = growRepo.findById(id).get();
        Optional<GrowthRecord> newest = growRepo.findFirstByKoiFish_KoiIdOrderByKoiId_DateDesc(id.getKoiId());
        Optional<GrowthRecord> oldest = growRepo.findFirstByKoiFish_KoiIdOrderByKoiId_DateAsc(id.getKoiId());
        if(delRecord.getKoiId().getDate().equals(newest.get().getKoiId().getDate())){
            Optional<GrowthRecord>  preRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateLessThanOrderByKoiId_DateDesc(id.getKoiId(), id.getDate());
            koi.setWeight(preRecord.get().getWeight());
            koi.setLength(preRecord.get().getLength());
            koi.setPhysique(preRecord.get().getPhysique());


            koiRepo.save(koi);
        }else if(delRecord.getKoiId().getDate().equals(oldest.get().getKoiId().getDate())){
            Optional<GrowthRecord> nextRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateGreaterThanOrderByKoiId_DateAsc(id.getKoiId(), id.getDate());
            nextRecord.get().setWeightRate(0.0);
            nextRecord.get().setLengthRate(0.0);
            growRepo.save(nextRecord.get());

        }

        else{
            //sau
            Optional<GrowthRecord> nextRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateGreaterThanOrderByKoiId_DateAsc(id.getKoiId(), id.getDate());
        //trc
            Optional<GrowthRecord> preRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateLessThanOrderByKoiId_DateDesc(id.getKoiId(), id.getDate());
            if(nextRecord.isPresent() && preRecord.isPresent()){
                Double weightRate = ((nextRecord.get().getWeight() - preRecord.get().getWeight())/preRecord.get().getWeight())*100;
               Double lengthRate = ((nextRecord.get().getLength()-preRecord.get().getLength())/preRecord.get().getLength())*100;
               nextRecord.get().setWeightRate(Math.max(weightRate, 0.0));
               nextRecord.get().setLengthRate(Math.max(lengthRate, 0.0));
               growRepo.save(nextRecord.get());

            }

        }



        growRepo.deleteById(id);
    }

    public ReqResGrowth updateRecord(ReqResGrowth request, Integer koiFishId, LocalDate date, int userId){
        ReqResGrowth res = getRecord(koiFishId, date, userId);
        GrowthRecord growth = res.getGrowthRecord();
        KoiFishModel koi = koiRepo.findById(koiFishId).orElseThrow();
        Optional<UserModel> user = userR.findById(userId);
        if(user.isPresent() && !koi.getUserId().equals(user.get())){
            ReqResGrowth result = new ReqResGrowth();
            result.setStatusCode(403);
            result.setError("Invalid user");
            return result;
        }


        try{
            if(res.getStatusCode()==200){
                if(request.getWeight() !=null){
                    growth.setWeight(request.getWeight());


                }
                if(request.getLength() !=null){
                    growth.setLength(request.getLength());

                }
                if(request.getPhysique() !=null){
                    growth.setPhysique(request.getPhysique());
                }

//                if(request.getUpdateAt() !=null && !request.getUpdateAt().equals(growth.getUpdateAt())){
//                    growth.setUpdateAt(request.getUpdateAt());
//                    res.setStatusCode(200);
//                    res.setMessage("Updated successfully");
//                    res.setGrowthRecord(growth);
//                    return res;
//                }

                GrowthRecord result = growRepo.save(growth);
                res.setStatusCode(200);
                res.setMessage("Updated successfully");
                res.setGrowthRecord(growth);
                Optional<GrowthRecord> nextRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateGreaterThanOrderByKoiId_DateAsc(koiFishId, result.getKoiId().getDate());
                if(nextRecord.isPresent()){
                    Double weightRate = ((nextRecord.get().getWeight()-growth.getWeight())/growth.getWeight())*100;
                    Double lengthRate = ((nextRecord.get().getLength()-growth.getLength())/growth.getLength())*100;
                    nextRecord.get().setWeightRate(Math.max(weightRate, 0.0));
                    nextRecord.get().setLengthRate(Math.max(lengthRate, 0.0));
                    growRepo.save(nextRecord.get());
                }else{
                    koi.setWeight(result.getWeight());
                    koi.setLength(result.getLength());
                    koi.setPhysique(result.getPhysique());
                    koiRepo.save(koi);
                }
                Optional<GrowthRecord> preRecord = growRepo.findFirstByKoiFish_KoiIdAndKoiId_DateLessThanOrderByKoiId_DateDesc(koiFishId, result.getKoiId().getDate());
                if(preRecord.isPresent()){
                    Double weightRate = ((growth.getWeight()-preRecord.get().getWeight())/preRecord.get().getWeight())*100;
                    Double lengthRate = ((growth.getLength()-preRecord.get().getLength())/preRecord.get().getLength())*100;
                    growth.setWeightRate(Math.max(weightRate, 0.0));
                    growth.setLengthRate(Math.max(lengthRate, 0.0));
                    growRepo.save(growth);
                }

            }else{
                return res;
            }

        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError(ex.getMessage());
        }
        return res;
    }




}
