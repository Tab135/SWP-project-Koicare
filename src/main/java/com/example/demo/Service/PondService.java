package com.example.demo.Service;

import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.PondRequest;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PondService {
    @Autowired
    private PondRepo pondR;
    private UserRepo userR;

    public PondModel createP(PondRequest request, int userId) {

        PondModel pondModel = new PondModel();
        try {
            pondModel.setUserId(userId);
            pondModel.setPondName(request.getPondName());
            pondModel.setPicture(request.getPicture());
            pondModel.setDepth(request.getDepth());
            pondModel.setVolume(request.getVolume());
            pondModel.setPumpingCapacity(request.getPumpingCapacity());


            pondModel.setDrain(request.getDrain());
            pondModel.setSkimmers(request.getSkimmers());
            pondModel.setLocation(request.getLocation());
            pondModel.setWaterSource(request.getWaterSource());
            pondModel.setMaintenanceSchedule(request.getMaintenanceSchedule());

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return pondR.save(pondModel);
    }

    //
    public List<PondModel> getPondsByUserId(int userId) {

       return pondR.findAllByUserId(userId);
    }

    public PondModel getPond(int pondId, int userId) {
        List<PondModel> pList = getPondsByUserId(userId);
        for(PondModel list: pList){
            if(list.getId() ==pondId){
                return list;
            }
        }
        return null;
    }


    public void deletePondById (int pondId){
        pondR.deleteById(pondId);
    }

    public PondModel updatePond(int userId, int pondId, PondRequest request){
        PondModel pond = getPond(pondId, userId);
        if(request.getPondName() !=null) {
            pond.setPondName(request.getPondName());//
        }
        if(request.getPicture() !=null) {
            pond.setPicture(request.getPicture());
        }
        if(request.getDepth() !=null) {
            pond.setDepth(request.getDepth());
        }
        if(request.getVolume() !=null) {
            pond.setVolume(request.getVolume());
        }

        if(request.getPumpingCapacity() !=null) {
            pond.setPumpingCapacity(request.getPumpingCapacity());
        }
        if(request.getDrain() !=null) {
            pond.setDrain(request.getDrain());
        }
        if(request.getSkimmers() !=null) {
            pond.setSkimmers(request.getSkimmers());
        }
        if(request.getLocation() !=null){
            pond.setLocation(request.getLocation());
        }
        if(request.getWaterSource() !=null){
            pond.setWaterSource(request.getWaterSource());
        }
        if(request.getMaintenanceSchedule() !=null){
            pond.setMaintenanceSchedule(request.getMaintenanceSchedule());
        }
        return pondR.save(pond);

    }




}
