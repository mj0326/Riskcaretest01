package com.skt.covid.service.dto;

import com.skt.covid.domain.LocationDong;

public class LocationDongDTO {

    private String lDongCd;

    private String siDo;

    private String siGunGu;

    private String dong;

    public LocationDongDTO(LocationDong locationDong) {
        this.lDongCd = locationDong.getCode();
        this.siDo =  locationDong.getSiDo();
        this.siGunGu = locationDong.getSiGunGu();
        this.dong = locationDong.getDong();
    }

    public String getlDongCd() {
        return lDongCd;
    }

    public void setlDongCd(String lDongCd) {
        this.lDongCd = lDongCd;
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
}
