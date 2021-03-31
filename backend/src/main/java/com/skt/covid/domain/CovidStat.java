package com.skt.covid.domain;

import javax.persistence.*;

@IdClass(CovidStatPK.class)
@Table(name = "covid_stat")
@Entity
public class CovidStat {

    @Id
    @Column(name = "base_date")
    private String baseDate;

    @Id
    @Column(name = "location")
    private String location;

    @Column(name = "total_confirmed_cnt")
    private int totalConfirmedCnt;

    @Column(name = "daily_confirmed_cnt")
    private int dailyConfirmedCnt;

    @Column(name = "local_cnt")
    private int localCnt;

    @Column(name = "inflow_cnt")
    private int inflowCnt;

    @Column(name = "isolation_cnt")
    private int isolationCnt;

    @Column(name = "release_cnt")
    private int releaseCnt;

    @Column(name = "dead_cnt")
    private int deadCnt;

    @Column(name = "ratio_100k")
    private double ratio100k;

    public String getBaseDate() {
        return baseDate;
    }

    public void setBaseDate(String baseDate) {
        this.baseDate = baseDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getTotalConfirmedCnt() {
        return totalConfirmedCnt;
    }

    public void setTotalConfirmedCnt(int totalConfirmedCnt) {
        this.totalConfirmedCnt = totalConfirmedCnt;
    }

    public int getDailyConfirmedCnt() {
        return dailyConfirmedCnt;
    }

    public void setDailyConfirmedCnt(int dailyConfirmedCnt) {
        this.dailyConfirmedCnt = dailyConfirmedCnt;
    }

    public int getLocalCnt() {
        return localCnt;
    }

    public void setLocalCnt(int localCnt) {
        this.localCnt = localCnt;
    }

    public int getInflowCnt() {
        return inflowCnt;
    }

    public void setInflowCnt(int inflowCnt) {
        this.inflowCnt = inflowCnt;
    }

    public int getIsolationCnt() {
        return isolationCnt;
    }

    public void setIsolationCnt(int isolationCnt) {
        this.isolationCnt = isolationCnt;
    }

    public int getReleaseCnt() {
        return releaseCnt;
    }

    public void setReleaseCnt(int releaseCnt) {
        this.releaseCnt = releaseCnt;
    }

    public int getDeadCnt() {
        return deadCnt;
    }

    public void setDeadCnt(int deadCnt) {
        this.deadCnt = deadCnt;
    }

    public double getRatio100k() {
        return ratio100k;
    }

    public void setRatio100k(double ratio100k) {
        this.ratio100k = ratio100k;
    }
}
