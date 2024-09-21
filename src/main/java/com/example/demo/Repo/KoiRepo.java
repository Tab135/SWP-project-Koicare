package com.example.demo.Repo;

import com.example.demo.DTO.KoiFishModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KoiRepo extends JpaRepository<KoiFishModel, Integer> {
    List<KoiFishModel> findAllByPondId(int pondId);
    boolean existsByKoiName(String koiName);

}
