import { useEffect, useRef } from "react";
import { classBind as cx } from "../../../others/util";
import seoulGu from "../../../others/seoul_gu";
import seoulLdong from "../../../others/seoul_ldong";
import "./Layer.scss";
import { postSearchSocialContact, postSearchCovidBlue } from "../../../others/api";
// import { postSearchTrendSocialContact } from "../../../others/api";
import { useHistory, useLocation } from "react-router";
import qs from "query-string";
import { HASH, LEVEL_COLOR, ROUTE } from "../../../others/const";

function Layer() {

    const location = useLocation();
    const history = useHistory();
    const { gu } = qs.parse(location.search);
    const isGu = useRef(false);
    const { hash } = location;

    useEffect(() => {
        let polygons = [];
        let customOverlays = [];

        const search = hash === HASH.mental ? postSearchCovidBlue : postSearchSocialContact;
        const scoreKey = hash === HASH.mental ? "total_score" : "contact_score";

        const mapContainer = document.getElementById('corona-index-map');
        const mapOption = {
            center: new window.kakao.maps.LatLng(37.5662805, 126.9846542), // 지도의 중심좌표
            level: 9 // 지도의 확대 레벨
        };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // sanghoo - gu 값에 따라 구단 위 동 단위 표시
        // 서울 전체 구단위 레이어를 표시합니다.
        if (gu) moveToDong(gu);
        else moveToGu(); 

        // sanghoo - 폴리곤 밖 클릭시 상위로 이동
        window.kakao.maps.event.addListener(map, 'click', async () => {
            isGu.current && history.replace(`${ROUTE.home}${hash}`)
        });

        // 다각형을 생상하고 이벤트를 등록하는 함수입니다
        function displayArea(area, dong) {

            const customOverlay = new window.kakao.maps.CustomOverlay({});
            // const infowindow = new window.kakao.maps.InfoWindow({ removable: true });

            // 다각형을 생성합니다
            let color;

            if (area.score < 0) {
                color = '#808080';
            } else if (area.score < 30) {
                color = LEVEL_COLOR[0];
            } else if (area.score < 70) {
                color = LEVEL_COLOR[1];
            } else {
                color = LEVEL_COLOR[2];
            }
            let polygon = new window.kakao.maps.Polygon({
                map: map, // 다각형을 표시할 지도 객체
                path: area.path,
                strokeWeight: 2,
                strokeColor: "#ffffff",
                strokeOpacity: 0.7,
                fillColor: color,
                fillOpacity: 0.5,
            });
            polygons.push(polygon);

            customOverlay.setContent('<div class="area">' + area.name + '</div>');
            customOverlay.setPosition(new window.kakao.maps.LatLng(area.latLng.lat, area.latLng.lng));
            customOverlay.setMap(map);            
            customOverlays.push(customOverlay);

            window.kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                polygon.setOptions({ fillOpacity: 0.9 });
            });

            window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
                polygon.setOptions({ fillOpacity: 0.5 });
            });

            // sanghoo - url 로 처리
            // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
            window.kakao.maps.event.addListener(polygon, 'click', async (mouseEvent) => {
                window.kakao.maps.event.preventMap();

                if (!dong) {
                    history.push(`${ROUTE.home}?gu=${area.name}${hash}`);

                    // deletePolygons();
                    // moveToDong(area.name);
                } else {
                    history.push(`${ROUTE.detail}/${area.code}`);

                    // const content = '<div class="info">' +
                    //     '   <div class="title">' + area.name + '</div>' +
                    //     '   <div class="size">총 면적 : 약 ' + Math.floor(polygon.getArea()) + ' m<sup>2</sup></area>' +
                    //     '</div>';

                    // infowindow.setContent(content);
                    // infowindow.setPosition(mouseEvent.latLng);
                    // infowindow.setMap(map);

                    // await postSearchTrendSocialContact(JSON.stringify({
                    //     interval: "2020-10-01T00:00:00+09:00/2020-10-21T23:00:00+09:00",
                    //     ldongCd: area.code
                    // }))
                }
            });
        }

        function deletePolygons() {
            polygons.forEach(polygon => {
                polygon.setMap(null);
            });
            polygons = [];

            customOverlays.forEach(customOverlay => {
                customOverlay.setMap(null);
              });
              customOverlays = [];
        }

        // 서울시 전체 (구단위 레이어) 표시하기
        async function moveToGu() {
            isGu.current = false; 

            deletePolygons();
            let seoulGuAreas = [];

            const data = await search({});

            seoulGu.forEach(feature => {
                let path = [];
                feature.PYN_CN.coordinates[0].forEach(coordinate => {
                    path.push(new window.kakao.maps.LatLng(coordinate[1], coordinate[0]));
                });

                const found = data.find(item =>
                    item.si_gun_gu === feature.CTGG_NM
                );

                const area = {
                    name: feature.CTGG_NM,
                    path: path,
                    score: found ? found[scoreKey] : -1,
                    code: feature.LGDNG_CD,
                    latLng: {
                        lat: feature.LA,
                        lng: feature.LNGT
                      }
                };
                seoulGuAreas.push(area);
            });

            const bounds = new window.kakao.maps.LatLngBounds();

            seoulGuAreas.forEach(area => {
                area.path.forEach(path => {
                    bounds.extend(path);
                })
            });
            map.setBounds(bounds, 5, 5, 5, 5);

            seoulGuAreas.forEach(area => {
                displayArea(area, false);
            });
        }

        // 특정 구의 동단위 레이어 표시하기
        async function moveToDong(gu) {
            isGu.current = true; 

            let seoulDongAreas = [];

            const data = await search({ siGunGu: gu })

            seoulLdong.forEach(feature => {
                if (gu.indexOf(feature.CTGG_NM) > -1) {
                    let path = [];
                    feature.PYN_CN.coordinates[0].forEach(coordinate => {
                        path.push(new window.kakao.maps.LatLng(coordinate[1], coordinate[0]));
                    });

                    const found = data.find(item =>
                        item.ldong_cd === feature.LGDNG_CD
                    );

                    const area = {
                        name: feature.EMD_NM,
                        path: path,
                        score: found ? found[scoreKey] : -1,
                        code: feature.LGDNG_CD,
                        latLng: {
                            lat: feature.LA,
                            lng: feature.LNGT
                          }
                    };
                    seoulDongAreas.push(area);
                }
            });

            const bounds = new window.kakao.maps.LatLngBounds();

            seoulDongAreas.forEach(area => {
                area.path.forEach(path => {
                    bounds.extend(path);
                })
            });
            map.setBounds(bounds, 5, 5, 5, 5);

            // 지도에 영역데이터를 폴리곤으로 표시합니다
            seoulDongAreas.forEach(area => {
                displayArea(area, true);
            });
        }
    }, [gu, history, hash])

    return (
        <div id="corona-index-map" className={cx("layer")}></div>
    )
}

export default Layer;