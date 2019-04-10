const getBuiltins = require('builtins');
const readPkg = require('read-pkg');
const semver = require('semver');

module.exports = ({
  builtins = true,
  dependencies = true,
  packagePath,
  peerDependencies = true,
} = {}) => ({
  name: 'auto-external',
  options(opts) {
    const pkg = readPkg.sync(packagePath);
    let ids = [];

    if (dependencies && pkg.dependencies) {
      ids = ids.concat(Object.keys(pkg.dependencies));
    }

    if (peerDependencies && pkg.peerDependencies) {
      ids = ids.concat(Object.keys(pkg.peerDependencies));
    }

    if (builtins) {
      ids = ids.concat(getBuiltins(semver.valid(builtins)));
    }

    const external = id => {
      if (typeof opts.external === 'function' && opts.external(id)) {
        return true;
      }

      if (Array.isArray(opts.external) && opts.external.includes(id)) {
        return true;
      }

      return ids.some(idx => id === idx || id.startsWith(idx + '/'));
    };

    return Object.assign({}, opts, { external });
  },
});
