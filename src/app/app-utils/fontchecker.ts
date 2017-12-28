// angular2-compatible implementation of https://github.com/zachleat/fontfaceonload
export class FontChecker {
    constructor(fontFamily, options){
        var timeout;

		for( var j in this.defaultOptions ) {
			if( !options.hasOwnProperty( j ) ) {
				options[ j ] = this.defaultOptions[ j ];
			}
		}

		this.options = options;
		this.fontFamily = fontFamily;

		// For some reason this was failing on afontgarde + icon fonts.
		if( !options.glyphs && "fonts" in document ) {
			if( options.timeout ) {
				timeout = window.setTimeout(function() {
					options.error();
				}, options.timeout );
			}

			this.checkFontFaces( timeout );
		} else {
			this.load();
		}
    }
    TEST_STRING = 'AxmTYklsjo190QW';
    SANS_SERIF_FONTS = 'sans-serif';
    SERIF_FONTS = 'serif';

    defaultOptions = {
        tolerance: 2, // px
        delay: 100,
        glyphs: '',
        success: function() {},
        error: function() {},
        timeout: 5000,
        weight: '400', // normal
        style: 'normal'
    };

    // See https://github.com/typekit/webfontloader/blob/master/src/core/fontruler.js#L41
    style = [
        'display:block',
        'position:absolute',
        'top:-999px',
        'left:-999px',
        'font-size:48px',
        'width:auto',
        'height:auto',
        'line-height:normal',
        'margin:0',
        'padding:0',
        'font-variant:normal',
        'white-space:nowrap'
    ];
    html = '<div style="%s">' + this.TEST_STRING + '</div>';
    
    fontFamily = '';
	appended = false;
    serif = undefined;
    sansSerif = undefined;
    parent = undefined;
    options = {};

    getMeasurements = function () {
		return {
			sansSerif: {
				width: this.sansSerif.offsetWidth,
				height: this.sansSerif.offsetHeight
			},
			serif: {
				width: this.serif.offsetWidth,
				height: this.serif.offsetHeight
			}
		};
	};

    load() {
		var startTime = new Date(),
			that = this,
			serif = that.serif,
			sansSerif = that.sansSerif,
			parent = that.parent,
			appended = that.appended,
			dimensions,
			options = that.options,
			ref = this.options['reference'];

		function getStyle( family,style ) {
			return style
				.concat( [ 'font-weight:' + options['weight'], 'font-style:' + options['style'] ] )
				.concat( "font-family:" + family )
				.join( ";" );
		}

		var sansSerifHtml = this.html.replace( /\%s/, getStyle( this.SANS_SERIF_FONTS, this.style ) ),
			serifHtml = this.html.replace( /\%s/, getStyle(  this.SERIF_FONTS, this.style ) );

		if( !parent ) {
			parent = that.parent = document.createElement( "div" );
		}

		parent.innerHTML = sansSerifHtml + serifHtml;
		sansSerif = that.sansSerif = parent.firstChild;
		serif = that.serif = sansSerif.nextSibling;

		if( options['glyphs'] ) {
			sansSerif.innerHTML += options['glyphs'];
			serif.innerHTML += options['glyphs'];
		}

		function hasNewDimensions( dims, el, tolerance ) {
			return Math.abs( dims.width - el.offsetWidth ) > tolerance ||
					Math.abs( dims.height - el.offsetHeight ) > tolerance;
		}

		function isTimeout() {
			return ( new Date() ).getTime() - startTime.getTime() > options['timeout'];
		}

		(function checkDimensions() {
			if( !ref ) {
				ref = document.body;
			}
			if( !appended && ref ) {
				ref.appendChild( parent );
				appended = that.appended = true;

				dimensions = that.getMeasurements();

				// Make sure we set the new font-family after we take our initial dimensions:
				// handles the case where FontFaceOnload is called after the font has already
				// loaded.
				sansSerif.style.fontFamily = that.fontFamily + ', ' + that.SANS_SERIF_FONTS;
				serif.style.fontFamily = that.fontFamily + ', ' + that.SERIF_FONTS;
			}

			if( appended && dimensions &&
				( hasNewDimensions( dimensions.sansSerif, sansSerif, options['tolerance'] ) ||
					hasNewDimensions( dimensions.serif, serif, options['tolerance'] ) ) ) {
                if(options['success']){
				    options['success']();
                }
			} else if( isTimeout() ) {
                if(options['error']){
				    options['error']();
                }
			} else {
				if( !appended && "requestAnimationFrame" in window ) {
					window.requestAnimationFrame( checkDimensions );
				} else {
					window.setTimeout( checkDimensions, options['delay'] );
				}
			}
		})();
	}; // end load()

    cleanFamilyName = function( family ) {
		return family.replace( /[\'\"]/g, '' ).toLowerCase();
	};

    cleanWeight = function( weight ) {
		// lighter and bolder not supported
		var weightLookup = {
			normal: '400',
			bold: '700'
		};

		return '' + (weightLookup[ weight ] || weight);
	};

    checkFontFaces = function( timeout ) {
		var _t = this;
		document['fonts'].forEach(function( font ) {
			if( _t.cleanFamilyName( font.family ) === _t.cleanFamilyName( _t.fontFamily ) &&
				_t.cleanWeight( font.weight ) === _t.cleanWeight( _t.options.weight ) &&
				font.style === _t.options.style ) {
				font.load().then(function() {
					_t.options.success();
					clearTimeout( timeout );
				});
			}
		});
	};
}