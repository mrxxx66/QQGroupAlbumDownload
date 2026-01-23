const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack").default;
const Components = require("unplugin-vue-components/webpack").default;
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  outputDir: "web",
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack(config) {
    // 代码分割，按需加载
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementplus: {
          name: 'chunk-element-plus',
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          priority: 20,
          chunks: 'initial'
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    });
    
    // 为第三方库启用懒加载
    config.plugin('preload').tap(options => {
      options[0] = {
        ...options[0],
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      };
      return options;
    });
  }
});