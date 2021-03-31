package com.skt.covid.domain;

import javax.persistence.*;
import java.time.LocalDateTime;


@Table(name = "covid_social_contact_index_pred_ldong_cd_10_daily")
@Entity
public class SocialContactPredLdongCd10 {

    @Id
    @Column(name = "ldong_cd")
    private String ldongCd;

    @Column(name = "hh")
    private String hh;

    @Column(name = "flow_cnt")
    private int flowCnt;

    @Column(name = "flow_percentile")
    private double flowPercentile;

    @Column(name = "taxi_cnt")
    private int taxiCnt;

    @Column(name = "taxi_percentile")
    private double taxiPercentile;

    @Column(name = "subway_cnt")
    private int subwayCnt;

    @Column(name = "subway_percentile")
    private double subwayPercentile;

    @Column(name = "contact_index")
    private int contactIndex;

    @Column(name = "contact_index_percentile")
    private double contactIndexPercentile;

    @Column(name = "flow_density")
    private double flowDensity;

    @Column(name = "flow_density_percentile")
    private double flowDensityPercentile;

    @Column(name = "taxi_density")
    private double taxiDensity;

    @Column(name = "taxi_density_percentile")
    private double taxiDensityPercentile;

    @Column(name = "subway_density")
    private double subwayDensity;

    @Column(name = "subway_density_percentile")
    private double subwayDensityPercentile;

    @Column(name = "congestion")
    private double congestion;

    @Column(name = "congestion_percentile")
    private double congestionPercentile;

    @Column(name = "contact_density")
    private double contactDensity;

    @Column(name = "contact_density_percentile")
    private double contactDensityPercentile;

    @Column(name = "pred_dt")
    private String predDt;

    @Column(name = "contact_covid_class")
    private String contactCovidClass;

    @Column(name = "dt")
    private LocalDateTime dt;

    public String getLdongCd() {
        return ldongCd;
    }

    public void setLdongCd(String ldongCd) {
        this.ldongCd = ldongCd;
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

    public String getPredDt() {
        return predDt;
    }

    public void setPredDt(String predDt) {
        this.predDt = predDt;
    }

    public LocalDateTime getDt() {
        return dt;
    }

    public void setDt(LocalDateTime dt) {
        this.dt = dt;
    }

    public double getSubwayDensityPercentile() {
        return subwayDensityPercentile;
    }

    public void setSubwayDensityPercentile(double subwayDensityPercentile) {
        this.subwayDensityPercentile = subwayDensityPercentile;
    }
}
