package com.example.demo.Repo;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KoiRepo extends JpaRepository<KoiFishModel, Integer> {
    List<KoiFishModel> findAllByPondId(PondModel pondId);
    KoiFishModel findByKoiNameAndPondIdAndKoiIdNot(String koiName, PondModel pondId, int koiId);
    boolean existsByKoiName(String koiName);
    Optional<KoiFishModel> findByKoiName(String koiName);
    List<KoiFishModel> findALlByUserId(UserModel user);

}
