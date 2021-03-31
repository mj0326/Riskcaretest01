package com.skt.covid.domain;

import javax.persistence.*;
import java.time.LocalDateTime;

@IdClass(VaccineStatPK.class)
@Table(name = "vaccine_stat")
@Entity
public class VaccineStat {

    @Id
    @Column(name = "base_date")
    private String baseDate;

    @Id
    @Column(name = "si_do")
    private String siDo;

    @Column(name = "location_cd")
    private String locationCd;

    @Column(name = "first_cnt")
    private int firstCnt;

    @Column(name = "second_cnt")
    private int secondCnt;

    @Column(name = "total_first_cnt")
    private int totalFirstCnt;

    @Column(name = "total_second_cnt")
    private int totalSecondCnt;

    @Column(name = "accumulated_first_cnt")
    private int accumulatedFirstCnt;

    @Column(name = "accumulated_second_cnt")
    private int accumulatedSecondCnt;

    public String getBaseDate() {
        return baseDate;
    }

    public void setBaseDate(String baseDate) {
        this.baseDate = baseDate;
    }

    public String getSiDo() {
        return siDo;
    }

    public void setSiDo(String siDo) {
        this.siDo = siDo;
    }

    public String getLocationCd() {
        return locationCd;
    }

    public void setLocationCd(String locationCd) {
        this.locationCd = locationCd;
    }

    public int getFirstCnt() {
        return firstCnt;
    }

    public void setFirstCnt(int firstCnt) {
        this.firstCnt = firstCnt;
    }

    public int getSecondCnt() {
        return secondCnt;
    }

    public void setSecondCnt(int secondCnt) {
        this.secondCnt = secondCnt;
    }

    public int getTotalFirstCnt() {
        return totalFirstCnt;
    }

    public void setTotalFirstCnt(int totalFirstCnt) {
        this.totalFirstCnt = totalFirstCnt;
    }

    public int getTotalSecondCnt() {
        return totalSecondCnt;
    }

    public void setTotalSecondCnt(int totalSecondCnt) {
        this.totalSecondCnt = totalSecondCnt;
    }

    public int getAccumulatedFirstCnt() {
        return accumulatedFirstCnt;
    }

    public void setAccumulatedFirstCnt(int accumulatedFirstCnt) {
        this.accumulatedFirstCnt = accumulatedFirstCnt;
    }

    public int getAccumulatedSecondCnt() {
        return accumulatedSecondCnt;
    }

    public void setAccumulatedSecondCnt(int accumulatedSecondCnt) {
        this.accumulatedSecondCnt = accumulatedSecondCnt;
    }
}
