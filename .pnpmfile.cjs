module.exports = {
  hooks: {
    readPackage(packageJson) {
      const approvedPackages = [
        '@fortawesome/fontawesome-common-types',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        'bufferutil',
        'core-js',
        'sharp',
        'utf-8-validate',
      ];
      if (approvedPackages.includes(packageJson.name)) {
        packageJson.buildScriptsApproved = true;
      }
      return packageJson;
    },
  },
};
