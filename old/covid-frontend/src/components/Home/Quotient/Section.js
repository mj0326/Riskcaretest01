import { classBind as cx } from "../../../others/util";
import "./Section.scss";
import Title from "../../Common/Title";
import Slider from "../Riskcare/Slider";
import { SCORE_NAME } from "../../../others/const";
import Reference from "../Dashboard/Reference";
import { useState } from "react";
import Tab from "../../Common/Tab";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function Section({ title, data = {}, set = [], chart, chartData }) {

    const [menuTab, setMenuTab] = useState(0);

    const score = data.contact_score || data.total_score;
    const rankInSeoul = data.rank_in_si_do;
    const countInSeoul = data.total_in_si_do;
    const rank = data.contact_rank || data.total_rank;
    const count = data.total_in_si_gun_gu;

    return (
        <div className={cx("section")}>
            <Title text={title} />
            <div className={cx("panel")}>
                <div className={cx("count", "score")}>
                    <div className={cx("text")}>위험도 점수</div>
                    <div className={cx("number")}>{score}점</div>
                </div>            

                <div className={cx("divider")}></div>            

                <div className={cx("count", "rank")}>
                    <div className={cx("text")}>서울 기준 위험도 순위</div>
                    <div className={cx("number")}>{rankInSeoul}위 <span>/ 총 {countInSeoul}동</span></div>
                </div> 

                <div className={cx("divider")}></div>            

                <div className={cx("count", "rank")}>
                    <div className={cx("text")}>{data.si_gun_gu} 기준 위험도 순위</div>
                    <div className={cx("number")}>{rank}위 <span>/ 총 {count}동</span></div>
                </div>
            </div>
            {chart && <Tab tabs={["현재", "최근 3주"]} tabIndex={menuTab} setTabClick={setMenuTab} />}
            {menuTab === 0 && set.map(index => <Slider key={index} title={SCORE_NAME[index]} value={data[index]} reversed={index === "outdoor_activity_score"} />)}
            {menuTab === 0 && <Reference />}
            {menuTab === 1 && <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
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
        </div>
    );
}

export default Section;