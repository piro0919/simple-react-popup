import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';

const styles = require('./style.css');
const popupContents = (
  <div className={styles.popup_contents}>
    popup contents
  </div>
);

ReactDOM.render(
  <Popup
    className={styles.popup_target}
    contents={popupContents}
  >
    popup target
  </Popup>,
  document.getElementById('app')
);
