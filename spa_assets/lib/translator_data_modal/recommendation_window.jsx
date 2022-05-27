import React from 'react'
import ModalWindow from 'modal_window/modal_window'
import ModalWindowCard from 'translator_data_modal/modal_window_card'
import {t} from 'i18n';

const RecommendationWindow = ({active, setActive, text}) => {
    return (
        <ModalWindow active={active} setActive={setActive} modalTitle={t("global.interpreter.recommendations")}>
            {text}
        </ModalWindow>
    )
}

export default RecommendationWindow
