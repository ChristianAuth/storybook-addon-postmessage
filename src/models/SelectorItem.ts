import { ConfigItem } from "./ConfigItem";

export interface SelectorItem {
  id: string;
  title: string;
  code: string;
  backgroundColor: string;
  textColor: string;
  configItem: ConfigItem;
  left?: any;
  active: boolean;
  onClick: () => void;
}
