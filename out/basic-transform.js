"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const source = `
class MyClass {
    public a: number;
    public b: string;
}
`;
function basicTransformer() {
    return context => {
        const visit = node => {
            if (ts.isClassDeclaration(node)) {
                console.log('A class', ts.getNameOfDeclaration(node).getText());
                return [
                    ts.createDebuggerStatement(),
                    ts.visitEachChild(node, child => visit(child), context)
                ];
            }
            return ts.visitEachChild(node, child => visit(child), context);
        };
        return node => ts.visitNode(node, visit);
    };
}
const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
    transformers: { before: [basicTransformer()] }
});
console.log(result.outputText);
//# sourceMappingURL=basic-transform.js.map