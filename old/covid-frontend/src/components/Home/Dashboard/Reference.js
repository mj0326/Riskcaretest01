import moment from "moment";
import { useSelector } from "react-redux";
import { EVENT_TIME_FORMAT, REFERENCE_FORMAT, REFERENCE_FORMAT_WITH_YEAR } from "../../../others/const";
import { classBind as cx } from "../../../others/util";
import "./Reference.scss";

const Reference = ({ full }) => {

    const now = moment();
    const hh = Number(now.format("H"));
    const midnight = now.format("YYYY-MM-DD")
    const today = moment(midnight);
    const yesterday = today.subtract(1, 'day');
    const date = hh >= 10 ? today : yesterday;

    const messages = useSelector(state => state.messages);
    const newly = !messages[0] ? now : moment(messages[0].t, EVENT_TIME_FORMAT);
    
    return(
        <div className={cx("reference")}>
            {full ? 
            <>
                {`총 누적: ${date.add(10, 'hour').format(REFERENCE_FORMAT)}`}
                {<span>|</span>}
                {`신규: ${newly.format(REFERENCE_FORMAT)}`}
            </> : <>
                {newly.format(REFERENCE_FORMAT_WITH_YEAR)}
            </>}
        </div>
    )
}

export default Reference;