import * as ts from 'typescript';

export function analyze(host: ts.CompilerHost, program: ts.Program) {
    const results: { [key: string]: any } = {
        swagger: '2.0',
        info: null,
        paths: {

        }
    }
    const checker = program.getTypeChecker();

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, visit);
        }
    }

    return results;

    function visit(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.Identifier:
                const ident = (<ts.Identifier>node)
                const identSymbol = checker.getSymbolAtLocation(ident)
                const type = checker.getTypeAtLocation(ident)
                if (identSymbol && type.symbol) {
                    if (type.symbol.name == "Application" && node.parent.parent.kind === ts.SyntaxKind.CallExpression) {
                        const callExpr = (<ts.CallExpression>node.parent.parent)
                        const callSymbol = checker.getSymbolAtLocation(callExpr.expression)
                        if (callSymbol && callSymbol.name == "use") {
                            const route = {
                                path: (<ts.StringLiteral>callExpr.arguments[0]).text,
                                router: checker.getSymbolAtLocation(callExpr.arguments[1])!
                            }
                            results[route.router.name] = route
                        }
                    }
                    else if (type.symbol.name == "Router" && node.parent.parent.kind === ts.SyntaxKind.CallExpression) {
                        const callExpr = (<ts.CallExpression>node.parent.parent)
                        const callSymbol = checker.getSymbolAtLocation(callExpr.expression)
                        if (callSymbol && callSymbol.name == "get" && callExpr.arguments[1].kind === ts.SyntaxKind.ArrowFunction) {
                            const callback = (<ts.ArrowFunction>callExpr.arguments[1])

                            results[(<ts.StringLiteral>callExpr.arguments[0]).text] = {}
                        }
                    }
                    else if (type.symbol.name == "Express" && node.parent.parent.kind === ts.SyntaxKind.CallExpression) {
                        const callExpr = (<ts.CallExpression>node.parent.parent)
                        const callSymbol = checker.getSymbolAtLocation(callExpr.expression)
                        if (callSymbol && callSymbol.name == "get" && callExpr.arguments[1].kind === ts.SyntaxKind.ArrowFunction) {
                            const callback = (<ts.ArrowFunction>callExpr.arguments[1])

                            const path = (<ts.StringLiteral>callExpr.arguments[0]).text
                            results.paths[path] = {
                                get: {
                                    produces: "application/json",
                                    parameters: {},
                                    responses: {
                                        200: {
                                            description: "successful operation"
                                        },
                                        400: {
                                            description: "Invalid status value"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
        }

        ts.forEachChild(node, visit);
    }
}