/// <reference types="react" />
import * as React from 'react';
import Props from './simpleReactPopupProps';
import State from './simpleReactPopupState';
declare class Popup extends React.Component<Props, State> {
    static readonly defaultTransition: number;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onClick(): void;
    render(): JSX.Element;
}
export default Popup;
