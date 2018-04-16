import { NODE, NODE_TYPE } from '../../types';
import { sPush, sPop, sTop, sBottom, sIsEmpty } from '../helper/stack';

export function transform(ast: NODE): NODE {
  if (ast.type === NODE_TYPE.STYLESHEET) {
    return transformStyleSheet(ast);
  }
  if (ast.type === NODE_TYPE.RULE) {
    const stylesheetNode = makeNode(NODE_TYPE.STYLESHEET);

    stylesheetNode.children = transformRule(ast);
    return stylesheetNode;
  }
  throw new Error('Invalid abstract syntax tree.');
}

export function transformStyleSheet(node: NODE): NODE {
  const stylesheetNode = makeNode(NODE_TYPE.STYLESHEET);

  if (node.children.length) {
    node.children.forEach(node => transformRule(node).forEach(subNode => stylesheetNode.children.push(subNode)));
  }
  return stylesheetNode;
}

export function transformRule(node: NODE): NODE[] {
  const rtn: NODE[] = [];
  const ruleNode: NODE = makeNode(NODE_TYPE.RULE);

  ruleNode.declarations = node.declarations;
  node.selectors.forEach((s) => {
    expandSelector(s).forEach(s => ruleNode.selectors.push(s));
  });
  sPush<NODE>(ruleNode);
  rtn.push(ruleNode);
  node.children.forEach(node => transformRule(node).forEach(subNode => rtn.push(subNode)));
  sPop<NODE>();
  return rtn;
}

// utils
// ====

export function expandSelector(selector: string): string[] {
  if (sIsEmpty()) {
    return [ selector ];
  } else if (selector.indexOf('&') > -1) {
    return sTop<NODE>().selectors.map((parentSelector) => {
      return selector.replace(/&/g, parentSelector);
    });
  } else if (selector.indexOf('^') > -1) {
    const rtn: string[] = [];

    sBottom<NODE>().selectors.map((rootSelector) => {
      sTop<NODE>().selectors.map((parentSelector) => {
        rtn.push(`${parentSelector} ${selector.replace(/\^/g, rootSelector)}`);
      });
    });
    return rtn;
  } else {
    return sTop<NODE>().selectors.map((parentSelector) => {
      return `${parentSelector} ${selector}`;
    });
  }
}

export function makeNode(nodeType: NODE_TYPE): NODE {
  const node: NODE = {
    type: nodeType
  };

  if (nodeType === NODE_TYPE.STYLESHEET) {
    node.children = [];
  } else {
    node.selectors = [];
    node.declarations = [];
  }
  return node;
}
