package com.skt.covid.domain;


import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
@Table(name = "location_dong")
public class LocationDong {

    @Id
    @Column(name = "ldong_cd")
    private String code;

    @Column(name = "si_do")
    private String siDo;

    @Column(name = "si_gun_gu")
    private String siGunGu;

    @Column(name = "dong")
    private String dong;

    @Transient
    @JsonProperty
    private Double locationScore;

    @Transient
    @JsonProperty
    private Double flowScore;

    @Transient
    @JsonProperty
    private Double taxiScore;


    @Transient
    @JsonProperty
    private Double subwayScore;

    @Transient
    @JsonProperty
    private String date;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSiDo() {
        return siDo;
    }

    public void setSiDo(String siDo) {
        this.siDo = siDo;
    }

    public String getSiGunGu() {
        return siGunGu;
    }

    public void setSiGunGu(String siGunGu) {
        this.siGunGu = siGunGu;
    }

    public String getDong() {
        return dong;
    }

    public void setDong(String dong) {
        this.dong = dong;
    }

    public Double getLocationScore() {
        return locationScore;
    }

    public void setLocationScore(Double locationScore) {
        this.locationScore = locationScore;
    }

    public Double getFlowScore() {
        return flowScore;
    }

    public void setFlowScore(Double flowScore) {
        this.flowScore = flowScore;
    }

    public Double getTaxiScore() {
        return taxiScore;
    }

    public void setTaxiScore(Double taxiScore) {
        this.taxiScore = taxiScore;
    }

    public Double getSubwayScore() {
        return subwayScore;
    }

    public void setSubwayScore(Double subwayScore) {
        this.subwayScore = subwayScore;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
