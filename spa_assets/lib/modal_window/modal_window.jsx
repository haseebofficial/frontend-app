import React from 'react';
import "modal_window/_styles/modal_window.scss";

export default function ModalWindow({children, active, setActive, modalTitle, buttonOk=true}) {
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal-contents active" : "modal-contents"} onClick={e => e.stopPropagation()}>
                <div className="modal-content-header">
                    {modalTitle}
                    <a className="close-me" onClick={() => setActive(false)}>×</a>
                </div>
                { buttonOk
                    ? <React.Fragment>
                        <div className="modal-content-body-wrapper">
                            <div className="modal-content-body">
                                {children}
                            </div>
                        </div>
                    
                        <div className="modal-content-footer">
                            <button className="button is-interpreters-yellow" onClick={() => setActive(false)}>ОК</button>
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        {children}
                    </React.Fragment>
                }
            </div>
        </div>
    )
}

