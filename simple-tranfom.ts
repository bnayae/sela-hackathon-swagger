import * as ts from "typescript";

const source = `
@foo
class MyClass {
  @bar
  public a: number;

  @baz
  public b: number;
}
`;

function simpleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    const visit: ts.Visitor = node => {
      if (ts.isDecorator(node)) {
        return undefined;
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}

const result = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
  transformers: { before: [simpleTransformer()] }
});

console.log(result.outputText);
