package com.skt.covid.service.dto;

import com.skt.covid.domain.LocationDong;

public class FavoriteLocationDTO {

    private Long favoriteLocationId;

    private String lDongCd;

    private Integer order;

    public Long getFavoriteLocationId() {
        return favoriteLocationId;
    }

    public void setFavoriteLocationId(Long favoriteLocationId) {
        this.favoriteLocationId = favoriteLocationId;
    }

    public String getlDongCd() {
        return lDongCd;
    }

    public void setlDongCd(String lDongCd) {
        this.lDongCd = lDongCd;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }
}
