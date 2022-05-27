import React from 'react'
import "translator_data_modal/_style/modal_window.scss"

const ModalWindow = ({children, active, setActive, modalTitle}) => {
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal-contents active" : "modal-contents"} onClick={e => e.stopPropagation()}>
                <div className="modal-content-header">
                    {modalTitle}
                    <a className="close-me" onClick={() => setActive(false)}>×</a>
                </div>
                <div className="modal-content-body-wrapper">
                    <div className="modal-content-body">
                        {children}
                    </div>
                </div>
                <div className="modal-content-footer">
                    <button className="button is-interpreters-yellow" onClick={() => setActive(false)}>ОК</button>
                </div>
            </div>
        </div>
    )
}

export default ModalWindow
