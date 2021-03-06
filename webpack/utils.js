const fs = require('fs');
const path = require('path');

module.exports = {
    parseVersion,
    root,
    isExternalLib
};

// Returns the second occurrence of the version number from `build.gradle` file
function parseVersion() {
    // const versionRegex = /^version\s*=\s*[',"]([^',"]*)[',"]/gm; // Match and group the version number
    // const buildGradle = fs.readFileSync('build.gradle', 'utf8');
    // return versionRegex.exec(buildGradle);
    const versionRegex = /^build.version\s*=\s*(.*)/gm; // Match and group the version number
    const buildInfoFileName = 'build/resources/main/META-INF/build-info.properties';
    if (fs.existsSync(buildInfoFileName)) {
        const buildInfo = fs.readFileSync('build/resources/main/META-INF/build-info.properties', 'utf8');
        return versionRegex.exec(buildInfo)[1];
    } else {
        return 'undefined';
    }
}

const _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

function isExternalLib(module, check = /node_modules/) {
    const req = module.userRequest;
    if (typeof req !== 'string') {
        return false;
    }
    return req.search(check) >= 0;
}
