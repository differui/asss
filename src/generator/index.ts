export function generate(ast: STYLESHEET_NODE, opts: GENERATOR_OPTIONS): string {
  const rtn: string[] = [];

  ast.children.forEach((node) => {
    const rule = generateRule(node, opts.indent);

    if (rule) {
      rtn.push(rule);
    }
  });
  return rtn.join('\n');
}

export function generateRule(node: RULE_NODE, indent: number): string {
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
