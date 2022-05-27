import React, {useState, useRef} from 'react';
import 'react_utils/_styles/language_select.scss';
import {t} from 'i18n';

export default function LanguageSelect({selectedLanguage, setSelectedLanguage, languages}) {
    let [visit, setVisit] = useState()
    let languagesRef = useRef()
    // let modalLangsWindowHeight = 300
    // console.log("screen.width: ", screen.width)
    // console.log("screen.height: ", screen.height)
    // console.log("window.innerWidth: ", window.innerWidth)
    // console.log("window.innerHeight: ", window.innerHeight)
    // console.log("document.body.clientWidth: ", document.body.clientWidth)
    // console.log("document.body.clientHeight: ", document.body.clientHeight)
    
    function onVisit() {
        if(languages?.length > 1) {

            setVisit(!visit)
        }
        // let inputLangsTop = languagesRef.current.getBoundingClientRect().top
        // let inputLangsHeight = languagesRef.current.getBoundingClientRect().height
        // let screenHeight = window.innerHeight // полная высота окна
        // let inputLangsBottom = screenHeight - inputLangsTop - inputLangsHeight
        // console.log( "screenHeight: ", screenHeight )
        // console.log("inputLangsTop: ", inputLangsTop)
        // console.log("inputLangsHeight: ", inputLangsHeight)
        // console.log( "inputLangsBottom: ", inputLangsBottom)
        // if(inputLangsBottom <= 500) {
        //     modalLangsWindowHeight = inputLangsBottom || 100
        // } else {
        //     modalLangsWindowHeight = 200
        // }
        // console.log("modalLangsWindowHeight: ", modalLangsWindowHeight)
    }
    function chooseLanguage(id) {
        setSelectedLanguage(id)
        setVisit(false)
    }

    return (
        <>
        <div className="select">
            {
                selectedLanguage 
                ? <div className="select-header select-langs" onClick={onVisit}  ref={languagesRef} onBlur={() => setVisit(false)}>
                    <span className="select-current">{selectedLanguage.name}</span>
                    {/* <div className="select-icon"></div> */}
                </div>
                : <select onClick={() => alert(t("search_form.language_selector.blank_city"))}>
                    <option>{t("search_form.language_selector.list_select")}</option>
                </select>
            }
            {/* <div className="select- header" onClick={onVisit}  ref={languagesRef} onBlur={() => setVisit(false)}>
                <span className="select-current">{selectedLanguage ? selectedLanguage.name : "Выберите из списка"}</span>
                <div className="select-icon"></div>
            </div> */}

            {visit && 
                <div>
                    {languages?.length > 1 && 
                        <div className="select-body_wrapper">  
                            <div className="select-body">
                                <div className="select-list">
                                    {languages.map(lang => {
                                        if (lang.id !== selectedLanguage.id) {
                                            return <div key={lang.id} className="select-item" onClick={() => chooseLanguage(lang)}>{lang.name}</div>
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                    <div className="select-fon" onClick={() => setVisit(false)}></div>
                </div>
            }
        </div>
        </>
    )
}