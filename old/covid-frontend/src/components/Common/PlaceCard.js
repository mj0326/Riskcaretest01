import { classBind as cx, getBackgroundColor, getColor, getLabel } from '../../others/util';
import Emoji from './Emoji'
import './PlaceCard.scss'
import right from "../../images/right.svg";

function PlaceCard({ className, locationScore, locationName, description, current, onClick, rightArrow }) {
    return (
        <div className={cx(className, "place-card", description && "thick")} onClick={onClick} style={{ borderColor: getColor(locationScore), backgroundColor: getBackgroundColor(locationScore) }}>
            <div className={cx("left")}>
                <Emoji score={locationScore} />
                <div className={cx("label")} style={{ color: getColor(locationScore, true) }}>{getLabel(locationScore)}</div>
            </div>
            <div className={cx("right")}>
                <div className={cx("name")}>
                    <div>
                        {locationName}
                        {current && <span className={cx("current")}>&ensp;(현재 위치)</span>}
                    </div>
                    {description && <div className={cx("description")}>{description}</div>}
                </div>
                {rightArrow && <img src={right} alt="right" />}
            </div>
        </div>
    )
}

export default PlaceCard;
