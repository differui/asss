import { sPush, sPop, sTop, sBottom, sIsEmpty } from '../helper/stack';
import { STYLESHEET_NODE, RULE_NODE } from '../../types';
import { makeRuleNode, makeStylesheetNode } from '../helper/node';

export function transform(ast: STYLESHEET_NODE): STYLESHEET_NODE {
  return transformStyleSheet(ast);
}

export function transformStyleSheet(node: STYLESHEET_NODE): STYLESHEET_NODE {
  const stylesheetNode = makeStylesheetNode();

  if (node.children.length) {
    node.children.forEach(node => transformRule(node).forEach(subNode => stylesheetNode.children.push(subNode)));
  }
  return stylesheetNode;
}

export function transformRule(node: RULE_NODE): RULE_NODE[] {
  const rtn: RULE_NODE[] = [];
  const ruleNode: RULE_NODE = makeRuleNode();

  ruleNode.declarations = node.declarations;
  node.selectors.forEach((s) => {
    expandSelector(s).forEach(s => ruleNode.selectors.push(s));
  });
  sPush<RULE_NODE>(ruleNode);
  rtn.push(ruleNode);
  node.children.forEach(node => transformRule(node).forEach(subNode => rtn.push(subNode)));
  sPop<RULE_NODE>();
  return rtn;
}

// utils
// ====

export function expandSelector(selector: string): string[] {
  if (sIsEmpty()) {
    return [ selector ];
  } else if (selector.indexOf('&') > -1) {
    return sTop<RULE_NODE>().selectors.map((parentSelector) => {
      return selector.replace(/&/g, parentSelector);
    });
  } else if (selector.indexOf('^') > -1) {
    const rtn: string[] = [];

    sBottom<RULE_NODE>().selectors.map((rootSelector) => {
      sTop<RULE_NODE>().selectors.map((parentSelector) => {
        rtn.push(`${parentSelector} ${selector.replace(/\^/g, rootSelector)}`);
      });
    });
    return rtn;
  } else {
    return sTop<RULE_NODE>().selectors.map((parentSelector) => {
      return `${parentSelector} ${selector}`;
    });
  }
}
