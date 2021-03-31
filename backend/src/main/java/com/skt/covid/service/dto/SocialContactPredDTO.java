package com.skt.covid.service.dto;

import com.skt.covid.domain.LocationDong;
import com.skt.covid.domain.SocialContactLdongCd10;
import com.skt.covid.domain.SocialContactPredLdongCd10;
import com.skt.covid.repository.LocationDongRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SocialContactPredDTO {

    private String siDo;

    private String siGunGu;

    private String dong;

    private String lDongCd;

    private String hh;

    private int flowCnt;

    private double flowPercentile;

    private int taxiCnt;

    private double taxiPercentile;

    private int subwayCnt;

    private double subwayPercentile;

    private int contactIndex;

    private double contactIndexPercentile;

    private double flowDensity;

    private double flowDensityPercentile;

    private double taxiDensity;

    private double taxiDensityPercentile;

    private double subwayDensity;

    private double subwayDensityPercentile;

    private double congestion;

    private double congestionPercentile;

    private double contactDensity;

    private double contactDensityPercentile;

    private String contactCovidClass;

    private String dt;

    private Long favoriteLocationId;

    private int order;

    public SocialContactPredDTO(SocialContactPredLdongCd10 socialContactPredLdongCd10, LocationDong locationDong) {

        if(null == locationDong) {
            this.siDo = "";
            this.siGunGu = "";
            this.dong = "";
        } else {
            this.siDo = locationDong.getSiDo();
            this.siGunGu = locationDong.getSiGunGu();
            this.dong = locationDong.getDong();
        }

        this.lDongCd = socialContactPredLdongCd10.getLdongCd();
        this.hh = socialContactPredLdongCd10.getHh();
        this.flowCnt = socialContactPredLdongCd10.getFlowCnt();
        this.flowPercentile = socialContactPredLdongCd10.getFlowPercentile();
        this.taxiCnt = socialContactPredLdongCd10.getTaxiCnt();
        this.taxiPercentile = socialContactPredLdongCd10.getTaxiPercentile();
        this.subwayCnt = socialContactPredLdongCd10.getSubwayCnt();
        this.subwayPercentile = socialContactPredLdongCd10.getSubwayPercentile();
        this.contactIndex = socialContactPredLdongCd10.getContactIndex();
        this.contactIndexPercentile = socialContactPredLdongCd10.getContactIndexPercentile();
        this.flowDensity = socialContactPredLdongCd10.getFlowDensity();
        this.flowDensityPercentile = socialContactPredLdongCd10.getFlowDensityPercentile();
        this.taxiDensity = socialContactPredLdongCd10.getTaxiDensity();
        this.taxiDensityPercentile = socialContactPredLdongCd10.getTaxiDensityPercentile();
        this.subwayDensity = socialContactPredLdongCd10.getSubwayDensity();
        this.subwayDensityPercentile = socialContactPredLdongCd10.getSubwayDensityPercentile();
        this.congestion = socialContactPredLdongCd10.getCongestion();
        this.congestionPercentile = socialContactPredLdongCd10.getCongestionPercentile();
        this.contactDensity = socialContactPredLdongCd10.getContactDensity();
        this.contactDensityPercentile = socialContactPredLdongCd10.getContactDensityPercentile();
        this.contactCovidClass = socialContactPredLdongCd10.getContactCovidClass();
        this.dt = socialContactPredLdongCd10.getPredDt();

    }

    public SocialContactPredDTO(SocialContactLdongCd10 socialContactLdongCd10, LocationDong locationDong) {

        if(null == locationDong) {
            this.siDo = "";
            this.siGunGu = "";
            this.dong = "";
        } else {
            this.siDo = locationDong.getSiDo();
            this.siGunGu = locationDong.getSiGunGu();
            this.dong = locationDong.getDong();
        }

        this.lDongCd = socialContactLdongCd10.getLdongCd();
        this.hh = socialContactLdongCd10.getHh();
        this.flowCnt = socialContactLdongCd10.getFlowCnt();
        this.flowPercentile = socialContactLdongCd10.getFlowPercentile();
        this.taxiCnt = socialContactLdongCd10.getTaxiCnt();
        this.taxiPercentile = socialContactLdongCd10.getTaxiPercentile();
        this.subwayCnt = socialContactLdongCd10.getSubwayCnt();
        this.subwayPercentile = socialContactLdongCd10.getSubwayPercentile();
        this.contactIndex = socialContactLdongCd10.getContactIndex();
        this.contactIndexPercentile = socialContactLdongCd10.getContactIndexPercentile();
        this.flowDensity = socialContactLdongCd10.getFlowDensity();
        this.flowDensityPercentile = socialContactLdongCd10.getFlowDensityPercentile();
        this.taxiDensity = socialContactLdongCd10.getTaxiDensity();
        this.taxiDensityPercentile = socialContactLdongCd10.getTaxiDensityPercentile();
        this.subwayDensity = socialContactLdongCd10.getSubwayDensity();
        this.subwayDensityPercentile = socialContactLdongCd10.getSubwayDensityPercentile();
        this.congestion = socialContactLdongCd10.getCongestion();
        this.congestionPercentile = socialContactLdongCd10.getCongestionPercentile();
        this.contactDensity = socialContactLdongCd10.getContactDensity();
        this.contactDensityPercentile = socialContactLdongCd10.getContactDensityPercentile();
        this.contactCovidClass = socialContactLdongCd10.getContactCovidClass();
        this.dt = socialContactLdongCd10.getDt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

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

    public String getlDongCd() {
        return lDongCd;
    }

    public void setlDongCd(String lDongCd) {
        this.lDongCd = lDongCd;
    }

    public String getHh() {
        return hh;
    }

    public void setHh(String hh) {
        this.hh = hh;
    }

    public int getFlowCnt() {
        return flowCnt;
    }

    public void setFlowCnt(int flowCnt) {
        this.flowCnt = flowCnt;
    }

    public double getFlowPercentile() {
        return flowPercentile;
    }

    public void setFlowPercentile(double flowPercentile) {
        this.flowPercentile = flowPercentile;
    }

    public int getTaxiCnt() {
        return taxiCnt;
    }

    public void setTaxiCnt(int taxiCnt) {
        this.taxiCnt = taxiCnt;
    }

    public double getTaxiPercentile() {
        return taxiPercentile;
    }

    public void setTaxiPercentile(double taxiPercentile) {
        this.taxiPercentile = taxiPercentile;
    }

    public int getSubwayCnt() {
        return subwayCnt;
    }

    public void setSubwayCnt(int subwayCnt) {
        this.subwayCnt = subwayCnt;
    }

    public double getSubwayPercentile() {
        return subwayPercentile;
    }

    public void setSubwayPercentile(double subwayPercentile) {
        this.subwayPercentile = subwayPercentile;
    }

    public int getContactIndex() {
        return contactIndex;
    }

    public void setContactIndex(int contactIndex) {
        this.contactIndex = contactIndex;
    }

    public double getContactIndexPercentile() {
        return contactIndexPercentile;
    }

    public void setContactIndexPercentile(double contactIndexPercentile) {
        this.contactIndexPercentile = contactIndexPercentile;
    }

    public double getFlowDensity() {
        return flowDensity;
    }

    public void setFlowDensity(double flowDensity) {
        this.flowDensity = flowDensity;
    }

    public double getFlowDensityPercentile() {
        return flowDensityPercentile;
    }

    public void setFlowDensityPercentile(double flowDensityPercentile) {
        this.flowDensityPercentile = flowDensityPercentile;
    }

    public double getTaxiDensity() {
        return taxiDensity;
    }

    public void setTaxiDensity(double taxiDensity) {
        this.taxiDensity = taxiDensity;
    }

    public double getTaxiDensityPercentile() {
        return taxiDensityPercentile;
    }

    public void setTaxiDensityPercentile(double taxiDensityPercentile) {
        this.taxiDensityPercentile = taxiDensityPercentile;
    }

    public double getSubwayDensity() {
        return subwayDensity;
    }

    public void setSubwayDensity(double subwayDensity) {
        this.subwayDensity = subwayDensity;
    }

    public double getSubwayDensityPercentile() {
        return subwayDensityPercentile;
    }

    public void setSubwayDensityPercentile(double subwayDensityPercentile) {
        this.subwayDensityPercentile = subwayDensityPercentile;
    }

    public double getCongestion() {
        return congestion;
    }

    public void setCongestion(double congestion) {
        this.congestion = congestion;
    }

    public double getCongestionPercentile() {
        return congestionPercentile;
    }

    public void setCongestionPercentile(double congestionPercentile) {
        this.congestionPercentile = congestionPercentile;
    }

    public double getContactDensity() {
        return contactDensity;
    }

    public void setContactDensity(double contactDensity) {
        this.contactDensity = contactDensity;
    }

    public double getContactDensityPercentile() {
        return contactDensityPercentile;
    }

    public void setContactDensityPercentile(double contactDensityPercentile) {
        this.contactDensityPercentile = contactDensityPercentile;
    }

    public String getContactCovidClass() {
        return contactCovidClass;
    }

    public void setContactCovidClass(String contactCovidClass) {
        this.contactCovidClass = contactCovidClass;
    }

    public String getDt() {
        return dt;
    }

    public void setDt(String dt) {
        this.dt = dt;
    }

    public Long getFavoriteLocationId() {
        return favoriteLocationId;
    }

    public void setFavoriteLocationId(Long favoriteLocationId) {
        this.favoriteLocationId = favoriteLocationId;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }
}
