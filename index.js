const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const REGEX_YAML = /\.ya?ml$/;

const getFile = (filename, module) => {
    filename = filename === 'unknown' ? module : path.join(path.resolve(filename), '..', module);
    delete require.cache[filename];
    return fs.readFileSync(filename, 'utf-8').toString();
};

module.exports = ({ Plugin, types }) => {
    const getLeftExpression = (specifiers) => specifiers.length === 1 && specifiers[0].type === 'ImportDefaultSpecifier'
        ? types.identifier(specifiers[0].local.name)
        : types.objectPattern(specifiers.map((specifier) => {
            return types.objectProperty(
                types.identifier(specifier.imported.name),
                types.identifier(specifier.local.name)
            );
        }))
    ;
    const createBuilderValueNode = (parent, module) => (callback) => {
        return types.valueToNode(callback(getFile(parent.file.opts.filename, module)));
    };
    const createBuilderNodeExitImportDeclaration = (specifiers, parent, module) => (callback) => {
        const build = createBuilderValueNode(parent, module);
        return types.variableDeclaration('const', [types.variableDeclarator(getLeftExpression(specifiers), build(callback))]);
    };

    return {
        visitor: {
            CallExpression(path, parent) {
                if (path.node.callee.name !== 'require') return;
                const module = path.node.arguments[0].value;
                const build = createBuilderValueNode(parent, module);
                if (REGEX_YAML.test(module)) {
                    path.replaceWith(build(yaml.load));
                }
            },
            ImportDeclaration: {
                exit(path, parent) {
                    const module = path.node.source.value;
                    const build = createBuilderNodeExitImportDeclaration(path.node.specifiers, parent, module);
                    if (REGEX_YAML.test(module)) {
                        path.replaceWith(build(yaml.load));
                    }
                },
            },
        },
    };
};
