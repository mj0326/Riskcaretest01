import moment from "moment";
import noti from '../../images/noti.svg'
import more from '../../images/more.svg'
import close2 from '../../images/close2.svg'
import magnifier from '../../images/magnifier.svg'
import back from '../../images/back.svg'
import {classBind as cx, freezeBody, unfreezeBody} from '../../others/util';
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import "./index.scss"
import {CODE_ADDRESS, MODE, ROUTE} from '../../others/const';
import Drawer from './Drawer'
import {useCallback, useEffect, useMemo, useState} from 'react';
import qs from "query-string";
import {setPopup} from "../../redux";
import {useDispatch} from "react-redux";

function Header() {

	const history = useHistory();
	const location = useLocation();
	const provinceMatch = useRouteMatch(`${ROUTE.location}/:province/`);
	const cityMatch = useRouteMatch(`${ROUTE.location}/:province/:city`);
	const codeMatch = useRouteMatch(`${ROUTE.detail}/:code`);
	const match = cityMatch || provinceMatch;
	const { gu, mode, time } = qs.parse(location.search);
	const dispatch = useDispatch();
	const [drawer, setDrawer] = useState(false);

	const toggle = useCallback(() => {
		if (drawer) {
			unfreezeBody();
			// for app
			window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "CLOSE_DRAWER" }, '*'));
		} else {
			freezeBody();
			// for app
			window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "OPEN_DRAWER" }, '*'));
		}

		setDrawer(!drawer)
	}, [drawer]);

	// for app
	useEffect(() => {
		document.addEventListener('message', (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'CLOSE_POPUP') {
					dispatch(setPopup());
				} else if (data.type === 'CLOSE_DRAWER') {
					setDrawer(false);
					unfreezeBody();
					window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "CLOSE_DRAWER" }, '*'));
				}
			} catch (e) {

			}
		})
	}, []);

	const isHome = useMemo(() => location.pathname === ROUTE.home && !gu, [location, gu])
	const headerTitle = useMemo(() => {	
		if (gu) return gu;
		else if (location.pathname.startsWith(ROUTE.search)) return "장소 검색";
		else if (location.pathname.startsWith(ROUTE.edit)) return "관심 장소 편집";
		else if (location.pathname.startsWith(ROUTE.explanation)) return "나의 장소";
		else if (location.pathname.startsWith(ROUTE.location)) return match.params.city || match.params.province;
		else if (location.pathname.startsWith(ROUTE.detail)) return codeMatch.params.code ? CODE_ADDRESS[codeMatch.params.code].split(" ")[1] : "";
		else if (location.pathname.startsWith(ROUTE.event)) {
			if (mode === MODE.edit) return "일정 편집"
			else return "일정 추가";
		}
		else if (location.pathname.startsWith(ROUTE.schedule)) {
			return moment.unix(time).format("MM월 DD일 (ddd)")
		}
		else return "";
	}, [location, match, codeMatch, gu, mode, time]);

	const go = useCallback(route => {
		setDrawer(false);
		history.push(route)
	}, [history]);

	return (
		<div className={cx("header", drawer && 'has-drawer')}>
			<div className={cx("bar")}>
				{isHome && <img className={cx("more", "btn")} src={drawer ? close2 : more} alt="more" onClick={toggle} />}
				{isHome && <img className={cx("btn")} src={magnifier} alt="magnifier" onClick={() => { go(ROUTE.search) }} />}
				{isHome && <img className={cx("btn", "disabled")} src={noti} alt="noti" />}
				{!isHome && <img className={cx("back", "btn")} src={back} alt="back" onClick={() => {
					// for android back button
					if (gu) {
						window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "URL", data: '/app/index.html' }, '*'));
					}
					history.goBack()
				}} />}
				{!isHome && <span>{headerTitle}</span>}
			</div>
			{drawer && <Drawer toggle={toggle} />}
		</div>
	);
}

export default Header;
