"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var $ = require("jquery");
var styles_1 = require("./styles");
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = _this.onClick.bind(_this);
        // Support multiple popups
        _this.state = { id: "popup_" + Math.random().toString(36).slice(-8) };
        return _this;
    }
    Object.defineProperty(Popup, "defaultTransition", {
        get: function () {
            return 250;
        },
        enumerable: true,
        configurable: true
    });
    Popup.prototype.componentDidMount = function () {
        var _a = this.props, className = _a.className, contents = _a.contents;
        var id = this.state.id;
        var popup = document.createElement('div');
        popup.setAttribute('class', className || '');
        popup.setAttribute('id', id);
        styles_1.styles
            .forEach(function (style) {
            var propertuName = style.propertuName, value = style.value;
            popup
                .style
                .setProperty(propertuName, value);
        });
        $('body').append($(popup));
        $("#" + id).on('click', this.onClick);
        ReactDOM.render(contents, document.getElementById(id));
    };
    Popup.prototype.componentWillUnmount = function () {
        var id = this.state.id;
        $("#" + id).remove();
    };
    Popup.prototype.onClick = function () {
        var transition = this.props.transition;
        var id = this.state.id;
        var defaultTransition = Popup.defaultTransition;
        $("#" + id).fadeToggle((transition === undefined) ?
            defaultTransition :
            transition);
    };
    Popup.prototype.render = function () {
        var children = this.props.children;
        return (React.createElement("div", { onClick: this.onClick, style: { cursor: 'pointer' } }, children));
    };
    return Popup;
}(React.Component));
exports.default = Popup;
