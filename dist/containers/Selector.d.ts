/**
 * Requirements
 */
import { Component } from "react";
import { SelectorItem, ConfigItem } from "../models";
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
export declare class Selector extends Component<SelectorProps, SelectorState> {
    constructor(props: SelectorProps);
    private onSetStories;
    componentDidMount(): void;
    componentWillUnmount(): void;
    change: (args: {
        selected: ConfigItem;
        expanded: boolean;
    }) => void;
    render(): JSX.Element;
}
