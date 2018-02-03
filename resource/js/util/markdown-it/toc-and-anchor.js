export default class TocAndAnchorConfigurer {

  constructor(crowi) {
    this.crowi = crowi;
  }

  configure(md) {
    md.use(require('markdown-it-toc-and-anchor').default, {
        anchorLinkBefore: false,
        anchorLinkSymbol: '',
        anchorLinkSymbolClassName: 'fa fa-link',
        anchorClassName: 'revision-head-link',
      })
      .use(require('markdown-it-named-headers'), {  // overwrite id defined by markdown-it-toc-and-anchor
        slugify: this.customSlugify,
      })
      ;

    md.set({
      tocCallback: (tocMarkdown, tocArray, tocHtml) => {
        // TODO impl
        // $('#revision-toc').append(`
        //   <div id="revision-toc-content" class="revision-toc-content collapse in">
        //     ${tocHtml}
        //   </div>`);
      },
    });
  }

  /**
   * create Base64 encoded id
   * @see https://qiita.com/satokaz/items/64582da4640898c4bf42
   * @param {string} header
   */
  customSlugify(header) {
    return encodeURIComponent(header.trim()
      .toLowerCase()
      .replace(/[\]\[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\{\|\}\~]/g, '')
      .replace(/\s+/g, '-')) // Replace spaces with hyphens
      .replace(/\-+$/, ''); // Replace trailing hyphen
  }
}
