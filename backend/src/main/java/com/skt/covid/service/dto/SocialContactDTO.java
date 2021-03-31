package com.skt.covid.service.dto;

import com.skt.covid.domain.LocationDong;
import com.skt.covid.domain.SocialContact;

public class SocialContactDTO {

    private  String code;

    private String siDo;

    private String siGunGu;

    private String dong;

    private Double locationScore;

    private Double flowScore;

    private Double taxiScore;

    private Double subwayScore;

    private String date;

    public SocialContactDTO() {
        // Empty constructor needed for Jackson.
    }

    public SocialContactDTO(LocationDong locationDong) {
        this.date = locationDong.getDate();
        this.code = locationDong.getCode();
        this.siDo = locationDong.getSiDo();
        this.siGunGu = locationDong.getSiGunGu();
        this.dong = locationDong.getDong();
        this.locationScore = locationDong.getLocationScore();
        this.flowScore = locationDong.getFlowScore();
        this.taxiScore = locationDong.getTaxiScore();
        this.subwayScore = locationDong.getSubwayScore();
    }

    public SocialContactDTO(SocialContact socialContact) {
        this.date = socialContact.getDt();
        this.code = socialContact.getLdongCd();
        this.siDo = socialContact.getSiDo();
        this.siGunGu = socialContact.getSiGunGu();
        this.dong = socialContact.getDong();
        this.locationScore = Double.valueOf(socialContact.getContactScore());
        this.flowScore = Double.valueOf(socialContact.getFlowScore());
        this.taxiScore = Double.valueOf(socialContact.getTaxiScore());
        this.subwayScore = Double.valueOf(socialContact.getSubwayScore());
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

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
}
