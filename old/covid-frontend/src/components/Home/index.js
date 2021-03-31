import { useState } from 'react';
import Riskcare from './Riskcare'
import Quotient from './Quotient'
import Dashboard from './Dashboard'
import { classBind as cx, getHashFromTab, getTabFromHash } from '../../others/util';
import "./index.scss"
import { useHistory, useLocation } from 'react-router';
import Tab from '../Common/Tab';
import qs from "query-string";

function Home() {

	const location = useLocation();
	const history = useHistory();
	const { hash } = location;
	const defaultTab = getTabFromHash(hash)
	const [homeTab, setHomeTab] = useState(defaultTab)
	const { gu } = qs.parse(location.search);

	return (
		<div className={cx("content", "home")}>
			{!gu && <Tab className={"tab"} 
				tabIndex={homeTab} 
				setTabClick={index => {
					history.replace(`${location.pathname}${getHashFromTab(index)}`)
					setHomeTab(index)
				}} 
				tabs={[
					() => <span className={cx("highlight")}>Riskcare</span>,
					() => <span>지역 정보</span>,
					() => <span>COVID-19 현황</span>,
				]} 
			/>}
			{homeTab === 0 && <Riskcare />}
			{homeTab === 1 && <Quotient />}
			{homeTab === 2 && <Dashboard />}
		</div>
	);
}

export default Home;
