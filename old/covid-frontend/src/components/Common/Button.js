import { classBind as cx } from '../../others/util';
import './Button.scss'

function Button({ svg, title, onClick, disabled, className }) {
    return (
        <div className={cx(className, 'button', 'btn', disabled && 'disabled')} onClick={onClick}>
            {svg && <img src={svg} alt="title" />}
            <span dangerouslySetInnerHTML={{ __html: title }}></span>
        </div>
    )
}

export default Button;
