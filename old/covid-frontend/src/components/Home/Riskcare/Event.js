import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { classBind as cx, windowConfirm } from "../../../others/util";
import InputSet from "../../Common/InputSet";
import "./Event.scss";
import qs from "query-string";
import { EVENT_TIME_FORMAT, MODE, ROUTE } from "../../../others/const";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";
import { addSchedule, removeSchedule } from "../../../redux"
import moment from "moment";

function Save({ detail, title, callback }) {
    return (
        <Button title={title} onClick={() => {
            if (!(detail.summary && 
                detail.locationName && 
                detail.locationCode && 
                detail.startTime && 
                detail.endTime)) {
                alert("빈 칸을 모두 작성해 주세요.");
            }   
            else if(!moment(detail.startTime, EVENT_TIME_FORMAT).isValid()) {
                alert("시작 시간을 양식에 맞게 작성해 주세요.");
            }
            else {
                callback()
            }
        }} />
    )
}

function Event() {  
    
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const parsed = qs.parse(location.search);
    const { mode } = parsed;
    const [detail, setDetail] = useState(parsed);

    useEffect(() => {
        // TODO
        // 시연 후 details saga 에서 관리하도록 수정 TQ
        // URL 에는 ID 만 가지고 다니도록
    }, [])

    const setValue = (update) => {
        const updated = { ...detail, ...update }
        setDetail(updated)
        const stringified = qs.stringify(updated, { skipEmptyString: true });
        history.replace(`${location.pathname}?${stringified}`);
    }

    const editMode = mode === MODE.edit

    return (
        <div className={cx("content", "event")}>
            <InputSet title="일정 제목" 
                placeholder="일정 제목 입력"
                defaultValue={detail.summary}
                blurCallback={summary => setValue({ summary })}
                className={cx("bottom-margin")}
            />
            <InputSet title="시작 시간" 
                placeholder={EVENT_TIME_FORMAT}
                defaultValue={detail.startTime}
                blurCallback={startTime => setValue({ startTime })}
            />
            <InputSet title="종료" 
                placeholder={EVENT_TIME_FORMAT}
                defaultValue={detail.endTime}
                blurCallback={endTime => setValue({ endTime })}
            />
            <InputSet title="장소" 
                placeholder="도로명 / 지번 / 상호명"
                defaultValue={detail.locationName}
                locationScore={detail.locationScore}
                hasScore={detail.locationName}
                focusCallback={() => {
                    const stringified = qs.stringify({ ...detail, mode: "event" }, { skipEmptyString: true })
                    history.push(`${ROUTE.search}?${stringified}`);
                }}
            />

            <div className={cx("buttons", !editMode && "single")}>
                {editMode && <Button title="삭제" onClick={() => {
                    const confirmed = windowConfirm(`${detail.summary} 일정을 삭제하시겠습니까?`);
                    if (confirmed) {
                        dispatch(removeSchedule({
                            id: detail.id,
                            callback: () => history.push(ROUTE.home)                            
                        }));
                    }
                }}/>}                 
                <Save detail={detail} title={editMode ? "수정" : "저장"} callback={() => {
                    dispatch(addSchedule({
                        detail,
                        callback: () => history.push(ROUTE.home)
                    }));
                }} />
            </div>
        </div>
    )
};

export default Event;