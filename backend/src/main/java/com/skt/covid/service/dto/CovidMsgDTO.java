package com.skt.covid.service.dto;

import com.skt.covid.domain.CovidMsg;

public class CovidMsgDTO {


    private String siDo;

    private String siGunGu;

    private int patientCnt;

    public CovidMsgDTO() {
        // Empty constructor needed for Jackson.
    }

    public CovidMsgDTO(CovidMsg covidMsg) {
        this.siDo = covidMsg.getSiDo();
        this.siGunGu = covidMsg.getSiGunGu();
        this.patientCnt = covidMsg.getConfirmed();
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

    public int getPatientCnt() {
        return patientCnt;
    }

    public void setPatientCnt(int patientCnt) {
        this.patientCnt = patientCnt;
    }
}
