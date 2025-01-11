var main = (function($) { var _ = {

	/**
	 * Settings.
	 * @var {object}
	 */
	settings: {
		// Settings van je code blijven ongewijzigd
		preload: false,
		slideDuration: 500,
		layoutDuration: 750,
		thumbnailsPerRow: 2,
		mainSide: 'right'
	},

	/**
	 * Window.
	 * @var {jQuery}
	 */
	$window: null,

	/**
	 * Body.
	 * @var {jQuery}
	 */
	$body: null,

	/**
	 * Main wrapper.
	 * @var {jQuery}
	 */
	$main: null,

	/**
	 * Thumbnails.
	 * @var {jQuery}
	 */
	$thumbnails: null,

	/**
	 * Viewer.
	 * @var {jQuery}
	 */
	$viewer: null,

	/**
	 * Toggle.
	 * @var {jQuery}
	 */
	$toggle: null,

	/**
	 * Nav (next).
	 * @var {jQuery}
	 */
	$navNext: null,

	/**
	 * Nav (previous).
	 * @var {jQuery}
	 */
	$navPrevious: null,

	/**
	 * Slides.
	 * @var {array}
	 */
	slides: [],

	/**
	 * Current slide index.
	 * @var {integer}
	 */
	current: null,

	/**
	 * Lock state.
	 * @var {bool}
	 */
	locked: false,

	/**
	 * Keyboard shortcuts.
	 * @var {object}
	 */
	keys: {
		27: function() { _.toggle(); },
		38: function() { _.up(); },
		40: function() { _.down(); },
		32: function() { _.next(); },
		39: function() { _.next(); },
		37: function() { _.previous(); }
	},

	/**
	 * Initialize properties.
	 */
	initProperties: function() {
		_.$window = $(window);
		_.$body = $('body');
		_.$thumbnails = $('#thumbnails');
		_.$viewer = $('<div id="viewer"><div class="inner"><div class="nav-next"></div><div class="nav-previous"></div><div class="toggle"></div></div></div>').appendTo(_.$body);
		_.$navNext = _.$viewer.find('.nav-next');
		_.$navPrevious = _.$viewer.find('.nav-previous');
		_.$main = $('#main');
		$('<div class="toggle"></div>').appendTo(_.$main);
		_.$toggle = $('.toggle');
	},

	/**
	 * Initialize events.
	 */
	initEvents: function() {
		_.$window.on('load', function() {
			_.$body.removeClass('is-preload-0');
			window.setTimeout(function() {
				_.$body.removeClass('is-preload-1');
			}, 100);
			window.setTimeout(function() {
				_.$body.removeClass('is-preload-2');
			}, 100 + Math.max(_.settings.layoutDuration - 150, 0));
		});

		// More event listeners go here...

		// Dynamische wijziging van thumbnail
		_.$thumbnails.on('click', '.work-item', function() {
			const item = $(this);
			const thumbnailSrc = item.data('thumbnail');
			const fullsizeSrc = item.data('fullsize');

			// Wijzig de eerste thumbnail (of maak een ander doelwit)
			const thumbnailElement = $('.thumbnails .thumbnail img');
			if (thumbnailElement.length) {
				thumbnailElement.attr('src', thumbnailSrc);
			}

			// Wijzig de fullsize link
			const thumbnailLink = $('.thumbnails .thumbnail');
			if (thumbnailLink.length) {
				thumbnailLink.attr('href', fullsizeSrc);
			}
		});
	},

	/**
	 * Initialize viewer.
	 */
	initViewer: function() {
		_.$thumbnails.on('click', '.thumbnail', function(event) {
			var $this = $(this);
			event.preventDefault();
			event.stopPropagation();

			if (_.locked) $this.blur();
			_.switchTo($this.data('index'));
		});
		_.$thumbnails.children().each(function() {
			var $this = $(this), $thumbnail = $this.children('.thumbnail'), s;
			s = {
				$parent: $this,
				$slide: null,
				$slideImage: null,
				$slideCaption: null,
				url: $thumbnail.attr('href'),
				loaded: false
			};
			$this.attr('tabIndex', '-1');
			s.$slide = $('<div class="slide"><div class="caption"></div><div class="image"></div></div>');
			s.$slideImage = s.$slide.children('.image');
			s.$slideImage.css('background-image', '').css('background-position', ($thumbnail.data('position') || 'center'));
			s.$slideCaption = s.$slide.find('.caption');
			$this.children().not($thumbnail).appendTo(s.$slideCaption);
			if (_.settings.preload) {
				var $img = $('<img src="' + s.url + '" />');
				s.$slideImage.css('background-image', 'url(' + s.url + ')');
				s.$slide.addClass('loaded');
				s.loaded = true;
			}
			_.slides.push(s);
			$thumbnail.data('index', _.slides.length - 1);
		});
	},

	// Rest van de code blijft hetzelfde

}; return _; })(jQuery); main.init();
