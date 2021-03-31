import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { ROUTE } from "../../../others/const";
import { classBind as cx } from "../../../others/util";
import { setDongDetail } from "../../../redux";
import "./Detail.scss";
import Section from "./Section";

function Detail() {

    const dispatch = useDispatch();
    const { contact, mental, weekly } = useSelector(state => state.dongDetail);
    const { params } = useRouteMatch(`${ROUTE.detail}/:code`);
    const { code } = params;

    useEffect(() => {
        dispatch(setDongDetail(code));
    }, [dispatch, code])

    return (
        <div className={cx("detail", "content")}>
            <Section title="사회적 접촉 지수" data={contact} set={[
                // "flow_score", "taxi_score", "subway_score", "outdoor_activity_score"
                "flow_score", "taxi_score", "subway_score"
            ]} chart chartData={weekly}/>
            <Section title="심리적 지수" data={mental} set={[
                "job_score", "move_score", "preg_score", "security_score", "date_score", "call_15770199_score"
            ]} />
        </div>
    );
}

export default Detail;