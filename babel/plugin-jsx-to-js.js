module.exports = ({types: t}) => ({
  visitor: {
    ModuleDeclaration(path) {
      const extension = '.jsx';
      const {source} = path.node;

      if (source) {
        const {value} = source;

        if (value.endsWith(extension)) {
          path.node.source = t.stringLiteral(value.slice(0, -extension.length));
        }
      }
    },
  },
});
