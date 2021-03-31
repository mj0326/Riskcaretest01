import Place from './Place'
import Calendar from './Calendar'
import { classBind as cx } from '../../../others/util';
import "./index.scss";

function Riskcare() {

	return (
		<div className={cx("riskcare")}>
			<Place />
			<Calendar />
		</div>
	);
}

export default Riskcare;
