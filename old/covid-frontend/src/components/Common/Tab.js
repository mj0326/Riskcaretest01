import { classBind as cx } from "../../others/util";
import "./Tab.scss";

function Tab({ className = "common-data-tab", disabled, tabs, tabIndex, setTabClick }) {
    return (
        <div className={cx(className)}>
            {tabs.map((Tab, index) => {
                return (
                    <div key={index}
                        className={cx(index === tabIndex && "active", disabled && "disabled")}
                        onClick={() => !disabled && setTabClick(index)}
                    >
                        {typeof Tab === "function"  ? <Tab /> : Tab}
                    </div>
                )
            })}
        </div>
    )
}

export default Tab;