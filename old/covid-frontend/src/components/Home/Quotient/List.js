import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { ROUTE } from "../../../others/const";
import { classBind as cx, getDelta, getDeltaColor } from "../../../others/util";
import Reference from "../Dashboard/Reference";
import "./List.scss";
import qs from "query-string";
import right from "../../../images/right.svg";

function List() {

    const location = useLocation();
    const history = useHistory();
    const scoreRanking = useSelector(state => state.scoreRanking);
    const { gu } = qs.parse(location.search);
    const { hash } = location;

    const click = ({ key, code }) => {
        if (gu) {
            history.push(`${ROUTE.detail}/${code}`);
        }
        else {
            // for android back button
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "URL", data: 'not-home' }, '*'));
            history.push(`${ROUTE.home}?gu=${key}${hash}`);
        }
    }

    return (
        <div className={cx("list")}>
            <Reference />
            <table>
                <thead>
                    <tr>
                        <th>구</th>
                        <th>위험도 점수</th>
                        <th>위험도 순위</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(scoreRanking).map(key => {
                        const item = scoreRanking[key];
                        return (
                            <tr key={key} onClick={() => click({ key, code: item.code})}>
                                <td>{key}</td>
                                <td>
                                    <div>{item.score}점</div>
                                    <div style={{ color: getDeltaColor(item.score_delta) }}>
                                        ({getDelta(item.score_delta)}점)
                                    </div>
                                </td>
                                <td>
                                    <div>{item.rank}위</div>
                                    <div style={{ color: getDeltaColor(item.rank_delta) }}>
                                        ({getDelta(item.rank_delta)}위)
                                    </div>
                                </td>
                                <td><img src={right} alt="right" /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default List;
