import { classBind as cx, getColor } from "../../../others/util";
import "./Slider.scss";

function Slider({ title, value, reversed }) {
    const _value = (reversed && value !== undefined) ? 100 - value : value
    return (
        <div className={cx("slider")}>
            <div className={cx("title")}>{title}</div>
            <div className={cx("bar")}>
                <div className={cx("point")} style={{ 
                    left: value ? `calc(${_value}% - 18px / 2)` : -9,
                    borderColor: getColor(_value),
                    boxShadow: `0 0 0 9px ${getColor(_value)}33`
                }}></div>
            </div>
            <div className={cx("axis")}>
                <span>안전</span>
                <span>위험</span>
            </div>
        </div>
    )
}

export default Slider;