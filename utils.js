/**
 * Site-wide utilities.
 */

var markdown = require('markdown').markdown;
exports.markdown_parse = function(text) {
    return markdown.toHTML(text);
}
