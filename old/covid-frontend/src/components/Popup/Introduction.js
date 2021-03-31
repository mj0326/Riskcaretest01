import { useState } from "react";
import { CONTACT_INFORMATION, CUT, LEVEL_COLOR, LEVEL_LABEL, PSYCHO_INFORMATION } from "../../others/const";
import { classBind as cx } from "../../others/util";
import Emoji from "../Common/Emoji";
import Tab from "../Common/Tab";
import right from "../../images/right.svg";
import "./Introduction.scss";

function Introduction({ tab }) {

    const [menuTab, setMenuTab] = useState(tab || 0)

    return (
        <div className={cx("introduction")}>
            <div className={cx("title")}>서비스 설명</div>
            <Tab tabs={["장소와 위험도", "사회적\n접촉 지수", "심리적 지수"]} tabIndex={menuTab} setTabClick={setMenuTab} />

            {menuTab === 0 && <div className={cx("risk", "scroll")}>
                <div className={cx("head")}>장소 설정</div>
                <ul>
                    <li>'편집'버튼을 누르면 관심장소 편집 화면으로 이동 합니다.</li>
                    <li>관심장소 편집 화면에서<span>관심 지역을 검색하여 즐겨찾기에 추가할 수 있이며, 지역은 ‘법정동’ 단위로 검색 및 추가</span> 가능합니다.</li>
                    <li>'현재 위치'는 현재 사용자의 위치 기준으로 설정이 되며, 이동을 하여 위치 변경이 필요한 경우 Refresh 버튼을 클릭하세요. </li>
                    <li>일정을 추가할 때 <span>지정한 장소가 현재 위험한 장소이거나 추후 위험 장소로 변경이 되면 사용자에게 알림</span>으로 안내 됩니다.</li>
                </ul>
                <div className={cx("head")}>위험도</div>
                <ul>
                    <li>
                        <div>위험도는 3단계로 안내가 됩니다.</div>
                        <div className={cx("labels")}>
                            {LEVEL_LABEL.map((label, index) => (
                                <div key={index}>
                                    <Emoji score={CUT[index]} />
                                    <div style={{ color: LEVEL_COLOR[index] }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </li>
                    <li>위험도는 <span>'사회적 접촉 지수'와 '코로나 확진자 정보'를 기반으로 책정</span> 됩니다.</li>
                </ul>

                <div className={cx("btn")} onClick={() => setMenuTab(1)}>
                    '사회적 접촉 지수'에 대해서 알아보기
                    <img src={right} alt="right" />
                </div>
            </div>}

            {menuTab === 1 && <div className={cx("contact", "scroll")}>
                <ul className={cx("description")}>
                    <li>
                        아래 기준 지수들을 기반으로 ‘사회적 접촉 지수’가 책정 됩니다. 
                    </li>
                </ul>
                {CONTACT_INFORMATION.map((item, index) => !item.head ? null : (
                    <div key={index} className={cx("contents")}>
                        <div className={cx("head")}>{item.head}</div>
                        <div className={cx("desc")}>{item.content}</div>
                    </div>
                ))}
            </div>}

            {menuTab === 2 && <div className={cx("contact", "scroll")}>
                <ul className={cx("description")}>
                    <li>
                        아래 기준 지수들을 기반으로 ‘심리적 지수’가 책정 됩니다. 
                    </li>
                </ul>
                {PSYCHO_INFORMATION.map((item, index) => (
                    <div key={index} className={cx("contents")}>
                        <div className={cx("head")}>{item.head}</div>
                        <div className={cx("desc")}>{item.content}</div>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default Introduction;