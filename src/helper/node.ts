import { STYLESHEET_NODE, RULE_NODE } from "../../types";

export function makeStylesheetNode(): STYLESHEET_NODE {
  const stylesheetNode: STYLESHEET_NODE = {
    children: [],
  };

  return stylesheetNode;
}

export function makeRuleNode(): RULE_NODE {
  const ruleNode: RULE_NODE = {
    selectors: [],
    declarations: [],
    children: [],
  };

  return ruleNode;
}
