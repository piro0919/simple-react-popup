import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import { styles } from './styles';
import Props from './simpleReactPopupProps';
import State from './simpleReactPopupState';

class Popup extends React.Component<Props, State> {
  static get defaultTransition() {
    return 250;
  }

  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    // Support multiple popups
    this.state = { id: `popup_${Math.random().toString(36).slice(-8)}` };
  }

  componentDidMount() {
    const {
      className,
      contents,
    } = this.props;
    const { id } = this.state;
    const popup = document.createElement('div');

    popup.setAttribute('class', className || '');
    popup.setAttribute('id', id);

    styles
      .forEach((style) => {
        const {
          propertuName,
          value,
        } = style;

        popup
          .style
          .setProperty(propertuName, value);
      });

    $('body').append($(popup));
    $(`#${id}`).on('click', this.onClick);

    ReactDOM.render(
      contents,
      document.getElementById(id)
    );
  }

  componentWillUnmount() {
    const { id } = this.state;

    $(`#${id}`).remove();
  }

  onClick() {
    const { transition } = this.props;
    const { id } = this.state;
    const { defaultTransition } = Popup;

    $(`#${id}`).fadeToggle(
      (transition === undefined) ?
        defaultTransition :
        transition
    );
  }

  render() {
    const { children } = this.props;

    return (
      <div
        onClick={this.onClick}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    );
  }
}

export default Popup;
