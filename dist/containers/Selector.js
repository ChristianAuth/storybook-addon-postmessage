"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Requirements
 */
var react_1 = __importStar(require("react"));
var memoizerific_1 = __importDefault(require("memoizerific"));
var core_events_1 = require("@storybook/core-events");
var components_1 = require("@storybook/components");
var theming_1 = require("@storybook/theming");
var constants_1 = require("../constants");
/**
 * A simple icon that displays a two letter code
 */
var CodeIcon = theming_1.styled.span(function (_a) {
    var backgroundColor = _a.backgroundColor, textColor = _a.textColor;
    return ({
        borderRadius: "1rem",
        display: "block",
        height: "1.5rem",
        width: "1.5rem",
        paddingTop: "0rem",
        fontSize: "0.6rem",
        textAlign: "center",
        lineHeight: "1.5rem",
        backgroundColor: backgroundColor,
        color: textColor
    });
}, function (_a) {
    var theme = _a.theme;
    return ({
        boxShadow: theme.appBorderColor + " 0 0 0 1px inset"
    });
});
/**
 * Creates a (memoized) selector item
 */
var createSelectorItem = memoizerific_1.default(1000)(function (configItem, active, change) { return ({
    id: configItem.label,
    title: configItem.label,
    code: configItem.code,
    configItem: configItem,
    backgroundColor: configItem.backgroundColor || "white",
    textColor: configItem.textColor || "black",
    active: active,
    left: (react_1.default.createElement(CodeIcon, { backgroundColor: configItem.backgroundColor || "white", textColor: configItem.textColor || "black" }, configItem.code)),
    onClick: function () {
        change({ selected: configItem, expanded: false });
    }
}); });
/**
 * Gets a list of selector items based on the addon configuratio
 */
var getSelectorItems = memoizerific_1.default(10)(function (props, state, change) {
    // Get config
    var configData = props.api.getCurrentStoryData();
    var configItems = (configData &&
        configData.parameters &&
        configData.parameters[constants_1.PARAM_KEY]) ||
        [];
    // Create items
    var items = [];
    var selected;
    if (configItems.length) {
        items.push.apply(items, configItems.map(function (item) {
            var isSelected = state.selected
                ? item.label === state.selected.label
                : item.selected;
            var selectorItem = createSelectorItem(item, isSelected, change);
            if (isSelected) {
                selected = selectorItem;
            }
            return selectorItem;
        }));
    }
    return { items: items, selected: selected };
});
/**
 * The selector component
 */
var Selector = /** @class */ (function (_super) {
    __extends(Selector, _super);
    function Selector(props) {
        var _this = _super.call(this, props) || this;
        _this.onSetStories = function () {
            _this.setState({ selected: null });
        };
        _this.change = function (args) {
            _this.setState(args);
            var iframe = document.getElementById("storybook-preview-iframe");
            if (iframe) {
                iframe.contentWindow.postMessage(args.selected.message, "*");
            }
        };
        _this.state = {
            items: [],
            selected: null,
            expanded: false
        };
        return _this;
    }
    Selector.prototype.componentDidMount = function () {
        var api = this.props.api;
        api.on(core_events_1.SET_STORIES, this.onSetStories);
    };
    Selector.prototype.componentWillUnmount = function () {
        var api = this.props.api;
        api.off(core_events_1.SET_STORIES, this.onSetStories);
    };
    Selector.prototype.render = function () {
        var _this = this;
        var expanded = this.state.expanded;
        var selectorItems = getSelectorItems(this.props, this.state, this.change);
        return selectorItems.items.length ? (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(components_1.WithTooltip, { placement: "top", trigger: "click", tooltipShown: expanded, onVisibilityChange: function (newVisibility) {
                    return _this.setState({ expanded: newVisibility });
                }, tooltip: react_1.default.createElement(components_1.TooltipLinkList, { links: selectorItems.items }), closeOnClick: true },
                react_1.default.createElement(components_1.IconButton, { key: constants_1.ID, active: true, title: "Change the theme..." },
                    react_1.default.createElement(CodeIcon, { backgroundColor: selectorItems.selected.backgroundColor, textColor: selectorItems.selected.textColor }, selectorItems.selected.code))))) : null;
    };
    return Selector;
}(react_1.Component));
exports.Selector = Selector;
