import { NODE, NODE_TYPE } from '../types';

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
  sPush(ruleNode);
  rtn.push(ruleNode);
  node.children.forEach(node => transformRule(node).forEach(subNode => rtn.push(subNode)));
  sPop();
  return rtn;
}

// utils
// ====

export function expandSelector(selector: string): string[] {
  if (sIsEmpty()) {
    return [ selector ];
  } else if (selector.indexOf('&') > -1) {
    return sTop().selectors.map((parentSelector) => {
      return selector.replace(/&/g, parentSelector);
    });
  } else if (selector.indexOf('^') > -1) {
    return sBottom().selectors.map((rootSelector) => {
      return selector.replace(/\^/g, rootSelector);
    });
  } else {
    return sTop().selectors.map((parentSelector) => {
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

// stack
// ====

const stack = [];
const MAX_STACK_LENGTH = 999;

function sPush(item: NODE): void {
  if (stack.length < MAX_STACK_LENGTH) {
    stack.push(item);
  } else {
    throw new Error('Stack overflow');
  }
}

function sPop(): NODE {
  if (!sIsEmpty()) {
    return stack.pop();
  } else {
    throw new Error('Stack is empty');
  }
}

function sTop(): NODE {
  return sIsEmpty() ? null : stack[stack.length - 1];
}

function sBottom(): NODE {
  return sIsEmpty() ? null : stack[0];
}

function sIsEmpty(): boolean {
  return stack.length === 0;
}
