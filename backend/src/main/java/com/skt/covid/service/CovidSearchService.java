package com.skt.covid.service;

import com.google.common.collect.Maps;
import com.skt.covid.config.Constants;
import com.skt.covid.domain.CovidStat;
import com.skt.covid.domain.VaccineStat;
import com.skt.covid.domain.VaccineTypeStat;
import com.skt.covid.repository.*;
import com.skt.covid.service.dto.CovidMsgDTO;
import com.skt.covid.service.dto.SocialContactDTO;
import com.skt.covid.service.mapper.CovidMsgMapper;
import com.skt.covid.service.mapper.SocialContactMapper;
import com.skt.covid.util.RestApiUtil;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.checkerframework.checker.units.qual.A;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class CovidSearchService {

    private final Logger log = LoggerFactory.getLogger(CovidSearchService.class);


    @Autowired
    private LocationDongRepository locationDongRepository;

    @Autowired
    private SocialContactRepository socialContactRepository;

    @Autowired
    private CovidMsgRepository covidMsgRepository;

    @Autowired
    private CovidMsgMapper covidMsgMapper;

    @Autowired
    private SocialContactMapper socialContactMapper;

    @Autowired
    private VaccineStatRepository vaccineStatRepository;

    @Autowired
    private VaccineTypeStatRepository vaccineTypeStatRepository;

    @Autowired
    RestApiUtil restApiUtil;

    @Autowired
    private CovidStatRepository covidStatRepository;

    @Autowired
    SocialContactPredLdongCd10Repository socialContactPredLdongCd10Repository;

    @Autowired
    SocialContactLdongCd10Repository socialContactLdongCd10Repository;


    /**
     * 일별 사회적 접촉지수 예측
     *
     * @param ldongCd
     * @param filterDate
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchSocialContact(String ldongCd, String filterDate) throws CovidException {
        Result result = new Result();

        String baseYMD = "";
        String dt = "";

        if(filterDate.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {
            LocalDateTime tempYmd = LocalDate.parse(filterDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            baseYMD = tempYmd.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String tempDt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            // baseYmd 가 dt 보다 큰 경우
            if(Integer.parseInt(baseYMD) > Integer.parseInt(tempDt)) {
                dt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                result.setData(socialContactPredLdongCd10Repository.getSocialContactPredTimeSeiresDay(baseYMD,  dt, ldongCd));
            } else {
                result.setData(socialContactLdongCd10Repository.getSocialContactTimeSeiresDay(baseYMD, ldongCd));
            }
        }
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }


    /**
     * 실시간 - 지역별 확진자 현황 가져옵니다. - 전체
     * @return
     */
    @Transactional(readOnly = true)
    public Result queryRealTimeOfConfirmedPatientsAll() throws CovidException {
        Result result = new Result();

        LocalDateTime todayTime = LocalDateTime.now();
        String today = todayTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));


        List<Map> todayList = covidMsgRepository.covidMsgAllList(today);

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(todayList);
        return result;
    }

    /**
     * 실시간 - 지역별 확진자 현황 가져옵니다. - 시도
     * @param searchText
     * @return
     */
    @Transactional(readOnly = true)
    public Result queryRealtimeOfConfirmedPatientsSido(String searchText) throws CovidException {
        Result result = new Result();

        if(null == searchText) {
            searchText = "%";
        }

        searchText = "%" + searchText + "%";

        LocalDateTime todayTime = LocalDateTime.now();
        String today = todayTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));


        List<Map> todayList = covidMsgRepository.covidMsgSiDoList(today, searchText);

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(todayList);
        return result;
    }

    /**
     * 실시간 - 코로나 현황 구하기 - 시군구
     * @param searchText
     * @return
     */
    @Transactional(readOnly = true)
    public Result queryRealtimeOfConfirmedPatientsSiGunGu(String searchText) throws CovidException {
        Result result = new Result();

        if(null == searchText) {
            searchText = "%";
        }

        searchText = "%" + searchText + "%";

        LocalDateTime todayTime = LocalDateTime.now();
        String today = todayTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));


        List<CovidMsgDTO> todayList = covidMsgMapper.covidMsgsToCovidMsgDTOs(covidMsgRepository.covidMsgSiGunGuList(today, searchText));

        Map<String, Object> returnMap = Maps.newHashMap();
        returnMap.put(today, todayList);

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(returnMap);
        return result;
    }

    /**
     * 코로나 현황 구하기 - 시별 (통계)
     * @param filterDate
     * @param searchText
     * @return
     */
    @Transactional(readOnly = true)
    public Result queryLocationOfConfirmedPatientsSido(String filterDate, String searchText) throws CovidException {
        Result result = new Result();
        if(null == searchText) {
            searchText = "%";
        } else {
            searchText = "%" + searchText + "%";
        }


        String today = "";

        if(filterDate.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {
            LocalDateTime todayTime = LocalDate.parse(filterDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            today = todayTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        }

        List<CovidStat> covidStatList = covidStatRepository.covidStatSido(today, searchText);
        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(covidStatList);
        return result;
    }

    /**
     * 코로나 현황 구하기 - 전체 (통계)
     * @return
     */
    @Transactional(readOnly = true)
    public Result queryLocationOfConfirmedPatientsSidoAll(String filterDate) throws CovidException{
        Result result = new Result();

        String today = "";
        if(filterDate.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {

            LocalDateTime todayTime = LocalDate.parse(filterDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            today = todayTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        }


        CovidStat covidStat = covidStatRepository.covidStatTotal(today);
        if(null != covidStat) {
            covidStat.setLocation("전국");
        }

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(covidStat);
        return result;
    }

    /**
     * 백신 현황 구하기
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchLocationOfVaccine(String filterDate) throws CovidException {
        Result result = new Result();

        String today = "";


        if(filterDate.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {
            LocalDateTime todayTime = LocalDate.parse(filterDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            today = todayTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        }

        List<VaccineStat> todayList = vaccineStatRepository.vaccineList(today);
        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(todayList);
        return result;
    }

    /**
     * 백신 현황 구하기 - 전체
     * @return
     */
    @Transactional(readOnly = true)
    public Result searchLocationOfVaccineType(String filterDate) throws CovidException {
        Result result = new Result();

        String today = "";

        if(filterDate.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {

            LocalDateTime todayTime = LocalDate.parse(filterDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            today = todayTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        }


        List<VaccineTypeStat> todayList = vaccineTypeStatRepository.vaccineTypeStatList(today);

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(todayList);
        return result;
    }

    private List<String> getTranslate(String query, String srcLang, String targetLang) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK 29595414c965e08035cdccd02253abaa");
        headers.set("Content-Type", "application/x-www-form-urlencoded");



        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("query", query);
        map.add("src_lang", srcLang);
        map.add("target_lang", targetLang);

        List<List> returnList = new ArrayList<>();
        try {
            LinkedHashMap resultMap = (LinkedHashMap) restApiUtil.excute("https://dapi.kakao.com/v2/translation/translate", HttpMethod.POST, map, Object.class, RestApiUtil.MEDIA_TYPE_FORM, headers);

            returnList = (List<List>)resultMap.get("translated_text");
        } catch  (IOException e){
            log.error(e.getMessage());
        } catch  (NoSuchAlgorithmException e){
            log.error(e.getMessage());
        } catch  (KeyManagementException e){
            log.error(e.getMessage());
        }
        if(null != returnList &&returnList.size() > 0) {
            return returnList.get(0);
        }
        return null;
    }
}
