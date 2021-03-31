import { classBind as cx, getCaution, getColor, getLabel, makeExplanatinoLink, verifyCode } from "../../../others/util";
import previous from '../../../images/previous.svg'
import information from '../../../images/information.svg'
import next from '../../../images/next.svg'
import "./Explanation.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDongDetail, setExplanation, setPopup } from "../../../redux";
import Emoji from '../../Common/Emoji';
import Slider from "./Slider";
import Button from "../../Common/Button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { ROUTE, SCORE_NAME } from "../../../others/const";
import qs from "query-string";
import Introduction from "../../Popup/Introduction";
import Tab from "../../Common/Tab";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function Explanation() {

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const favorite = useSelector(state => state.favorite);
    const position = useSelector(state => state.position);
    const explanation = useSelector(state => state.explanation);
    const { code: locationCode, current } = qs.parse(location.search);
    const { locationScore, locationName, flow, taxi, subway } = explanation || {};
    // const { outdoor } = explanation || {};

    const [menuTab, setMenuTab] = useState(0);
    const { weekly } = useSelector(state => state.dongDetail);
    
    useEffect(() => {
        dispatch(setExplanation({ locationCode, current }));
        dispatch(setDongDetail(locationCode));
    }, [dispatch, locationCode, current])

    const move = useCallback(to => {
        const item = to === -1 ? position : favorite[to];
        const link = makeExplanatinoLink(item);
        history.replace(link);
    }, [history, favorite, position])

    const index = useMemo(() => favorite.findIndex(item => verifyCode(item.locationCode) === locationCode), [favorite, locationCode]);
    const cautions = useMemo(() => getCaution(locationScore), [locationScore]);

    const showInformation = useCallback(() => {
        dispatch(setPopup({ Inner: () => <Introduction tab={1} /> }));

        // dispatch(setPopup({ Inner: () => {
        //     return (
        //         <div className={cx("information-popup")}>
        //             <table>
        //                 <tbody>
        //                     {LEVEL_INFORMATION.map((item, index) => {
        //                         return (
        //                             <tr key={index}>
        //                                 <td>
        //                                     <Emoji score={item.min} />
        //                                     <div>{item.label}</div>
        //                                 </td>
        //                                 <td>
        //                                     <div>{item.min}점 ~ {item.max}점</div>
        //                                     <ul>{item.caution.map((listItem, index) => <li key={index}>{listItem}</li>)}</ul>
        //                                 </td>
        //                             </tr>
        //                         )
        //                     })}
        //                 </tbody>
        //             </table>                    
        //         </div>
        //     )
        // }}))
    }, [dispatch])

    return (
        <div className={cx("explanation", "content")}>
            {/* <div className={cx("code")}>{locationCode} {flow} {taxi} {subway} {outdoor}</div> */}
            <Emoji className={cx("emoji")} score={locationScore} />
            <div className={cx("name")}>
                <img className={cx('btn', index === -1 && 'disabled' )} src={previous} alt="previous" onClick={() => move(index - 1)} />
                <span>{locationName || locationCode}</span>
                <img className={cx('btn', index === favorite.length - 1 && 'disabled')} src={next} alt="previous" onClick={() => move(index + 1)} />
            </div>
            {current && <div className={cx("current")}>(현재 위치)</div>}
            <div className={cx("label")} style={{ color: getColor(locationScore) }}>{getLabel(locationScore)}</div>
            <ul className={cx("description")}>
                {cautions.map((caution, key) =>  <li key={key}>{caution}</li>)}
            </ul>
            <div className={cx("btn", "information")} onClick={showInformation}>
                <span>기준정보</span>
                <img src={information} alt="information" />
            </div>
            <Tab tabs={["현재", "추이"]} tabIndex={menuTab} setTabClick={setMenuTab} />
            {menuTab === 0 && <Slider title="유동 인구" value={flow} />}
            {menuTab === 0 && <Slider title="택시 수요" value={taxi} />}
            {menuTab === 0 && <Slider title="지하철 수요" value={subway} />}
            {/* {menuTab === 0 && <Slider title="재택 지수" value={outdoor} reversed />} */}
            {menuTab === 1 && <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weekly}>
                    <XAxis dataKey="name" tickLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} width={20} />
                    <CartesianGrid vertical={false} />
                    <Legend style={{ fontSize: 10 }} />
                    <Line type="linear" dataKey={SCORE_NAME["flow_score"]} stroke="#f6d258" strokeWidth={1} />
                    <Line type="linear" dataKey={SCORE_NAME["taxi_score"]} stroke="#d1af94" strokeWidth={1} />
                    <Line type="linear" dataKey={SCORE_NAME["subway_score"]} stroke="#97d5e0" strokeWidth={1} />
                    {/* <Line type="linear" dataKey={SCORE_NAME["outdoor_activity_score"]} stroke="#efcec5" strokeWidth={1} /> */}
                    <Line type="linear" dataKey={SCORE_NAME["contact_score"]} stroke="#ff6341" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>}
            <Button className={cx("bottom")} title="상세 정보 더보기" onClick={() => {
                history.push(`${ROUTE.detail}/${locationCode}`);
            }} />
        </div>
    )
}

export default Explanation;