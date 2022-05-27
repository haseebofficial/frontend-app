import "react_utils/_styles/use_input.scss"
import React, { useState, useEffect } from "react";
import {t} from 'i18n';

const useValidation = (value, validations, empty=true, submit) => {
  const [isEmpty, setEmpty] = useState(empty)
  const [minLengthError, setMinLenthError] = useState(false)
  const [maxLengthError, setMaxLenthError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [telNumberError, setTelNumberError] = useState(false)
  const [inputValid, setInputValid] = useState(false)

  useEffect(() => {
    for(const validation in validations) {
      switch (validation) {
        case 'isEmpty': 
          value ? setEmpty(false) : setEmpty(true) 
          break;
        case 'minLength':
          value.length < validations[validation] ? setMinLenthError(true) : setMinLenthError(false)
          break;
        case 'maxLength': 
          value.length > validations[validation] ? setMaxLenthError(true) : setMaxLenthError(false)
          break;
        case 'isEmail':
          const re  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true)
          break;
        case "isTelNumber":
          let regex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
          regex.test(value) ? setTelNumberError(false) : setTelNumberError(true)
          break;
      }
    }
  }, [value])

  useEffect(() => {
    if(isEmpty || maxLengthError || minLengthError || emailError || telNumberError) {
      setInputValid(false)
    } else {
      setInputValid(true)
    }
  }, [isEmpty, minLengthError, maxLengthError, emailError, telNumberError])

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    emailError,
    inputValid,
    telNumberError
  }
}

const useInput = (initialValue, validations, empty) => {
  let [value, setValue] = useState(initialValue)
  let [isDirty, setDirty] = useState(false)
  let [error, setError] = useState(null)
  const valid = useValidation(value, validations, empty)
  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onBlur = (e) => {
    setDirty(true)
  }

  useEffect(() => {
    if (isDirty && valid.isEmpty) {
      // setError("Поле не может быть пустым")
      setError(t("global.validator.required"))
    } else if (isDirty && valid.emailError) {
      setError(t("global.validator.email"))
    } else if (isDirty && valid.telNumberError) {
      setError(t("global.validator.phone_format"))
    } else if (isDirty && valid.minLengthError) {
      setError(t("global.validator.minlength_error"))
    } else if (isDirty && valid.maxLengthError) {
      setError(t("global.validator.maxlength_error"))
    } else {
      setError("")
    }
  }, [value, isDirty, valid.isEmpty, valid.emailError, valid.minLengthError, valid.maxLengthError, valid.telNumberError])

  return {
    value,
    setValue,
    isDirty,
    onChange,
    onBlur,
    error,
    setError,
    ...valid
  }
}

export function InputFieldSearch({useInput, classes, ...props}) {
  return (
    <>
      <input value={useInput.value} onChange={useInput.onChange} onBlur={useInput.onBlur} className={`${useInput.inputValid && useInput.isDirty && "input-valid"} ${((!useInput.inputValid && useInput.isDirty) || (submit && useInput.isEmpty && !useInput.inputValid)) && "input-invalid"} input ${classes}`} {...props}/>
    </>
  )
}

export function InputField({submit, useInput, classes, ...props}) {
  return (
    <>
      {useInput.error && <span className="input-label-error">{useInput.error}</span> || submit && useInput.isEmpty && !useInput.inputValid && <span className="input-label-error">{t("global.validator.required")}</span>}
      <input value={useInput.value} onChange={useInput.onChange} onBlur={useInput.onBlur} className={`${useInput.inputValid && useInput.isDirty && "input-valid"} ${((!useInput.inputValid && useInput.isDirty) || (submit && useInput.isEmpty && !useInput.inputValid)) && "input-invalid"} input ${classes}`} {...props}/>
    </>
  )
}

export function TextareaField({submit, useInput, classes, ...props}) {
  return (
    <>
      {useInput.error && <span className="input-label-error">{useInput.error}</span> || submit && useInput.isEmpty && !useInput.inputValid && <span className="input-label-error">{t("global.validator.required")}</span>}
      <textarea value={useInput.value} onChange={useInput.onChange} onBlur={useInput.onBlur} className={`${useInput.inputValid && useInput.isDirty && "input-valid"} ${((!useInput.inputValid && useInput.isDirty) || (submit && useInput.isEmpty && !useInput.inputValid)) && "input-invalid"} textarea input  ${classes}`} {...props}/>
    </>
  )
}

export default useInput