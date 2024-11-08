const fs = require('fs');
const path = require( 'path' );
const juice = require('juice')

const loadTemplate = ( templateName, replacement )=>{
      const templatePath = path.join( __dirname, '../views', `${ templateName }.html` );
      const stylePath = path.join( __dirname, "../views/styles", "index.css" );

      let htmlContent = fs.readFileSync( templatePath, "utf8" );
      const cssContent = fs.readFileSync( stylePath, "utf8" );

      for ( const [ key, value ] of Object.entries( replacement ) ) {
            htmlContent = htmlContent.replace( `{{ ${ key } }}`, value );
      }

      const templateHtml = juice.inlineContent( htmlContent, cssContent );
      return templateHtml;
};

module.exports = loadTemplate