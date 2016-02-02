export default function ({types: t}) {
  return {
    visitor: {
        /*
          separate all variable initializers into declarations and
          assignments.  (except for loops, where a different transform
          is needed - but not sure how crucial that one is)
          
          var x, y=4, z=[], a={h:4};
          
          into
          
          var x, y, z, a;
          y=4;
          z=[];
          a={h:4};
          
          application is to prep js codebase for conversion to typescript.
        */
        VariableDeclarator: function VariableDeclarator(path,state) {
            console.log("loc ", path.node.loc.start, ",", path.node.loc.end);
            var id2 = t.expressionStatement(t.identifier("path.parent.type"));
            var identifier = path.node.id;
            var initializer = path.node.init;
            if (null != initializer) {
                if (initializer.type==="ObjectExpression") {
                    // don't transform for loops.  this might be adequate
                    if (path.parentPath.parentPath.node.type !== "ForStatement") {
                        path.node.init = null; // remove the initializer
                        var assignment = t.assignmentExpression("=", identifier, initializer);
                        var stmt = t.expressionStatement(assignment);
                        path.parentPath.insertAfter(stmt);
                    }
                }
            }
        }
    }
  };
}

