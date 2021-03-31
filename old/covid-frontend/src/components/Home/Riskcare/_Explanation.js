// import { classBind as cx, getCaution, getLabel } from "../../../others/util";
// import close3 from '../../../images/close3.svg'
// import previous from '../../../images/previous.svg'
// import information from '../../../images/information.svg'
// import next from '../../../images/next.svg'
// import "./Explanation.scss";
// import { useDispatch, useSelector } from "react-redux";
// import { setExplanation } from "../../../redux";
// import Emoji from '../../Common/Emoji';
// import Slider from "./Slider";
// import Button from "../../Common/Button";
// import { useMemo } from "react";

// function Explanation() {

//     const dispatch = useDispatch();
//     const { length } = useSelector(state => state.favorite)
//     const { score, current, address, name, index, population, taxi } = useSelector(state => state.explanation);

//     const close = () => {
//         dispatch(setExplanation())
//     }

//     const move = to => {
//         dispatch(setExplanation(to))
//     }

//     const cautions = useMemo(() => getCaution(score), [score])

//     return (
//         <div className={cx("explanation")}>
//              <div className={cx("inner")}>
//                  <img className={cx("close", "btn")} src={close3} alt="close3" onClick={close} />  
//                  <div className={cx("content", "scroll")}>
//                     <Emoji className={cx("emoji")} score={score} />
//                     <div className={cx("address", !current && !name && "no-show")}>({current ? "현재 위치" : address})</div>
//                     <div className={cx("name")}>
//                         <img className={cx('btn', index === -1 && 'disabled' )} src={previous} alt="previous" onClick={() => { move(index - 1) }} />
//                         <span>{name || address}</span>
//                         <img className={cx('btn', index === length - 1 && 'disabled')} src={next} alt="previous" onClick={() => { move(index + 1) }} />
//                     </div>
//                     <div className={cx("label")}>{getLabel(score)}</div>
//                     <ul className={cx("description")}>
//                         {cautions.map((caution, key) =>  <li key={key}>{caution}</li>)}
//                     </ul>
//                     <div className={cx("information")}>
//                         <span>기준정보</span>
//                         <img src={information} alt="information" />
//                     </div>
//                     <Slider title="유동 인구" value={population} />
//                     <Slider title="택시 수요" value={taxi} />
//                     <Button className={cx("bottom")} disabled title="상세 정보 더보기" onClick={() => {}} />
//                  </div>
//              </div>
//         </div>
//     )
// }

// export default Explanation;