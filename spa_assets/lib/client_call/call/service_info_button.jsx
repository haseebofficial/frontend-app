import "client_call/_styles/call/service_info_button.scss";
import connectButton from "vendor/images/small-connect-button.png";
import hangupButton from "vendor/images/small-hangup-button.png";
import React from 'react'
import {t} from 'i18n';

export default function ServiceInfoButton({active, setActive}) {
    return (
        <>
            <a href="#" className="button" onClick={() => setActive(true)}>{t("text_translations.how_it_works.title")}</a>
            <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal-contents active" : "modal-contents"} onClick={e => e.stopPropagation()}>
                <div className="modal-content-header">
                    <a className="close-me" onClick={() => setActive(false)}>×</a>
                </div>
                <div className="modal-content-body-wrapper">
                    <div className="modal-content-body">
                        — {t("text_translations.how_it_works.text1")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.text2")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.press")} <span><img src={connectButton} className="small-connect-button" alt="small-connect-button" /></span> {t("text_translations.how_it_works.to_call_interpreter")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.text4")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.text5")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.text6")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.press")} <span><img src={hangupButton} className="small-hangup-button" alt="small-hangup-button" /></span> {t("text_translations.how_it_works.to_end_the_phone_call")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.press")} <span><img src={hangupButton} className="small-hangup-button" alt="small-hangup-button" /></span> {t("text_translations.how_it_works.to_end_the_conversation")}
                        <br/>
                        <br/>
                        — {t("text_translations.how_it_works.text7")}
                        <br/>
                        <br/>
                        <div className="modal-regulations"><a href="" className="modal-regulations-link">{t("global.phone.terms_link")}</a></div>
                    </div>
                </div>
                <div className="modal-content-footer">
                    <button className="button-info is-interpreters-yellow" onClick={() => setActive(false)}>ОК</button>
                </div>
            </div>
        </div>
        </>
    )
}
export function PaymentInformationButton({active, setActive}) {
    return (
        <>
            <a href="#" className="button" onClick={() => setActive(true)}>{t("global.interpretation_call.payment_detail")}</a>
            <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal-contents active" : "modal-contents"} onClick={e => e.stopPropagation()}>
                <div className="modal-content-header">
                    {t("global.interpretation_call.payment_detail")}
                    <a className="close-me" onClick={() => setActive(false)}>×</a>
                </div>
                <div className="modal-content-body-wrapper">
                    <div className="modal-content-body">
                    </div>
                </div>
                <div className="modal-content-footer">
                    <button className="button-info is-interpreters-yellow" onClick={() => setActive(false)}>ОК</button>
                </div>
            </div>
        </div>
        </>
    )
}
