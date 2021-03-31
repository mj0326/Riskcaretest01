import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MENU } from '../../others/const';
import { classBind as cx } from '../../others/util';
import "./Drawer.scss"
import { setPopup } from "../../redux";
import Introduction from "../Popup/Introduction";

function Drawer({ toggle }) {

	const dispatch = useDispatch();

	const merged = useMemo(() => {
		MENU[0].callback = () => {
			toggle();
			dispatch(setPopup(({ Inner: () => <Introduction tab={0} /> })));
		}
		return MENU;
	}, [dispatch, toggle])

	return (
		<div className={cx("drawer")}>
			<div className={cx("back")} onClick={toggle}></div>			
			<div className={cx("menu")}>
				{merged.map(({ icon, name, noti, callback }, index) => {
					return (
						<div key={index} className={cx("btn")} onClick={() => {
							if (typeof callback === "function") {
								callback()
							}
						}}>
							<img src={icon} alt={name} />
							<span className={cx('name')}>{name}</span>
							{noti && <span className={cx('noti')}>{noti}</span>}
						</div>
					)
				})}
			</div>
		</div>
	);
}

export default Drawer;
