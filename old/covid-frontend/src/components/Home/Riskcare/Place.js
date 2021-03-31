import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { classBind as cx, getColor, makeExplanatinoLink } from '../../../others/util';
import pin from '../../../images/pin.svg'
import target from '../../../images/target.svg'
import "./Place.scss"
import { getCurrentPosition, setPopup } from '../../../redux';
import PlaceCard from '../../Common/PlaceCard'
import Button from '../../Common/Button'
import Spinner from '../../Common/Spinner'
import edit from '../../../images/edit.svg'
import Title from "../../Common/Title";
import { useHistory } from 'react-router';
import { ROUTE } from "../../../others/const";
import information from "../../../images/information.svg";
import Introduction from "../../Popup/Introduction";

function Place() {

    const dispatch = useDispatch();
    const history = useHistory();
    const positioning = useSelector(state => state.positioning)
    const position = useSelector(state => state.position)
    const favorite = useSelector(state => state.favorite)

    const list = useMemo(() => {
        if (Object.keys(position).length) return [position, ...favorite];
        else return favorite;
    }, [position, favorite])

	return (
		<div className={cx("place")}>
            <Title img={pin} text="나의 장소" 
                Extra={() => (
                    <img className={cx("extra", "btn")} src={information} alt="information" onClick={() => {
                        dispatch(setPopup({ Inner: () => <Introduction tab={0} /> }));
                    }}/>
                )} 
                Right={() => (
                    <div className={cx(positioning ? "freeze" : "btn")} onClick={() => {
                        dispatch(getCurrentPosition());
                    }}>
                        {positioning 
                            ? <><Spinner size={19} /><span>위치 가져오는 중</span></>
                            : <><img src={target} alt="position" /><span>위치 재설정</span></>
                        }                    
                    </div>
                )} 
            />
            {list.map((item, index) => <PlaceCard key={index} {...item} borderColor={getColor(item.locationScore)} onClick={() => {
                const link = makeExplanatinoLink(item);
                history.push(link);
            }} />)}       
            <Button svg={edit} 
                title="편집" 
                onClick={() => history.push(ROUTE.edit)}
                disabled={!favorite.length} 
            />     
		</div>
	);
}

export default Place;
