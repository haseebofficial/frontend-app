import { connect } from 'react-redux';
import { globalsToProps } from 'utils/globals_context';

import PaymentInformationLink from "./link";

export default connect()(
  globalsToProps(PaymentInformationLink)
);