import { useDispatch, useSelector } from 'react-redux'
import { classBind as cx, getColor, getWeekList } from '../../../others/util';
import calendar from '../../../images/calendar.svg';
// import map from '../../../images/map.svg';
import plus from '../../../images/plus.svg';
import dots from '../../../images/dots.svg';
import previous from '../../../images/previous.svg';
import next from '../../../images/next.svg';
import ellipsis from '../../../images/ellipsis.svg';
import './Calendar.scss';
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EVENT_TIME_FORMAT, MODE, MONTH_FORMAT, ROUTE } from '../../../others/const';
import Button from '../../Common/Button'
import Title from "../../Common/Title";
import { useHistory } from 'react-router';
import qs from "query-string";
import { loadSchedule } from '../../../redux';

function Calendar() {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const schedule = useSelector(state => state.schedule);

    const [month, setMonth] = useState(moment().format(MONTH_FORMAT));

    useEffect(() => {
        dispatch(loadSchedule(month));
    }, [dispatch, month]);

    const weekList = useMemo(() => {
        const first = Number(moment(month, MONTH_FORMAT).format('e')) // week day
        const length = Number(moment(month, MONTH_FORMAT).add(1, 'month').subtract(1, 'day').format('D'))  
        return getWeekList(first, length)
    }, [month]);

    const handleClick = useCallback(sliced => {
        switch (sliced.length) {
            case 1:
                const item = sliced[0]
                const query = { ...item, mode: MODE.edit };
                query.locationName = query.location;
                delete query.location;
                history.push(`${ROUTE.event}?${qs.stringify(query, { skipEmptyString: true })}`)
                return;
            case 2:
                const timestamp = moment(sliced[0].startTime, EVENT_TIME_FORMAT).unix();
                history.push(`${ROUTE.schedule}?time=${timestamp}`);
                return;
            default:
                history.push(ROUTE.event);       
        }
    } ,[history])

	return (
		<div className={cx("calendar")}>
            <Title img={calendar} text="나의 일정" Right={() => <img className={cx("disabled")} src={dots} alt="dots" />} />
            <div className={cx('table')}>
                <div className={cx('month')}>
                    <img className={cx('btn')} src={previous} alt="previous" onClick={() => { setMonth(moment(month, MONTH_FORMAT).subtract(1, 'month').format(MONTH_FORMAT)) }} />
                    <span>{moment(month, MONTH_FORMAT).format('YYYY년 MM월')}</span>
                    <img className={cx('btn')} src={next} alt="next" onClick={() => { setMonth(moment(month, MONTH_FORMAT).add(1, 'month').format(MONTH_FORMAT)) }} />
                </div>
                <table>
                    <tbody>
                        {weekList.map((week, wIndex) => (
                            <tr key={wIndex}>
                                {week.map((day, dIndex) => {
                                    if (day === 0) return <td key={dIndex}></td>
                                    const list = schedule[day] || []
                                    const sliced = list.slice(0, 2)
                                    return (
                                        <td key={dIndex} className={cx("btn")} onClick={() => handleClick(sliced)}>
                                            <div>{day}</div>
                                            {sliced.map((item, lIndex) => {
                                                if (moment(item.startTime, EVENT_TIME_FORMAT).format(MONTH_FORMAT) !== month) {
                                                    return null
                                                }

                                                return (
                                                    <div key={lIndex} 
                                                        className={cx("item", "btn")} 
                                                        style={{ backgroundColor: getColor(item.locationScore) }}
                                                    >
                                                        {item.summary}
                                                    </div>
                                                )
                                            })}
                                            {list.length > 2 && <div className={cx("ellipsis")}>
                                                <img src={ellipsis} alt="ellipsis" />
                                            </div>}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={cx("buttons", "single")}>
                {/* <Button disabled svg={map} title="지도로 보기" onClick={() => {}} />      */}
                <Button svg={plus} title="일정 추가" onClick={() => history.push(ROUTE.event) } />     
            </div>
		</div>
	);
}

export default Calendar;
