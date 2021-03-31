import { useDispatch, useSelector } from "react-redux";
import { classBind as cx } from "../../others/util";
import "./index.scss";
import close3 from "../../images/close3.svg";
import { setPopup } from "../../redux";

function Popup() {
    
    const dispatch = useDispatch();
    const popup = useSelector(state => state.popup);
    if (!popup) return null;

    const { Inner } = popup

    const close = () => {
        dispatch(setPopup())
    }

    return (
        <div className={cx("popup")}>
            <div className={cx("inner")}>
                <img className={cx("close", "btn")} src={close3} alt="close3" onClick={close} />  
                {Inner && <Inner />}
            </div>
        </div>
    )
}

export default Popup;