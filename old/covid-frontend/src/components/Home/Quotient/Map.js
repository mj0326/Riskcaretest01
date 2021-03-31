import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { LEVEL_COLOR, LEVEL_LABEL } from "../../../others/const";
import { classBind as cx, getHashFromTab, getSubFromHash } from "../../../others/util";
import Tab from "../../Common/Tab";
import Layer from "./Layer";
import "./Map.scss";

function Map() {

    const location = useLocation();
    const history = useHistory();
    const { hash } = location;
    const defaultTab = getSubFromHash(hash);
    const [mapTab, setMapTab] = useState(defaultTab);

    return (
        <div className={cx("map")}>
            <Tab tabs={["사회적 접촉 지수", "심리적 지수"]} tabIndex={mapTab} setTabClick={index => {
                history.replace(`${location.pathname}${location.search}${getHashFromTab(1, index)}`)
                setMapTab(index)
            }} />
            <div className={cx("legend")}>
                {LEVEL_LABEL.map((label, index) => {
                    return (
                        <div key={index}>
                            <div style={{ backgroundColor: LEVEL_COLOR[index] }}></div>
                            <div>{label}</div>
                        </div>
                    )
                })}
            </div>
            <Layer />
        </div>
    )
}

export default Map;