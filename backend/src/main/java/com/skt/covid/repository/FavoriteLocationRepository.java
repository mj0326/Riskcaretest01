package com.skt.covid.repository;

import com.skt.covid.domain.FavoriteLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteLocationRepository extends JpaRepository<FavoriteLocation, Long> {

    @Query(
        "select favoriteLocation \n" +
        "from   FavoriteLocation favoriteLocation \n" +
        "where  favoriteLocation.createdBy = :userId \n" +
        "and    favoriteLocation.locationCode = :lDongCd"
    )
    FavoriteLocation getFavoriteLocation(@Param("userId") String userId, @Param("lDongCd") String lDongCd);

    @Query(
        "select favoriteLocation \n" +
        "from   FavoriteLocation favoriteLocation \n" +
        "where  favoriteLocation.createdBy = :userId"
    )
    List<FavoriteLocation> getFavoriteLocations(@Param("userId") String userId);

    @Query(
        "select COALESCE(max(favoriteLocation.order), 0) \n" +
        "from   FavoriteLocation favoriteLocation \n" +
        "where  favoriteLocation.createdBy = :userId"
    )
    int getMaxOrderInFavoriteLocation(@Param("userId") String userId);

}
