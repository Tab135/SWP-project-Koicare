package com.example.demo.Repo;

import com.example.demo.DTO.GrowthRecord;
import com.example.demo.DTO.KoiStatisticId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GrowthRecordRepo extends JpaRepository<GrowthRecord, KoiStatisticId> {
    List<GrowthRecord> findByKoiFish_KoiIdOrderByKoiId_DateDesc (Integer koiId);
    Boolean existsByKoiId(KoiStatisticId koiId);
    void deleteAllByKoiFish_KoiId (Integer koiId);
   Optional<GrowthRecord> findFirstByKoiFish_KoiIdAndKoiId_DateLessThanOrderByKoiId_DateDesc(Integer koiId, LocalDate date); //tìm ngày trước đó
    Optional<GrowthRecord> findFirstByKoiFish_KoiIdOrderByKoiId_DateDesc (Integer koiId); //find newest
    Optional<GrowthRecord> findFirstByKoiFish_KoiIdOrderByKoiId_DateAsc(Integer koiId); //find oldest
    Optional<GrowthRecord> findFirstByKoiFish_KoiIdAndKoiId_DateGreaterThanOrderByKoiId_DateAsc (Integer koiId, LocalDate date); //tìm ngày tiếp theo

}
