import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { ROUTE } from "../../../others/const";
import { calcFromNow, classBind as cx, commas, descend } from "../../../others/util";
import right from '../../../images/right.svg';
import Reference from "./Reference";
import "./Province.scss";
import { loadProvinceMessages } from "../../../redux";

const Province = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const information = useSelector(state => state.information);
    const provinceMessages = useSelector(state => state.provinceData.messages);
    const provinceCount = useSelector(state => state.provinceData.count);
    const { params } = useRouteMatch(`${ROUTE.location}/:province`);
    const { province } = params;

    useEffect(() => {
        dispatch(loadProvinceMessages(province));
    }, [dispatch, province])

    const { cities, summary } = useMemo(() => { 
        const cities = {};
        if (provinceMessages.length) {
            provinceMessages.forEach(item => {
                const key = item.si_gun_gu || item.si_do
                if (!cities[key]) {
                    const found = provinceCount.find(_item => _item.si_gun_gu === key)
                    const count = key === item.si_do ? provinceCount[0].today : (found ? found.today : 0)
                    cities[key] = {
                        count,
                        last: item.t,
                    }
                }
                else {
                    cities[key].last = item.t
                }
            })
        }

        const { daily } = information
        const _daily = daily.filter(item => item.si_do === province)[0] || {}
        const summary = {
            today: _daily.today,
            yesterday: _daily.yesterday,
            newly: provinceMessages.length,
            checking: 0
        }
        return { cities, summary }
    }, [provinceMessages, provinceCount, information, province])
    
    return (
        <div className={cx("content", "province")}>
			<div className={cx("summary")}>
				<div>
					<div>오늘 신규 확진</div>
					<div>{commas(summary.today)}명</div>
				</div>
				{/* <div>
					<div>어제 집계</div>
					<div>{commas(summary.yesterday)}</div>
				</div> */}
				{/* <div>
					<div>오늘 신규 알림</div>
					<div>{commas(summary.newly)}건</div>
				</div> */}
				<div>
					<div>확인 중</div>
					<div>{commas(summary.checking)}명</div>
				</div>
			</div>

            <Reference />

            <table>
				<tbody>
					{Object.keys(cities).sort(descend).map(key => {
						return (
							<tr key={key} onClick={() => { history.push(`${ROUTE.location}/${province}/${key}`) }}>
								<td>{key}</td>
								<td>{commas(cities[key].count)}명 발생</td>
								<td>{calcFromNow(cities[key].last)}</td>
								<td><img src={right} alt="right" /></td>
							</tr>
						)
					})}
				</tbody>
			</table>
        </div>
    )
}

export default Province;