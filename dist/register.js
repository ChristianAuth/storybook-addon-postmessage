"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Requirements
 */
var React = __importStar(require("react"));
var addons_1 = require("@storybook/addons");
var constants_1 = require("./constants");
var containers_1 = require("./containers");
addons_1.addons.register(constants_1.ADDON_ID, function (api) {
    addons_1.addons.add(constants_1.ADDON_ID, {
        title: "Theme Switcher",
        type: addons_1.types.TOOL,
        match: function (_a) {
            var viewMode = _a.viewMode;
            return viewMode === "story";
        },
        render: function () { return React.createElement(containers_1.Selector, { api: api }); }
    });
});
