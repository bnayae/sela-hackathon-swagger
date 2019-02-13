import * as ts from 'typescript';

const source = `
class MyClass {
    public a: number;
    public b: string;
}
`;

function basicTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return context => {
        const visit: ts.Visitor = node => {
            if (ts.isClassDeclaration(node)) {
                console.log('A class', ts.getNameOfDeclaration(node).getText());
                return [
                    ts.createDebuggerStatement(),
                    ts.visitEachChild(node, child => visit(child), context)
                ]
            }

            return ts.visitEachChild(node, child => visit(child), context);
        };

        return node => ts.visitNode(node, visit);
    };
}

const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    transformers:  { before: [basicTransformer()] }
});

console.log(result.outputText);