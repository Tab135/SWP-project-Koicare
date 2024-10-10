package com.example.demo.DTO;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class KoiStatisticId implements Serializable {
    private Integer koiId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate date;

    public KoiStatisticId(LocalDate date, Integer koiId) {
        this.date = date;
        this.koiId = koiId;
    }

    public KoiStatisticId() {
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getKoiId() {
        return koiId;
    }

    public void setKoiId(Integer koiId) {
        this.koiId = koiId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KoiStatisticId that = (KoiStatisticId) o;
        return Objects.equals(koiId, that.koiId) &&
                Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(koiId, date);
    }


}
