/**
 * Requirements
 */
import * as React from "react";
import { addons, types } from "@storybook/addons";
import { ADDON_ID } from "./constants";
import { Selector } from "./containers";

addons.register(ADDON_ID, api => {
  addons.add(ADDON_ID, {
    title: "Post Message",
    type: types.TOOL,
    match: ({ viewMode }) => {
      return viewMode === "story";
    },
    render: () => <Selector api={api} />
  });
});
