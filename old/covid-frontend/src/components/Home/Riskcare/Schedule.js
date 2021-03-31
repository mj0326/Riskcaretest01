import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { classBind as cx } from "../../../others/util";
import "./Schedule.scss";
import qs from "query-string";
import { useHistory, useLocation } from "react-router";
import PlaceCard from "../../Common/PlaceCard";
import { useEffect } from "react";
import { loadSchedule } from "../../../redux";
import { MODE, MONTH_FORMAT, ROUTE } from "../../../others/const";

function Schedule() {

    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { time } = qs.parse(location.search);

    const schedule = useSelector(state => state.schedule);
    const data = schedule[Number(moment.unix(time).format("DD"))];

    useEffect(() => {
        if (!schedule.length) {
            const month = moment.unix(time).format(MONTH_FORMAT);
            dispatch(loadSchedule(month));
        }
    }, [dispatch, time, schedule.length])

    return (
        <div className={cx("schedule", "content")}>
            {(data || []).map((item, index) => {
                return (
                    <PlaceCard key={index} 
                        locationName={item.summary}
                        locationScore={item.locationScore}
                        rightArrow
                        description={item.location}
                        onClick={() => {
                            const query = { ...item, mode: MODE.edit };
                            query.locationName = query.location;
                            delete query.location;
                            history.push(`${ROUTE.event}?${qs.stringify(query, { skipEmptyString: true })}`)
                        }} 
                    />
                )
            })}            
        </div>
    )
}

export default Schedule;