import { classBind as cx, getColor, getTodayFormatted } from '../../others/util';
import magnifier2 from '../../images/magnifier2.svg'
import close from '../../images/close.svg'
import "./index.scss"
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLocationsDongSearch } from '../../others/api';
import PlaceCard from '../Common/PlaceCard';
import Button from "../Common/Button";
import { useDispatch } from 'react-redux';
import { addFavorite, setPopup } from '../../redux';
import { useHistory, useLocation } from 'react-router';
import { CHART_DATE_INPUT, CUT, ENTER_KEY, EVENT_TIME_FORMAT, MODE, ROUTE } from '../../others/const';
import qs from "query-string";
import Emoji from '../Common/Emoji';
import moment from "moment";

function Search() {

	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { query, mode } = qs.parse(location.search);
	const [value, setValue] = useState(query || "")
	const [searched, setSearched] = useState(null)
	const inputRef = useRef();

	useEffect(() => {
		inputRef.current.focus();
	}, [])

	const init = useCallback(() => {
		const parsed = qs.parse(location.search);
		delete parsed.query;
		const stringified = qs.stringify(parsed)
		history.replace(`${location.pathname}?${stringified}`)
		setValue('')
		setSearched(null)
	}, [history, location])

	const search = useCallback(async () => {
		const { startTime } = qs.parse(location.search);
		const result = await getLocationsDongSearch(value, !startTime ? undefined : getTodayFormatted(true, moment(startTime, EVENT_TIME_FORMAT).format(CHART_DATE_INPUT)));
		const mapped = result.filter(item => (item.siDo === "서울특별시" && !!item.dong)).map(item => ({ 
			locationCode: item.code,
			locationName: `${item.siGunGu} ${item.dong}`,
			locationScore: item.locationScore,
		}))
		setSearched(mapped)
	}, [value, location])

	const handleSearch = useCallback(async () => {
		if (searched) init();
		else search();
	}, [searched, init, search])

	const handleChange = useCallback(e => {
		const { value: _value } = e.target
		setValue(_value)
		if (!_value) init();
	}, [init])

	const handleKeyPress = useCallback(e => {
		if (value && e.keyCode === ENTER_KEY) {
			search();
		}
	}, [value, search])

	const handleClick = useCallback(item => {
		const move = parsing => {
			const parsed = parsing ? qs.parse(location.search) : {} ;
			delete parsed.query;
			delete parsed.mode;
			parsed.locationName = item.locationName;
			parsed.locationCode = item.locationCode;
			parsed.locationScore = item.locationScore;
			const stringified = qs.stringify(parsed, { skipEmptyString: true });
			history.replace(`${ROUTE.event}?${stringified}`);
		}

		switch(mode) {
			case MODE.event: {		
				if (item.locationScore > CUT[1] && item.locationScore <= CUT[2]) {
					dispatch(setPopup({ Inner: () => {
						return (
							<div className={cx("search-popup")}>
								<div className={cx("text")}>{"선택한 장소는\n위험 장소입니다."}</div>
								<Emoji className={cx("emoji")} score={100} />
								<div className={cx("label")}>위험</div>					
								<Button title="다른 장소로 변경하기" onClick={() => dispatch(setPopup()) } />
								<Button title="무시하고 일정에 추가" onClick={() => {							
									move(true);
									dispatch(setPopup());
								}} />
							</div>
						)
					}}))
				}
				else {
					move(true)
					return
				}
				return
			}

			case MODE.my: {
				dispatch(addFavorite(item));
				dispatch(setPopup());
				history.goBack();
				return
			}

			default: {
				dispatch(setPopup({ Inner: () => {
					return (
						<div className={cx("search-popup")}>
							<div className={cx("text")}>{"선택한 장소를 어디에\n등록하겠습니까?"}</div>
							<Button title="나의 장소의 <b>관심 장소</b>로 등록" onClick={() => {
								dispatch(addFavorite(item));
								dispatch(setPopup());
								history.goBack();
							}}/>
							<Button title="<b>일정</b>에 등록" onClick={() => {
								dispatch(setPopup());
								move();
							}} />
						</div>
					)
				}}))
				return
			}
		}
	}, [dispatch, history, mode, location.search])

	return (
		<div className={cx("content", "search")}>
			<div className={cx("input")}>
				<input ref={inputRef}
					type="text"
					value={value}
					onKeyDown={handleKeyPress}
					onChange={handleChange}
					// placeholder="검색어 입력" 
					placeholder="지번주소로 검색하세요. (예: 압구정동, 이태원동 등)"
				/>
				<img className={cx("btn", !value && "disabled")} 
					onClick={handleSearch}
					src={(!searched || !value) ? magnifier2 : close} 
					alt="magnifier2" 
				/>
			</div>	
			{searched && <div className={cx("result")}>
				<div className={cx("title")}>검색 결과</div>
				{searched.map((item, index) => <PlaceCard key={index} borderColor={getColor(item.locationScore)} {...item} onClick={() => { handleClick(item) }} />)}
			</div>}
		</div>
	);
}

export default Search;
