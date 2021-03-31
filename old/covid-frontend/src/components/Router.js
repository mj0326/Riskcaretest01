import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header'
import { ROUTE } from '../others/const';
import Home from './Home'
import Search from './Search';
import { useEffect } from 'react';
import { loadFavorite, loadInformation, stackMessages } from '../redux';
import { useDispatch } from 'react-redux';
import Province from './Home/Dashboard/Province';
import City from './Home/Dashboard/City';
import { useInterval } from '../others/util';
import Popup from './Popup';
import ScrollTop from './Common/ScrollTop';
import Event from './Home/Riskcare/Event';
import Edit from './Home/Riskcare/Edit';
import Explanation from './Home/Riskcare/Explanation';
import Detail from './Home/Quotient/Detail';
import Schedule from './Home/Riskcare/Schedule';

function Router() {

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadFavorite());
		dispatch(loadInformation());
		dispatch(stackMessages());
	}, [dispatch]);

	useInterval(() => {
		// dispatch(loadInformation());
		// dispatch(stackMessages());
	}, 10 * 1000)

	return (
		<BrowserRouter>
			<Header />
			<Popup />
			<ScrollTop>
				<Switch>
					<Route exact path={ROUTE.home}><Home /></Route>
					<Route exact path={`${ROUTE.location}/:province`}><Province /></Route>
					<Route exact path={`${ROUTE.location}/:province/:city`}><City /></Route>
					<Route exact path={ROUTE.search}><Search /></Route>
					<Route exact path={ROUTE.event}><Event /></Route>
					<Route exact path={ROUTE.edit}><Edit /></Route>
					<Route exact path={ROUTE.explanation}><Explanation /></Route>
					<Route exact path={`${ROUTE.detail}/:code`}><Detail /></Route>
					<Route exact path={`${ROUTE.schedule}`}><Schedule /></Route>
				</Switch>
			</ScrollTop>
		</BrowserRouter>
	);
}

export default Router;
