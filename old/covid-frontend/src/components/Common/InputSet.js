import { useState } from "react";
import { classBind as cx, getColor, getLabel } from "../../others/util";
import "./InputSet.scss";

function InputSet({ className, locationScore, hasScore, defaultValue, title, placeholder, blurCallback, focusCallback }) {
    
    const [value, setValue] = useState(defaultValue || "")
        
    return (
        <div className={cx(className, "common-input-set")}>
            <div className={cx("title")}>{title}</div>
            <div className={cx("wrapper")}>
                {hasScore && <span style={{ color: getColor(locationScore) }}>({getLabel(locationScore)})</span>}
                <input value={value}
                    placeholder={placeholder} 
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => {
                        if (typeof blurCallback === "function") {
                            blurCallback(value)                    
                        }
                    }}
                    onFocus={() => {
                        if (typeof focusCallback === "function") {
                            focusCallback()
                        }
                    }}
                />
            </div>            
        </div>
    )
};

export default InputSet;