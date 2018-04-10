import * as React from 'react';
import SimpleReactPopup, { SimpleReactPopupProps } from '../lib';

interface Props extends SimpleReactPopupProps { };

const Popup: React.SFC<Props> = (props) => (
  <SimpleReactPopup {...props} />
);

export default Popup;
