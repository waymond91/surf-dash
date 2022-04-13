import {Button, Card, Col, Row, Offcanvas} from "react-bootstrap";
import Styles from "../components/Styles";
import React, {useEffect, useState, useRef} from "react";
import mapboxgl, {Map, Marker} from "!mapbox-gl";
import Buoy from "../components/Buoy"

mapboxgl.accessToken =
    "pk.eyJ1IjoiYnJldHRtc21pdGgiLCJhIjoiY2t1NzFxNGt2MW9pNDJ2bzZqdmlibWJoZSJ9.lorLL3V1xySe1Gm75RvdNQ";

export default function Facility() {
    const [isMobile, setIsMobile] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(55.51);
    const [lat, setLat] = useState(-4.52);
    const [zoom, setZoom] = useState(10);
    const [offcanvasVisible, setOffCanvasVisible] = useState(false);

    function buildMarker(name, lat, lng) {
        return {
            name: name,
            lat: lat,
            lng: lng
        };
    }

    const markers = [
        buildMarker("Baier Ternay", -4.6357323, 55.3729638),
        buildMarker("Curieuse", -4.286085864745644, 55.734821213204626),
        buildMarker("Silhouette", -4.4752999135551255, 55.252023257325185),
        buildMarker("Ile Coco", -4.309699174357993, 55.86620032938555)
    ];

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v10",
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false,
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        map.current.on("load", function () {
            markers.forEach((marker) => {
                const m = new Marker()
                    .setLngLat([marker.lng, marker.lat])
                    .addTo(map.current);
            });
        });
    });

    useEffect(() => {
        handleWindowSizeChange();
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    function handleWindowSizeChange() {
        if (window.innerWidth < 762) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }

    function renderRight(){
        if(!offcanvasVisible){
            return(
                <Card style={{textAlign: "center"}}>
                    <Card.Body>
                        <Card.Title style={{padding: "1em"}}>
                            <h3>View Deployment</h3>
                        </Card.Title>
                        <Card.Text>
                            {markers.map(marker => <Row style={{padding: 10}}><Button
                                variant={'secondary'}
                                onClick={() => {
                                    map.current.flyTo({center: [marker.lng, marker.lat], zoom: 14})
                                    setOffCanvasVisible(true);
                                }}>{marker.name}</Button></Row>)}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
        }else{
            return(<Buoy/>)
        }
    }

    return (
        <Row className={"bg-white"}>
            <Col
                xs={12}
                xl={9}
                style={{height: "95vh", backgroundColor: "rgb(30,44,75)"}}
            >
                <div ref={mapContainer} style={{height: "100%", width: "100%"}}/>
            </Col>
            <Col
                xs={12}
                xl={3}
                style={{
                    ...Styles.BootstrapCenter,
                    height: "95vh",
                    backgroundColor: "rgb(30,44,75)"
                }}
            >
                {renderRight()}
            </Col>
        </Row>
    );
}
