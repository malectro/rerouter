const baseConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'],
        },
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    require('./babel/plugin-jsx-to-js'),
  ],
};

const config =
  process.env.NODE_ENV === 'test' ?
    baseConfig
    : {...baseConfig, ignore: ['**/*.test.js']};

module.exports = config;
