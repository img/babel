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
        VariableDeclarator:  {
            exit(path,state) {
                let node = path.node;
                // atm, always transform to typescript
                if (true || state.opts.to_ts) {
                    let identifier = path.node.id;
                    let initializer = path.node.init;
                    if (null != initializer) {
                        if (initializer.type==="ObjectExpression"
                           || initializer.type==="ArrayExpression")
                        {
                            let typedecl = t.typeAnnotation();
                            typedecl.typeAnnotation = t.anyTypeAnnotation();
                            path.node.id.typeAnnotation = typedecl;
                        }
                    }
                } else {
                    let id2 = t.expressionStatement(t.identifier("path.parent.type"));
                    let identifier = path.node.id;
                    let initializer = path.node.init;
                    if (null != initializer) {
                        if (initializer.type==="ObjectExpression") {
                            // don't transform for loops.  this might be adequate
                            if (path.parentPath.parentPath.node.type !== "ForStatement") {
                                path.node.init = null; // remove the initializer
                                let assignment = t.assignmentExpression("=", identifier, initializer);
                                let stmt = t.expressionStatement(assignment);
                                path.parentPath.insertAfter(stmt);
                            }
                        }
                    }
                }
            }
        },

        FunctionDeclaration:  {
            exit(path,state) {
                let node = path.node;
                if (true || state.opts.to_ts) {
                    let identifier = path.node.id;
                    let initializer = path.node.init;
                            let typedecl = t.typeAnnotation();
                            typedecl.typeAnnotation = t.anyTypeAnnotation();
                            path.node.returnType = typedecl;
                }
            }
        },
        FunctionExpression:  {
            exit(path,state) {
                let node = path.node;
                if (true || state.opts.to_ts) {
                    let identifier = path.node.id;
                    let initializer = path.node.init;
                            let typedecl = t.typeAnnotation();
                            typedecl.typeAnnotation = t.anyTypeAnnotation();
                            path.node.returnType = typedecl;
                }
            }
        }
    }
  };
}


