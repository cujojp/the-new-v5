const DOMParser = require('xmldom').DOMParser;
const defs = new DOMParser().parseFromString('<defs></defs>');
const gulp = require('gulp');
const svg = require('gulp-svg-sprite');
const filelog = require('gulp-filelog');

/**
 * Extracts gradient from the sprite and replaces their ids to prevent duplicates.
 * @param {SVGShape} shape
 * @param {SVGSpriter} spriter
 * @param {Function} callback
 */
function gradientsExtraction(shape, spriter, callback) {
  const idsToReplace = [].concat(
    extractGradients(shape, 'linearGradient'),
    extractGradients(shape, 'radialGradient')
  );

  shape.setSVG(updateUrls(shape.getSVG(), idsToReplace));

  callback(null);
}

/**
 * Extracts specific gradient defined by tag from given shape.
 * @param {SVGShape} shape
 * @param {string} tag
 * @return {Array}
 */
function extractGradients(shape, tag) {
  const idsToReplace = [];

  const gradients = shape.dom.getElementsByTagName(tag);
  while (gradients.length > 0) {
    // Add gradient to defs block
    defs.documentElement.appendChild(gradients[0]);

    // Give gradient new ID
    const id = gradients[0].getAttribute('id');
    const newId = 'g' + (++count);
    gradients[0].setAttribute('id', newId);

    idsToReplace.push([id, newId]);
  }

  return idsToReplace;
}

/**
 * Updates urls in given SVG from array of [oldId, newId].
 * @param {string} svg
 * @param {Array} idsToReplace
 * @return {string}
 */
function updateUrls(svg, idsToReplace) {
  for (let i = 0; i < idsToReplace.length; i++) {
    const str = 'url(#' + idsToReplace[i][0] + ')';
    svg = svg.replace(
      new RegExp(regexEscape(str), 'g'),
      'url(#' + idsToReplace[i][1] + ')'
    );
  }

  return svg;
}

/**
 * Escape regex characters in given string
 * @param {string} str
 * @return {string}
 */
function regexEscape(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var config = {
  dest: './',
  shape: {
    id: {
      generator: '%s'
    },
    transform: [
      gradientsExtraction
    ],
  },
  mode: {
    symbol: {
      inline: true,
      sprite: '../icons.svg'
    }
  },
  svg: {
    transform: [
      /**
    * Adds defs tag at the top of svg with all extracted gradients.
    * @param {string} svg
    * @return {string} svg
    */
      function(svg) {
        return svg.replace(
          '<symbol ',
          defs.firstChild.toString() + '<symbol '
        );
      },
    ],
  }
};

gulp.task('svg', function () {
  gulp.src(['./src/svg/*.svg'])
    .pipe(filelog())
    .pipe(svg(config))
    .pipe(gulp.dest('./src/svg' ));
});
