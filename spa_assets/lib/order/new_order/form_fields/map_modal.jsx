import 'order/_styles/new_order/form_fields/map_modal.scss';
// import 'leaflet/dist/leaflet.css'
import Leaflet from 'leaflet'
import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

export default function MapModal({active, setActive, markerPosition, changeMarkerLocation, center, address, setAddress}) {
    const closeWindow = (e) => {
        e.preventDefault()
        setActive(false)
    }
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal-contents active" : "modal-contents"} onClick={e => e.stopPropagation()}>
                <div className="modal-content-header">
                    <input className="input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <a className="close-me" onClick={() => setActive(false)}>×</a>
                </div>
                <div className="modal-content-body-wrapper">
                    <div className="modal-content-body">
                        <Map onclick={changeMarkerLocation} center={center} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            accessToken="pk.eyJ1IjoiYWxleGV5ZHMiLCJhIjoiY2p0cHkwbWNlMDAzdzQ1cW5oNm9sOTdjYyJ9.XOGmLdeCvY84Fo6gKmWzjw"
                            />
                            <Marker position={markerPosition}></Marker>
                        </Map>
                    </div>
                </div>
                    
                <div className="modal-content-footer">
                    <button className="button is-interpreters-yellow" onClick={closeWindow}>ОК</button>
                </div>
            </div>
        </div>
    )
}