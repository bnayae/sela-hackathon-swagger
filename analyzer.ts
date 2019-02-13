import {
    Node,
    Program, 
    CallExpression, 
    isCallExpression, 
    forEachChild
} from 'typescript';

export function analyze(program: Program) {
    const results: string[] = [];
    const checker = program.getTypeChecker();

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            forEachChild(sourceFile, visit);
        }
    }

    return results;

    function visit(node: Node) {
        if (isCallExpression(node)) {
            const expr = <CallExpression>node;
            const symbol = checker.getSymbolAtLocation(expr.expression);
            if (symbol.name === 'get') {
                results.push(expr.arguments[0].getText());
            }
        }
    
        forEachChild(node, visit);
    }
}