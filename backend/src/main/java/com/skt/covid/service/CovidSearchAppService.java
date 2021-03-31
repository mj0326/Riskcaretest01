package com.skt.covid.service;

import com.skt.covid.config.Constants;
import com.skt.covid.domain.CovidStat;
import com.skt.covid.domain.LocationDong;
import com.skt.covid.domain.VaccineStat;
import com.skt.covid.repository.*;
import com.skt.covid.service.mapper.SocialContactMapper;
import com.skt.covid.web.rest.errors.CovidException;
import com.skt.covid.web.rest.vm.Result;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CovidSearchAppService {

    private final Logger log = LoggerFactory.getLogger(CovidSearchAppService.class);

    @Autowired
    SocialContactRepository socialContactRepository;

    @Autowired
    SocialContactMapper socialContactMapper;

    @Autowired
    VaccineStatRepository vaccineStatRepository;

    @Autowired
    CovidMsgRepository covidMsgRepository;

    @Autowired
    CovidStatRepository covidStatRepository;

    @Autowired
    SocialContactPredLdongCd10Repository socialContactPredLdongCd10Repository;

    @Autowired
    SocialContactLdongCd10Repository socialContactLdongCd10Repository;

    @Transactional(readOnly = true)
    public Result getSocialContacts(List<String> lDongCds) throws CovidException{
        Result result = new Result();

        result.setCode(Constants.CommonCode.SUCCESS);
        String baseDateTime = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        result.setData(socialContactMapper.socialContactTosocialContacts(socialContactRepository.getSocialContacts(baseDateTime, lDongCds)));

        return result;
    }

    /**
     * 오늘 확진자 수 + 누적 확진자 수
     * 어제 백신 접종자수 + 누적 접종자 수
     * @return
     */
    @Transactional(readOnly = true)
    public Result getCoronaStat() throws CovidException {
        Result result = new Result();

        String baseDateTime = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        VaccineStat vaccineStat = vaccineStatRepository.vaccineTotalList(baseDateTime);

        // 백신 누적
        int vaccineAccumulated = vaccineStat.getAccumulatedFirstCnt() + vaccineStat.getAccumulatedSecondCnt();

        // 어제 백신
        int vaccineYesterDay = vaccineStat.getFirstCnt() + vaccineStat.getSecondCnt();

        String baseDateTime2 = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        CovidStat covidStat = covidStatRepository.covidStatTotal(baseDateTime2);
        int patientsAccumulated = covidStat.getTotalConfirmedCnt();

        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        List<Map> todayList = covidMsgRepository.covidMsgAllList(today);

        int patientsToday = 0;
        if(null != todayList.get(0) && todayList.size() > 0) {
            Map map = todayList.get(0);
            patientsToday = Integer.parseInt(map.get("patientCnt").toString());
        }

        Map resultMap = new HashMap();
        resultMap.put("vaccineYesterDay", vaccineYesterDay);
        resultMap.put("vaccineAccumulated", vaccineAccumulated);
        resultMap.put("patientsToday", patientsToday);
        resultMap.put("patientsAccumulated", patientsAccumulated);
        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(resultMap);
        return result;
    }

    /**
     * 관심 지역 위험도
     * @param ldongCds
     * @return
     * @throws CovidException
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCds(List<String> ldongCds) throws CovidException {
        Result result = new Result();

        String baseYMD = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseHH = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH"));
        String dt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        result.setData(socialContactMapper.socialContactPredTosocialContactPredDTOs(socialContactPredLdongCd10Repository.getSocialContactPreds(baseYMD, baseHH, ldongCds, dt)));
        result.setCode(Constants.CommonCode.SUCCESS);

        return result;
    }

    /**
     * 관심 지역 위험도 상세.
     * @param ldongCd
     * @return
     * @throws CovidException
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCd(String ldongCd) throws CovidException {
        Result result = new Result();

        String baseYMD = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseHH = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH"));
        String dt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        result.setData(socialContactMapper.socialContactPredTosocialContactPredDTOs(socialContactPredLdongCd10Repository.getSocialContactPred(baseYMD, baseHH, ldongCd, dt)));
        result.setCode(Constants.CommonCode.SUCCESS);

        return result;
    }

    /**
     * 관심 지역 상세 - 일 시간별 현황. - baseYmd가 dt 보다 큰 경우.
     * @param baseTime
     * @param ldongCd
     * @return
     * @throws CovidException
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCdTimeSeiresDay(String baseTime, String ldongCd) throws CovidException {
        Result result = new Result();

        String baseYMD = "";
        String dt = "";

        if(baseTime.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {
            LocalDateTime tempYmd = LocalDate.parse(baseTime, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
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
     * 관심 지역 상세 - 일 시간 현황
     * @param baseTime
     * @param ldongCd
     * @return
     * @throws CovidException
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCdTimeSeiresHour(String baseTime, String ldongCd, String baseHour) throws CovidException {
        Result result = new Result();

        String baseYMD = "";
        String dt = "";

        if(baseTime.length() != 8) {
            result.setCode(Constants.CommonCode.FAIL);
            result.setMessage("Please enter the date value in 8 digits.");
            return result;
        } else {
            LocalDateTime tempYmd = LocalDate.parse(baseTime, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay();
            baseYMD = tempYmd.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String tempDt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            // baseYmd 가 dt 보다 큰 경우
            if(Integer.parseInt(baseYMD) > Integer.parseInt(tempDt)) {
                dt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                result.setData(socialContactMapper.socialContactPredTosocialContactPredDTOs(socialContactPredLdongCd10Repository.getSocialContactPredTimeSeiresHour(baseYMD,  dt, ldongCd, baseHour)));
            } else {
                result.setData(socialContactMapper.socialContactTosocialContactDTOs(socialContactLdongCd10Repository.getSocialContactTimeSeiresHour(baseYMD, ldongCd, baseHour)));
            }
        }

        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }

    /**
     * 관심 지역 상세 - 주별 위험도(금주)
     * @param ldongCd
     * @return
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCdTimeSeiresWeek(String ldongCd) throws CovidException {
        Result result = new Result();

        LocalDateTime date = LocalDateTime.now();
        LocalDateTime fromDate = date.minusDays(date.getDayOfWeek().getValue()-1);
        LocalDateTime toDate = fromDate;
        if(fromDate.compareTo(date) == 0) {
            toDate = fromDate;
        } else {
            toDate = date.minusDays(1);
        }
        String fromYmd = fromDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String toYmd = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        List<Map> week1 = socialContactLdongCd10Repository.getSocialContactTimeSeiresPreWeek(ldongCd, fromYmd, toYmd);


        // week2 구하기
        toDate = date.plusDays(6 - date.getDayOfWeek().getValue()+1);

        fromYmd = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        toYmd = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String dt = LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        List<Map> week2 = socialContactPredLdongCd10Repository.getSocialContactTimeSeiresWeek(ldongCd, dt, fromYmd, toYmd);

        for(Map map :week2) {
            week1.add(map);
        }

        result.setCode(Constants.CommonCode.SUCCESS);
        result.setData(week1);
        return result;
    }

    /**
     * 관심 지역 상세 - 주별 위험도(전주)
     * @param ldongCd
     * @return
     */
    @Transactional(readOnly = true)
    public Result getSocialContactLdongCdTimeSeiresPreWeek(String ldongCd) throws CovidException {
        Result result = new Result();

        LocalDateTime date = LocalDateTime.now().minusWeeks(1);
        //시작

        LocalDateTime fromDate = date.minusDays(date.getDayOfWeek().getValue()-1);
        LocalDateTime toDate = date.plusDays(6 - date.getDayOfWeek().getValue()+1);

        String fromYmd = fromDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String toYmd = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        result.setData(socialContactLdongCd10Repository.getSocialContactTimeSeiresPreWeek(ldongCd, fromYmd, toYmd));
        result.setCode(Constants.CommonCode.SUCCESS);
        return result;
    }
}
