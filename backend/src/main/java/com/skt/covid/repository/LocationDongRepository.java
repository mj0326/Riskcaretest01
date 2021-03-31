package com.skt.covid.repository;

import com.skt.covid.domain.LocationDong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationDongRepository extends JpaRepository<LocationDong, String> {

    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where (location.siDo like :name or location.siGunGu like :name or location.dong like :name)"
    )
    List<LocationDong> searchByName(@Param("name") String name);

    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where location.code = :ldongCd "
    )
    LocationDong getLocationDong(@Param("ldongCd") String ldongCd);

    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where location.code in :ldongCds"
    )
    List<LocationDong> getLocationDongList(@Param("ldongCds") List<String> ldongCds);


    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where location.dong IS NULL \n" +
        "and location.siGunGu is NULL  \n" +
        "order by location.siDo asc \n"
    )
    List<LocationDong> searchLocationSido();

    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where location.dong IS NULL \n" +
        "and location.siGunGu is NOT NULL  \n" +
        "and location.siDo = :siDo  \n" +
        "order by location.siGunGu asc \n"
    )
    List<LocationDong> searchLocationSigungu(@Param("siDo") String siDo);

    @Query(
        "select location \n" +
        "from LocationDong location \n" +
        "where location.dong IS NOT NULL \n" +
        "and location.siGunGu = :siGunGu  \n" +
        "and location.siDo = :siDo  \n" +
        "order by location.dong asc \n"
    )
    List<LocationDong> searchLocationDong(@Param("siDo") String siDo, @Param("siGunGu") String siGunGu);


}
