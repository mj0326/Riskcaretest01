import { classBind as cx } from "../../../others/util";
import Map from "./Map";
import "./index.scss";
import { useLocation } from "react-router";
import qs from "query-string";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScoreRanking } from "../../../redux";
import List from "./List";

function Quotient() {

    const location = useLocation();
    const dispatch = useDispatch();
    const { gu } = qs.parse(location.search);
    const { hash } = location;

    useEffect(() => {
        dispatch(setScoreRanking({ gu, hash }));
    }, [dispatch, gu, hash])

    return (
        <div className={cx("quotient")}>
            <Map />
            <List />
        </div>
    )
}

export default Quotient;