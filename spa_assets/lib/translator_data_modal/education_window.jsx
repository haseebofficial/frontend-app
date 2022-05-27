import React from 'react'
import ModalWindow from 'modal_window/modal_window'
import {t} from 'i18n';

const EducationWindow = ({active, setActive, educations}) => {
    return (
        <ModalWindow active={active} setActive={setActive} modalTitle={t("global.interpreter.education")}>
            {educations?.map(ed => {
                return <div className="modal-content-card" key={ed.id}>
                    <p className="modal-content-line">{ed.name} :</p>
                    {/* <p className="modal-content-line">{ed.category}</p> */}
                    {ed.to_present && 
                        <img src={ed.to_present} alt="Diploma Img"/>
                    }
                    {/* <p className="modal-content-line">| русский - итальянский | итальянский - русский |</p> */}
                    <p className="modal-content-line">{t("layout.date.from")} {ed.begin_date} {t("layout.date.to")} {ed.end_date}</p>
                            {/* <p className="modal-content-line">Interpreter at negotiations - Milan :</p>
                            <p className="modal-content-line">Private client</p>
                            <p className="modal-content-line">| русский - итальянский | итальянский - русский |</p>
                            <p className="modal-content-line">2021-11-09</p> */}
                            {   ed.verification_image &&
                            
                                <img src={ed.verification_image} alt="diploma" />
                            }
                </div>
            })}
        </ModalWindow>
    )
}

export default EducationWindow
