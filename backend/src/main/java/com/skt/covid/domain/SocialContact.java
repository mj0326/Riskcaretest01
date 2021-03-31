package com.skt.covid.domain;

import javax.persistence.*;

@IdClass(SocialContactPK.class)

@Table(name = "social_contact")
@Entity
public class SocialContact {

    @Id
    @Column(name = "dt")
    private String dt;

    @Id
    @Column(name = "ldong_cd")
    private String ldongCd;

    @Column(name = "si_do")
    private String siDo;

    @Column(name = "si_gun_gu")
    private String siGunGu;

    @Column(name = "dong")
    private String dong;

    @Column(name = "flow_score")
    private int flowScore;

    @Column(name = "taxi_score")
    private int taxiScore;

    @Column(name = "subway_score")
    private int subwayScore;

    @Column(name = "contact_score")
    private int contactScore;

    @Column(name = "contact_class")
    private int contactClass;

    @Column(name = "total_in_si_do")
    private int totalInSiDo;

    @Column(name = "rank_in_si_do")
    private int rankInSiDo;

    @Column(name = "total_in_si_gun_gu")
    private int totalInSiGunGu;

    @Column(name = "rank_in_si_gun_gu")
    private int rankInSiGunGu;

    @Column(name = "outdoor_activity_score")
    private int outdoorActivityScore;

    public String getDt() {
        return dt;
    }

    public void setDt(String dt) {
        this.dt = dt;
    }

    public String getLdongCd() {
        return ldongCd;
    }

    public void setLdongCd(String ldongCd) {
        this.ldongCd = ldongCd;
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

    public int getFlowScore() {
        return flowScore;
    }

    public void setFlowScore(int flowScore) {
        this.flowScore = flowScore;
    }

    public int getTaxiScore() {
        return taxiScore;
    }

    public void setTaxiScore(int taxiScore) {
        this.taxiScore = taxiScore;
    }

    public int getSubwayScore() {
        return subwayScore;
    }

    public void setSubwayScore(int subwayScore) {
        this.subwayScore = subwayScore;
    }

    public int getContactScore() {
        return contactScore;
    }

    public void setContactScore(int contactScore) {
        this.contactScore = contactScore;
    }

    public int getContactClass() {
        return contactClass;
    }

    public void setContactClass(int contactClass) {
        this.contactClass = contactClass;
    }

    public int getTotalInSiDo() {
        return totalInSiDo;
    }

    public void setTotalInSiDo(int totalInSiDo) {
        this.totalInSiDo = totalInSiDo;
    }

    public int getRankInSiDo() {
        return rankInSiDo;
    }

    public void setRankInSiDo(int rankInSiDo) {
        this.rankInSiDo = rankInSiDo;
    }

    public int getTotalInSiGunGu() {
        return totalInSiGunGu;
    }

    public void setTotalInSiGunGu(int totalInSiGunGu) {
        this.totalInSiGunGu = totalInSiGunGu;
    }

    public int getRankInSiGunGu() {
        return rankInSiGunGu;
    }

    public void setRankInSiGunGu(int rankInSiGunGu) {
        this.rankInSiGunGu = rankInSiGunGu;
    }

    public int getOutdoorActivityScore() {
        return outdoorActivityScore;
    }

    public void setOutdoorActivityScore(int outdoorActivityScore) {
        this.outdoorActivityScore = outdoorActivityScore;
    }
}
