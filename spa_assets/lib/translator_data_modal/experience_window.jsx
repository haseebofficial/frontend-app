import React from 'react'
import ModalWindow from 'modal_window/modal_window'
import ModalWindowCard from 'translator_data_modal/modal_window_card'
import {t} from 'i18n';

const ExperienceWindow = ({active, setActive, experiences}) => {
    return (
        <ModalWindow active={active} setActive={setActive} modalTitle={t("global.interpreter.experience")}>
            {experiences?.map(exp => {
                return <div className="modal-content-card" key={exp.id}>
                    <p className="modal-content-line">{exp.company} :</p>
                    <p className="modal-content-line">{exp.speciality}</p>
                    <p className="modal-content-line">{exp.language_pairs}</p>
                    <p className="modal-content-line">{t("layout.date.from")} {exp.begin_date} {t("layout.date.to")} {exp.end_date}</p>
                </div>
            })}
        </ModalWindow>
    )
}

export default ExperienceWindow
