/**
 * Requirements
 */
import React, { Component, Fragment } from "react";
import memoize from "memoizerific";
import { SET_STORIES } from "@storybook/core-events";
import {
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList
} from "@storybook/components";
import { styled } from "@storybook/theming";
import { ID, PARAM_KEY } from "../constants";
import { SelectorItem, ConfigItem } from "../models";

/**
 * A simple icon that displays a two letter code
 */
const CodeIcon = styled.span(
  ({
    backgroundColor,
    textColor
  }: {
    backgroundColor: string;
    textColor: string;
  }) => ({
    borderRadius: "1rem",
    display: "block",
    height: "1.5rem",
    width: "1.5rem",
    paddingTop: "0rem",
    fontSize: "0.6rem",
    textAlign: "center",
    lineHeight: "1.5rem",
    backgroundColor,
    color: textColor
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`
  })
);

/**
 * Creates a (memoized) selector item
 */
const createSelectorItem = memoize(1000)(
  (
    configItem: ConfigItem,
    active: boolean,
    change: (arg: { selected: ConfigItem; expanded: boolean }) => void
  ): SelectorItem => ({
    id: configItem.label,
    title: configItem.label,
    code: configItem.code,
    configItem: configItem,
    backgroundColor: configItem.backgroundColor || "white",
    textColor: configItem.textColor || "black",
    active: active,
    left: (
      <CodeIcon
        backgroundColor={configItem.backgroundColor || "white"}
        textColor={configItem.textColor || "black"}
      >
        {configItem.code}
      </CodeIcon>
    ),
    onClick: () => {
      change({ selected: configItem, expanded: false });
    }
  })
);

/**
 * Gets a list of selector items based on the addon configuratio
 */
const getSelectorItems = memoize(10)(
  (props: SelectorProps, state: SelectorState, change: any) => {
    // Get config
    const configData = props.api.getCurrentStoryData();
    const configItems: ConfigItem[] =
      (configData &&
        configData.parameters &&
        configData.parameters[PARAM_KEY]) ||
      [];

    // Create items
    const items: SelectorItem[] = [];
    let selected: SelectorItem;
    if (configItems.length) {
      items.push(
        ...configItems.map(item => {
          const isSelected = state.selected
            ? item.label === state.selected.label
            : item.selected;
          const selectorItem = createSelectorItem(item, isSelected, change);
          if (isSelected) {
            selected = selectorItem;
          }
          return selectorItem;
        })
      );
    }

    return { items, selected };
  }
);

/**
 * Selector props
 */
export interface SelectorProps {
  api: {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    getCurrentStoryData(): any;
  };
}

/**
 * Selector state
 */
export interface SelectorState {
  items: Array<SelectorItem>;
  selected?: ConfigItem;
  expanded: boolean;
}

/**
 * The selector component
 */
export class Selector extends Component<SelectorProps, SelectorState> {
  constructor(props: SelectorProps) {
    super(props);
    this.state = {
      items: [],
      selected: null,
      expanded: false
    };
  }

  private onSetStories = () => {
    this.setState({ selected: null });
  };

  componentDidMount() {
    const { api } = this.props;
    api.on(SET_STORIES, this.onSetStories);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(SET_STORIES, this.onSetStories);
  }

  change = (args: { selected: ConfigItem; expanded: boolean }) => {
    this.setState(args);
    const iframe: any = document.getElementById("storybook-preview-iframe");
    if (iframe) {
      iframe.contentWindow.postMessage(args.selected.message, "*");
    }
  };

  render() {
    const { expanded } = this.state;
    const selectorItems: any = getSelectorItems(
      this.props,
      this.state,
      this.change
    );
    return selectorItems.items.length ? (
      <Fragment>
        <WithTooltip
          placement="top"
          trigger="click"
          tooltipShown={expanded}
          onVisibilityChange={(newVisibility: boolean) =>
            this.setState({ expanded: newVisibility })
          }
          tooltip={<TooltipLinkList links={selectorItems.items} />}
          closeOnClick
        >
          <IconButton key={ID} active={true} title="Change the theme...">
            <CodeIcon
              backgroundColor={selectorItems.selected.backgroundColor}
              textColor={selectorItems.selected.textColor}
            >
              {selectorItems.selected.code}
            </CodeIcon>
          </IconButton>
        </WithTooltip>
      </Fragment>
    ) : null;
  }
}
