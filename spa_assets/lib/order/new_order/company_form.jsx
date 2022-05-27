import React, {useContext} from "react";
import { InputValueContext } from "order/new_order/new_order"
import { ClientInfoFields } from "order_utils/form";
import InfoForInterpreterFields from "order/new_order/form_fields/info_for_interpreter";
import { InputField } from "react_utils/use_input";

export default function CompanyForm({disabledInput, ...props}) {
  let {legalForm, companyName, scope, legalAddress, companyPhone, iin, submit} = useContext(InputValueContext)

  return (
    <div>
      <div className="section-form border-none">
        <span className="field-label">Информация о компании</span>
        <div className="columns">
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={legalForm} submit={submit} name="legalForm" type="text" placeholder="Административно правовая форм" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>

          </div>
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={companyName} submit={submit} name="companyName" type="text" placeholder="Название:" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>
          </div>
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={scope} submit={submit} name="scope" type="text" placeholder="Сфера деятельности компании" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={legalAddress} submit={submit} name="legalAddress" type="text" placeholder="Юридический адрес" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>

          </div>
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={companyPhone} submit={submit} name="companyPhone" type="text" placeholder="Телефон компании" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>
          </div>
          <div className="column is-one-third">
            <div className="field">
              <InputField useInput={iin} submit={submit} name="iin" type="text" placeholder="ИНН" classes={`${disabledInput ? "input-disabled" : ""}`} disabled={disabledInput} />
            </div>
          </div>
        </div>
      </div>

      <ClientInfoFields disabledInput={disabledInput}/>
      <InfoForInterpreterFields disabledInput={disabledInput}/>

    </div>
  );
}
