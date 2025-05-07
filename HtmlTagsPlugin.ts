import { rspack } from '@rspack/core';

class HtmlTagsPlugin {
  /**
   * rspack 的 HTML 标签插件，可将 CSS 和 JS 标签注入生成的 HTML 中
   * @param options -插件选项
   *   @param {string[]} options.css
   *   @param {string[]} options.js
   */
  options: Record<string, string[]>;
  constructor(options = {}) {
    // console.log(options);
    this.options = options;
  }
  apply(compiler: any) {
    compiler.hooks.compilation.tap('HtmlTagsPlugin', (compilation: any) => {
      const hooks = rspack.HtmlRspackPlugin.getCompilationHooks(compilation);
      hooks.alterAssetTagGroups.tapPromise(
        'HtmlTagsPlugin',
        async (pluginArgs): Promise<any> => {
          const cssTags = this.options.css.map((item) => ({
            tagName: 'link',
            attributes: { rel: 'stylesheet', href: item },
            voidTag: true,
          }));
          const jsTags = this.options.js.map((item) => ({
            tagName: 'script',
            attributes: { src: item },
            voidTag: false,
          }));
          pluginArgs.headTags = pluginArgs.headTags.concat(cssTags);
          pluginArgs.bodyTags = pluginArgs.bodyTags.concat(jsTags);
          // console.log(pluginArgs);
        },
      );
    });
  }
}

export default HtmlTagsPlugin;
