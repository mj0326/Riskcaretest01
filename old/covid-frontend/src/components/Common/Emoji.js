import emoji0 from '../../images/emoji0.svg'
import emoji1 from '../../images/emoji1.svg'
import emoji2 from '../../images/emoji2.svg'
import emoji3 from '../../images/emoji3.svg'
import { CUT } from '../../others/const';

function Emoji({ score, className }) {
    if (score === undefined) return <img className={className} src={emoji3} alt="emoji3" />;
    if (score <= CUT[0]) return <img className={className} src={emoji0} alt="emoji0" />;
    if (score <= CUT[1]) return <img className={className} src={emoji1} alt="emoji1" />;
    else return <img className={className} src={emoji2} alt="emoji2" />;
}

export default Emoji;