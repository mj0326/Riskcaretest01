import { classBind as cx } from "../../others/util";
import "./Title.scss";

function Title({ className, img, text, Extra, Right }) {
    return (
        <div className={cx(className, "common-title")}>
            {img && <img src={img} alt={text} />}
            <span className={cx("text")}>
                {text}
                {Extra && <Extra />}
            </span>
            {Right && <Right />}
        </div>
    )
}

export default Title;