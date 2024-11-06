package com.example.demo.Service;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResGrowth;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    @Autowired
    private GrowthRecordService gService;

    public ResReqKoi addKoi(ResReqKoi request, int pondId, int userId) {
        ResReqKoi res = new ResReqKoi();

        Optional<UserModel> user = userR.findById(userId);
        Optional<PondModel> pond = pondR.findById(pondId);
        if(pond.isPresent() && !pond.get().getUser().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }

        if (!pondR.existsById(pondId)) {
            res.setStatusCode(404);
            res.setError("Pond not found");
            return res;
        }
        try {

            KoiFishModel koi = new KoiFishModel();
            koi.setUserId(user.get());
            koi.setKoiName(request.getKoiName());

            koi.setInPondSince(request.getInPondSince());
            koi.setBreeder(request.getBreeder());
            koi.setAge(request.getAge());

            koi.setPhysique(request.getPhysique());
            koi.setLength(request.getLength());
            koi.setWeight(request.getWeight());

            koi.setSex(request.getSex());
            koi.setVariety(request.getVariety());
            koi.setOrigin(request.getOrigin());
            koi.setPrice(request.getPrice());

            PondModel pondModel = pondR.findById(pondId).orElseThrow();
            pondModel.setNumberOfFish(pondModel.getNumberOfFish() + 1);
            koi.setPondId(pondModel);
            pondR.save(pondModel);

            if (request.getImage() == null) {

                koi.setImage(null);
            } else {
                byte[] imageByte = request.getImage().getBytes();
                koi.setImage(imageByte);
            }
            KoiFishModel result = koiR.save(koi);
            if (result.getKoiId() > 0) {
                ReqResGrowth growthR = new ReqResGrowth();
                growthR.setPhysique(request.getPhysique());
                growthR.setLength(request.getLength());
                growthR.setWeight(request.getWeight());
                growthR.setDate(request.getInPondSince());
                gService.addRecord(growthR, koi.getKoiId(), userId);
                res.setMessage("Koi added");
                res.setStatusCode(200);
                res.setKoi(result);
            }
        } catch (Exception ex) {
            res.setStatusCode(500);
            res.setError(ex.getMessage());
        }
        return res;
    }

    public void deleteKoi(int koiId, int pondId) {

        PondModel pond = pondR.findById(pondId).orElseThrow();
        pond.setNumberOfFish(pond.getNumberOfFish() - 1);
        koiR.deleteById(koiId);
        pondR.save(pond);

    }

    public void deleteWithoutId(int koiId){
        KoiFishModel koi = koiR.findById(koiId).get();
        PondModel pond = koi.getPondId();
        pond.setNumberOfFish(pond.getNumberOfFish()-1);
        koiR.delete(koi);
        pondR.save(pond);
    }

    public ResReqKoi getAllKoiByPondId(int pondId, int userId) {
        ResReqKoi res = new ResReqKoi();
        Optional<UserModel> user = userR.findById(userId);
        Optional<PondModel> pondFind = pondR.findById(pondId);
        List<KoiFishModel> kList = koiR.findAllByPondId(pondFind.orElse(null));
        if(pondFind.isEmpty()){
            res.setStatusCode(404);
            res.setError("Pond not found");
            return res;
        }
        if(!pondFind.get().getUser().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }

        if (kList.isEmpty()) {
            res.setStatusCode(404);
            res.setMessage("Koi's list empty");
            return res;
        }
        res.setStatusCode(200);
        res.setMessage("List");
        res.setKoiList(kList);

        return res;
    }

    public ResReqKoi getKoi(int koiId, int userId) {
        ResReqKoi res = new ResReqKoi();
        Optional<KoiFishModel> koi = koiR.findById(koiId);
        Optional<UserModel> user = userR.findById(userId);

        if(user.isPresent() &&!koi.get().getUserId().equals(user.get())){
            res.setStatusCode(403);
            res.setError("Invalid user");
            return res;
        }
        if (koi.isPresent()) {
            res.setStatusCode(200);
            res.setMessage("Found koi");
            res.setKoi(koi.get());
            return res;
        }
        res.setStatusCode(404);
        res.setError("Koi not exist");

        return res;
    }

    public ResReqKoi updateKoi(int pondId, int koiId, ResReqKoi request, int userId) {
        KoiFishModel koi = getKoi(koiId, userId).getKoi();
        Optional<UserModel> user = userR.findById(userId);
        Optional<PondModel> pond = pondR.findById(pondId);
        ResReqKoi res = getKoi(koiId, userId);
        if(pond.isPresent() && !pond.get().getUser().equals(user.get())){
            res.setStatusCode(403);
            res.setError("invalid user");
            return res;
        }
        Optional<PondModel> newPond = pondR.findById(request.getPondId());
        if(newPond.isPresent() && !newPond.get().getUser().equals(user.get())){
            res.setStatusCode(403);
            res.setError("invalid user");
            return res;
        }

        if (pond.isEmpty()) {
            ResReqKoi result = new ResReqKoi();
            result.setStatusCode(404);
            result.setError("Pond not found");
            return result;
        }

        List<KoiFishModel> kList = koiR.findAllByPondId(pond.get());
        if(kList.isEmpty()){
            ResReqKoi result = new ResReqKoi();
            result.setStatusCode(404);
            result.setError("koi's list empty");
            return result;
        }


            try {
                if (res.getStatusCode() == 200) {
                    if (request.getKoiName() != null) {
                        koi.setKoiName(request.getKoiName());
                    }

                    if (request.getAge() != null) {
                        koi.setAge(request.getAge());
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
                    if (!request.getPondId().equals(koi.getPondId().getId())) {

                        PondModel oldPond = pondR.findById(pondId).orElseThrow();
                        oldPond.setNumberOfFish(oldPond.getNumberOfFish() - 1);
                        pondR.save(oldPond);

                        PondModel pondModel = pondR.findById(request.getPondId()).orElseThrow();
                        pondModel.setNumberOfFish(pondModel.getNumberOfFish() + 1);
                        koi.setPondId(pondModel);
                        pondR.save(pondModel);
                        koi.setPondId(pondModel);
                    }


                    if (request.getImage() != null) {

                        byte[] imageByte = request.getImage().getBytes();
                        koi.setImage(imageByte);
                    }


                    if (request.getInPondSince() != null) {
                        koi.setInPondSince(request.getInPondSince());
                    }
                    if (request.getBreeder() != null) {
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
            } catch (Exception ex) {
                res.setStatusCode(500);
                res.setError("Error in KoiService: " + ex.getMessage());
                return res;
            }

        }

        public ResReqKoi listKoi(int userId){
        ResReqKoi res = new ResReqKoi();
        Optional<UserModel> user = userR.findById(userId);
        if(user.isEmpty()){
            res.setStatusCode(404);
            res.setError("Invalid user");
            return res;
        }
        List<KoiFishModel> kList  = koiR.findALlByUserId(user.get());
            if(kList.isEmpty()){
                res.setStatusCode(404);
                res.setError("Empty");
                return res;
            }
            res.setStatusCode(200);
            res.setMessage("Found");
            res.setKoiList(kList);
            return res;

        }

    }




