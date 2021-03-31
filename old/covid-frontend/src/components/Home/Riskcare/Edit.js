import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { classBind as cx, windowConfirm } from "../../../others/util";
import Title from "../../Common/Title";
import PlaceCard from "../../Common/PlaceCard";
import "./Edit.scss";
import { MODE, ROUTE } from "../../../others/const";
import { useHistory } from "react-router";
import Button from "../../Common/Button";
import { removeFavorite } from "../../../redux";

function Edit() {

    const history = useHistory();
    const dispatch = useDispatch();
    const position = useSelector(state => state.position);
    const favorite = useSelector(state => state.favorite);
    const { current } = position;

    const [selected, setSelected] = useState([])

    const toggle = id => {
        const copied = [...selected]
        const found = copied.indexOf(id)
        if (found === -1) {
            setSelected([...copied, id]);
        }
        else {
            copied.splice(found, 1);
            setSelected(copied);
        }
    }

    const remove = () => {
        if (!selected.length) return;

        let text = "";
        if (selected.length === 1) {
            const filtered = favorite.filter(item => item.id === selected[0])[0];
            text = `${filtered.locationName}을(를) 삭제하시겠습니까?`;
        }
        else {
            text = `${selected.length}개의 관심 장소를 삭제하시겠습니까?`;
        }

        const confirmed = windowConfirm(text);
        if (confirmed) dispatch(removeFavorite(selected));
        setSelected([]);    
    }

    return (
        <div className={cx("content", "edit")}>
            {current && <Title text="현재 위치" />}
            {current && <PlaceCard className={cx("freeze")} {...position} />}
            {!!favorite.length && <Title text="관심 장소 편집" />}
            {favorite.map((item, index) => <PlaceCard {...item} 
                key={index}
                className={cx(selected.includes(item.id) && "selected")}
                onClick={() => toggle(item.id)} 
            />)}       
            <div className={cx("buttons")}>
                <Button title="삭제" onClick={remove} disabled={!selected.length} />     
                <Button title="추가" onClick={() => history.push(`${ROUTE.search}?mode=${MODE.my}`) } />     
            </div>
        </div>
    )
}

export default Edit;