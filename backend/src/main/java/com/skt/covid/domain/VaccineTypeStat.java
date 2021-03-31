package com.skt.covid.domain;

import javax.persistence.*;

@Table(name = "vaccine_type_stat")
@Entity
public class VaccineTypeStat {

    @Id
    @Column(name = "base_date")
    private String baseDate;

    @Column(name = "vaccine_type")
    private String vaccineType;

    @Column(name = "first_cnt")
    private int firstCnt;

    @Column(name = "second_cnt")
    private int secondCnt;

    public String getBaseDate() {
        return baseDate;
    }

    public void setBaseDate(String baseDate) {
        this.baseDate = baseDate;
    }

    public String getVaccineType() {
        return vaccineType;
    }

    public void setVaccineType(String vaccineType) {
        this.vaccineType = vaccineType;
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
}
