package com.skt.covid.domain;

import javax.persistence.*;
import java.time.LocalDateTime;

@Table(name = "covid_msg_v1", schema = "covid")
@Entity
public class CovidMsg {

    @Id
    @Column(name = "md102_sn")
    private int md102Sn;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "location_cd")
    private String locationCd;

    @Column(name = "si_do")
    private String siDo;

    @Column(name = "si_gun_gu")
    private String siGunGu;

    @Column(name = "msg")
    private String msg;

    @Column(name = "confirmed")
    private int confirmed;

    public int getMd102Sn() {
        return md102Sn;
    }

    public void setMd102Sn(int md102Sn) {
        this.md102Sn = md102Sn;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime create_date) {
        this.createDate = create_date;
    }

    public String getLocationCd() {
        return locationCd;
    }

    public void setLocationCd(String locationCd) {
        this.locationCd = locationCd;
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

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(int confirmed) {
        this.confirmed = confirmed;
    }
}
