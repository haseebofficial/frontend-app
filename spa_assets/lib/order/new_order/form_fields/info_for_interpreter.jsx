import 'order/_styles/new_order/form_fields/info_for_interpreter.scss';
import React, { useContext, useState } from "react";
import { InputValueContext } from "order/new_order/new_order"
import useInput, {InputField, TextareaField} from "react_utils/use_input";
import ModalWindow from "modal_window/modal_window"
import { Map, TileLayer, Marker } from 'react-leaflet';
import MapModal from 'order/new_order/form_fields/map_modal';
import {t} from 'i18n';

export default function InfoForInterpreter({disabledInput}) {
  let { meetingAddress, description, search } = useContext(InputValueContext)
  const center = {
    lat: search?.city?.latitude ? search?.city?.latitude : 0,
    lng: search?.city?.longitude ? search?.city?.longitude : 0,
  }
  let [isVisible, setVisible] = useState(false)
  let [address, setAddress] = useState("")
  let [markerPosition, setMarkerPosition] = useState({lat: 0, lng: 0})
  const [filename, setFilename] = useState('');
  
  const changeMarkerLocation = (e) => {
    setMarkerPosition(e.latlng)
    getAddress(e.latlng).then(function(result) {
      if (result.success) {
        setAddress(result.address)
        meetingAddress.setValue(result.address)
        console.log(markerPosition)
      } else {
        setAddress("No results")
      }
    })
  }

  const handleInputFile = (e) => {
    setFilename(e.target.files[0].name)
  }

  return (
    <>
    <div className="section-form info-for-interpreter-fields">
      <span className="field-title">{t("global.order_page.personal_form.info_for_interpreter")}</span>
      <div className="columns">
        <div className="column is-7">
          <div className="field">
            <InputField useInput={meetingAddress} name="meetingAddress" type="text" placeholder={t("global.order_page.personal_form.meeting_address")} classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
          </div>
          <div className="field field-textarea">
            <TextareaField useInput={description} name="description" type="text" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput}
             placeholder={t("global.order_page.personal_form.detail_information")}/>
          </div>
        </div>

        <div className="column flex-wrapper">
          <div className="field field-map">
            {!disabledInput && <a onClick={() => setVisible(true)} className="map-link"><i className="fas fa-map-marker-alt"></i> {t("global.order_page.personal_form.map_link")}</a>}
          </div>

          <div className="file has-name is-right">
            <span className="file-title" >{t("global.order_page.personal_form.file_field")}</span>
            <label disabled={disabledInput} className={`file-label ${disabledInput ? "file-label-disabled" : ""}`}>
              <input disabled={disabledInput} className="file-input" type="file" name="resume" id="resume" onChange={(e) => handleInputFile(e)}/>
              <span  className="file-cta">
                <span className="file-label">
                  {t("search_form.js.search.file_select")}
                </span>
              </span>
              <span disabled={disabledInput} className="file-name">
                {filename}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
      <MapModal active={isVisible} setActive={setVisible} changeMarkerLocation={changeMarkerLocation} markerPosition={markerPosition} center={center} address={address} setAddress={setAddress} />
    </>
  );
}

function getAddress(pos) {
  return fetch(geocoderUrl(pos)).then(
    function(r) { 
      return r.json().then(function(body) { 
        return {success: true, address: body.display_name};
      });
    }, 
    function() { return { success: false }; }
  );
}
function geocoderUrl(pos) {
  return "https://nominatim.openstreetmap.org/reverse?lat=" + pos.lat + "&lon=" + pos.lng + "&format=json";
}