import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { ROUTE } from "../../../others/const";
import { addLink, calcFromNow, classBind as cx } from "../../../others/util";
import { loadCityMessages } from "../../../redux";
import "./City.scss";

const City = () => {

    const dispatch = useDispatch();
    const cityMessages = useSelector(state => state.cityMessages);
    const { params } = useRouteMatch(`${ROUTE.location}/:province/:city`);
    const { province, city } = params

    useEffect(() => {
        dispatch(loadCityMessages({ province, city }));
    }, [dispatch, province, city])

    return (
        <div className={cx("content", "city")}>
            {cityMessages.map((item, index) => {
                return (
                    <div key={index}>
                        <div dangerouslySetInnerHTML={{ __html: addLink(item.msg) }}></div>
                        <div>{calcFromNow(item.t)}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default City;