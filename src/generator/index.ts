import { NODE_TYPE, NODE, GENERATOR_OPTIONS } from '../../types';

export function generate(ast: NODE, opts: GENERATOR_OPTIONS = { indent: 2 }): string {
  if (ast.type === NODE_TYPE.STYLESHEET) {
    const rtn: string[] = [];

    ast.children.forEach((node) => {
      const rule = generateRule(node, opts.indent);

      if (rule) {
        rtn.push(rule);
      }
    });
    return rtn.join('\n');
  }
  if (ast.type === NODE_TYPE.RULE) {
    return generateRule(ast, opts.indent).trim();
  }
  throw new Error('Invalid abstract syntax tree.');
}

export function generateRule(node: NODE, indent: number): string {
  if (node.declarations.length) {
    const spaces = new Array(indent + 1).join(' ');
    const declarations = node.declarations.map(([ k, v ]) => `${spaces}${k}: ${v}`).join(';\n');

    return [
      `${node.selectors.join(',')} {`,
        declarations,
      '}'
    ].join('\n');
  }
  return '';
}
