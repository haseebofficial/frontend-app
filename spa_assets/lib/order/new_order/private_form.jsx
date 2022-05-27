import React, {useContext} from "react";
import { ClientInfoFields } from "order_utils/form";
import InfoForInterpreterFields from "order/new_order/form_fields/info_for_interpreter";
import { InputValueContext } from "order/new_order/new_order"

export default function PrivateForm({disabledInput}) {
  return (
    <div>
      <ClientInfoFields className="border-none" disabledInput={disabledInput}/>
      <InfoForInterpreterFields disabledInput={disabledInput}/>
    </div>
  );
}