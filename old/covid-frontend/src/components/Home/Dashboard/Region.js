import { calcFromNow, classBind as cx, commas } from "../../../others/util";
import compass from "../../../images/compass.svg";
import "./Region.scss";
import { useMemo } from "react";
// import { useState } from "react";
import { useSelector } from "react-redux";
import { ROUTE, SHORT_PROVINCE } from "../../../others/const";
import right from '../../../images/right.svg';
import { useHistory } from "react-router";
import Title from "../../Common/Title";
// import Tab from "../../Common/Tab";

function Region() {

    const history = useHistory();
    const regionData = useSelector(state => state.regionData)
    const messages = useSelector(state => state.messages)
    // const [typeTab, setTypeTab] = useState(0)

    const updated = useMemo(() => {
        if (!Object.keys(regionData).length) {
            return {}
        }

        const result = { ...regionData }
        messages.forEach(item => {
            const current = result[item.si_do]
            if (!current.update || 
                current.update < item.t) {
                current.update = item.t;
            }
        })

        return result
    }, [regionData, messages])

    return (
        <div className={cx("region")}>
            <Title img={compass} text="지역별 현황" />
            {/* <Tab disabled tabs={["목록", "지도"]} tabIndex={typeTab} setTabClick={setTypeTab} /> */}
            <table>
                <thead>
                    <tr>
                        <th>지역</th>
                        <th>총 누적 확진</th>
                        <th>신규</th>
                        <th>업데이트</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(updated).map(key => {
                        const data = updated[key]
                        return (
                            <tr key={key} onClick={() => { history.push(`${ROUTE.location}/${key}`) }}>
                                <td>{SHORT_PROVINCE[key]}</td>
                                <td>{commas(data.sum)}명 ({data.delta > 0 ? "+" : ""}{commas(data.delta)}명)</td>
                                <td>{commas(data.newly)}명</td>
                                <td>{data.update ? calcFromNow(data.update) : "-"}</td>
                                <td><img src={right} alt="right" /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Region;