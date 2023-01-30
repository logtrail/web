const { resolve } = require('path');

const src = 'src';

const aliases = {
  '@': [src],
  src: [src],
  app: [src, '..'],
  components: [src, 'components'],
  layouts: [src, 'layouts'],
  mixins: [src, 'mixins'],
  pages: [src, 'pages'],
  services: [src, 'services'],
  stores: [src, 'stores'],
};

const aliasGenerator = (...dir) => ({
  ...Object.keys(aliases)
    .reduce((acc, key) => {
      const path = resolve(...dir, ...aliases[key]);
      return {
        ...acc,
        [key]: path,
      };
    }, {}),
});

aliasGenerator.jestAlias = (...dir) => Object.fromEntries(
  Object
    .entries(
      aliasGenerator(
        ...dir
          .map((path) => path.replace('<rootDir>', resolve('.'))),
      ),
    )
    .map(([from, to]) => [`^${from}/(.*)$`, `${to}/$1`]),
);

module.exports = aliasGenerator;
