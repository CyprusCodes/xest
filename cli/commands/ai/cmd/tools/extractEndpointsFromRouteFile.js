const acorn = require("acorn");
const traverse = require("@babel/traverse");

const extractEndpointsFromRouteFile = (contents) => {
  // run through acorn
  const routesFileAST = acorn.parse(contents, { ecmaVersion: "2020" });
  let routes = [];
  let controllers = [];

  traverse.default(routesFileAST, {
    VariableDeclaration(path) {
      if (
        path.node.kind === "const" &&
        path.node.declarations &&
        path.node.declarations[0] &&
        path.node.declarations[0].init &&
        path.node.declarations[0].init.type === "CallExpression" &&
        path.node.declarations[0].init.callee.name === "require"
      ) {
        const functionName = path.node.declarations[0].id.name;
        const functionPath = path.node.declarations[0].init.arguments[0].value;
        controllers.push({ functionName, functionPath });
      }
    },
    CallExpression(path) {
      const { callee, arguments: argsArr } = path.node;
      if (
        callee.type === "MemberExpression" &&
        callee.object &&
        callee.object.name === "router"
      ) {
        const routeMethod = callee.property.name;
        const route = argsArr[0].value;
        const functionName = argsArr[argsArr.length - 1].name;
        const cntrllr = controllers.find(
          (c) => c.functionName === functionName
        );
        routes.push({
          route,
          method: routeMethod,
          controllerName: functionName,
          controllerPath: cntrllr ? cntrllr.functionPath : "",
        });
      }
    },
  });

  return routes;
};

module.exports = extractEndpointsFromRouteFile;
