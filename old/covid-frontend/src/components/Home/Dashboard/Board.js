import Title from "../../Common/Title";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import chart2 from '../../../images/chart2.svg'
import { classBind as cx, commas } from '../../../others/util';
import "./Board.scss"
import { ResponsiveContainer, LineChart, Bar, BarChart, Line, XAxis, YAxis, CartesianGrid, Legend, LabelList } from 'recharts';
import Reference from './Reference';
import Tab from '../../Common/Tab';

function Board() {
    
    const { sum, delta, newly } = useSelector(state => state.panelData)
    const { hourly, weekly } = useSelector(state => state.chartData)

    const [chartTab, setChartTab] = useState(0)

    return (
        <div className={cx("board")}>
            <Title img={chart2} text="확진자 현황" />

            <div className={cx("panel")}>
                <div className={cx("count")}>
                    <div className={cx("text")}>총 누적 확진</div>
                    <div className={cx("number")}>{commas(sum)}</div>
                    <div className={cx("delta")}>{`(${delta > 0 ? "+ " : ""}${commas(delta)})`}</div>
                </div>            

                <div className={cx("divider")}></div>            

                <div className={cx("count")}>
                    <div className={cx("text")}>신규 확진</div>
                    <div className={cx("number")}>{commas(newly)}</div>
                    <div className={cx("delta", "no-show")}>-</div>
                </div>            
            </div>

            <Reference full />
            
            <Tab tabs={["오늘", "일별"]} tabIndex={chartTab} setTabClick={setChartTab} />

            {chartTab === 0 && <ResponsiveContainer width="100%" height={220}>
                <LineChart data={hourly}>
                    <XAxis dataKey="name" tickLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} width={20} />
                    <CartesianGrid vertical={false} />
                    <Legend style={{ fontSize: 10 }} />
                    <Line type="linear" dataKey="어제" stroke="#dee2e6" strokeWidth={2} />
                    <Line type="linear" dataKey="오늘" stroke="#ff6341" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>}
            
            {chartTab === 1 && <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weekly} margin={{ top: 15, right: 0, left: 5, bottom: 0 }}>
                    <XAxis dataKey="name" tickLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} width={25} />
                    <CartesianGrid vertical={false} />
                    {/* <Legend style={{ fontSize: 10 }} /> */}
                    <Bar dataKey="min" barSize={15} stackId="a" fill="#ff634177"></Bar>
                    <Bar dataKey="data" barSize={15} stackId="a" fill="#ff6341">
                        <LabelList dataKey="label" position="top" fontSize={10} />
                    </Bar>
                </BarChart>

            </ResponsiveContainer>}
        </div>
    )
}

export default Board;