import { classBind as cx } from '../../../others/util';
import Board from './Board';
import Region from './Region';
import "./index.scss"

function Dashboard() {
	
	return (
		<div className={cx("dashboard")}>
			<Board />
			<Region />
		</div>
	);
}

export default Dashboard;
