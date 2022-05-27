import React from 'react';
import ModalWindow from 'modal_window/modal_window';
import ModalWindowCard from 'translator_data_modal/modal_window_card';
import {t} from 'i18n';

const EventWindow = ({active, setActive, events}) => {
    return (
        <ModalWindow active={active} setActive={setActive} modalTitle={t("global.interpreter.events")}>
            {events?.map(event => {
                return <div className="modal-content-card" key={event.id}>
                    <p className="modal-content-line">{event.organizer} :</p>
                    <p className="modal-content-line">{event.action}</p>
                    <p className="modal-content-line">{event.language_pairs}</p>
                    <p className="modal-content-line">{event.date}</p>
                        {/* <p className="modal-content-line">Interpreter at negotiations - Milan :</p>
                        <p className="modal-content-line">Private client</p>
                        <p className="modal-content-line">| русский - итальянский | итальянский - русский |</p>
                        <p className="modal-content-line">2021-11-09</p> */}
                </div>
            })}
        </ModalWindow>
    )
}

export default EventWindow
