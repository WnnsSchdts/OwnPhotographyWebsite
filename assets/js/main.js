/*
    Lens by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

var main = (function($) { var _ = {

    /**
     * Settings.
     * @var {object}
     */
    settings: {

        // Preload all images.
            preload: false,

        // Slide duration (must match "duration.slide" in _vars.scss).
            slideDuration: 500,

        // Layout duration (must match "duration.layout" in _vars.scss).
            layoutDuration: 750,

        // Thumbnails per "row" (must match "misc.thumbnails-per-row" in _vars.scss).
            thumbnailsPerRow: 2,

        // Side of main wrapper (must match "misc.main-side" in _vars.scss).
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

        // Escape: Toggle main wrapper.
            27: function() {
                _.toggle();
            },

        // Up: Move up.
            38: function() {
                _.up();
            },

        // Down: Move down.
            40: function() {
                _.down();
            },

        // Space: Next.
            32: function() {
                _.next();
            },

        // Right Arrow: Next.
            39: function() {
                _.next();
            },

        // Left Arrow: Previous.
            37: function() {
                _.previous();
            }

    },

    /**
     * Initialize properties.
     */
    initProperties: function() {

        // Window, body.
            _.$window = $(window);
            _.$body = $('body');

        // Thumbnails.
            _.$thumbnails = $('#thumbnails');

        // Viewer.
            _.$viewer = $(
                '<div id="viewer">' +
                    '<div class="inner">' +
                        '<div class="nav-next"></div>' +
                        '<div class="nav-previous"></div>' +
                        '<div class="toggle"></div>' +
                    '</div>' +
                '</div>'
            ).appendTo(_.$body);

        // Nav.
            _.$navNext = _.$viewer.find('.nav-next');
            _.$navPrevious = _.$viewer.find('.nav-previous');

        // Main wrapper.
            _.$main = $('#main');

        // Toggle.
            $('<div class="toggle"></div>')
                .appendTo(_.$main);

            _.$toggle = $('.toggle');

    },

    /**
     * Initialize events.
     */
    initEvents: function() {

        // Window.

            // Remove is-preload-* classes on load.
                _.$window.on('load', function() {

                    _.$body.removeClass('is-preload-0');

                    window.setTimeout(function() {
                        _.$body.removeClass('is-preload-1');
                    }, 100);

                    window.setTimeout(function() {
                        _.$body.removeClass('is-preload-2');
                    }, 100 + Math.max(_.settings.layoutDuration - 150, 0));

                });

            // Disable animations/transitions on resize.
                var resizeTimeout;

                _.$window.on('resize', function() {

                    _.$body.addClass('is-preload-0');
                    window.clearTimeout(resizeTimeout);

                    resizeTimeout = window.setTimeout(function() {
                        _.$body.removeClass('is-preload-0');
                    }, 100);

                });

        // Viewer.

            // Hide main wrapper on tap (<= medium only).
                _.$viewer.on('touchend', function() {

                    if (breakpoints.active('<=medium'))
                        _.hide();

                });

            // Touch gestures.
                _.$viewer
                    .on('touchstart', function(event) {

                        // Record start position.
                            _.$viewer.touchPosX = event.originalEvent.touches[0].pageX;
                            _.$viewer.touchPosY = event.originalEvent.touches[0].pageY;

                    })
                    .on('touchmove', function(event) {

                        // No start position recorded? Bail.
                            if (_.$viewer.touchPosX === null
                            ||	_.$viewer.touchPosY === null)
                                return;

                        // Calculate stuff.
                            var	diffX = _.$viewer.touchPosX - event.originalEvent.touches[0].pageX,
                                diffY = _.$viewer.touchPosY - event.originalEvent.touches[0].pageY;
                                boundary = 20,
                                delta = 50;

                        // Swipe left (next).
                            if ( (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta) )
                                _.next();

                        // Swipe right (previous).
                            else if ( (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta)) )
                                _.previous();

                        // Overscroll fix.
                            var	th = _.$viewer.outerHeight(),
                                ts = (_.$viewer.get(0).scrollHeight - _.$viewer.scrollTop());

                            if ((_.$viewer.scrollTop() <= 0 && diffY < 0)
                            || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

                                event.preventDefault();
                                event.stopPropagation();

                            }

                    });

        // Main.

            // Touch gestures.
                _.$main
                    .on('touchstart', function(event) {

                        // Bail on xsmall.
                            if (breakpoints.active('<=xsmall'))
                                return;

                        // Record start position.
                            _.$main.touchPosX = event.originalEvent.touches[0].pageX;
                            _.$main.touchPosY = event.originalEvent.touches[0].pageY;

                    })
                    .on('touchmove', function(event) {

                        // Bail on xsmall.
                            if (breakpoints.active('<=xsmall'))
                                return;

                        // No start position recorded? Bail.
                            if (_.$main.touchPosX === null
                            ||	_.$main.touchPosY === null)
                                return;

                        // Calculate stuff.
                            var	diffX = _.$main.touchPosX - event.originalEvent.touches[0].pageX,
                                diffY = _.$main.touchPosY - event.originalEvent.touches[0].pageY;
                                boundary = 20,
                                delta = 50,
                                result = false;

                        // Swipe to close.
                            switch (_.settings.mainSide) {

                                case 'left':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                                    break;

                                case 'right':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                                    break;

                                default:
                                    break;

                            }

                            if (result)
                                _.hide();

                        // Overscroll fix.
                            var	th = _.$main.outerHeight(),
                                ts = (_.$main.get(0).scrollHeight - _.$main.scrollTop());

                            if ((_.$main.scrollTop() <= 0 && diffY < 0)
                            || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

                                event.preventDefault();
                                event.stopPropagation();

                            }

                    });

        // Toggle.
            _.$toggle.on('click', function() {
                _.toggle();
            });

            // Prevent event from bubbling up to "hide event on tap" event.
                _.$toggle.on('touchend', function(event) {
                    event.stopPropagation();
                });

        // Nav.
            _.$navNext.on('click', function() {
                _.next();
            });

            _.$navPrevious.on('click', function() {
                _.previous();
            });

        // Keyboard shortcuts.

            // Ignore shortcuts within form elements.
                _.$body.on('keydown', 'input,select,textarea', function(event) {
                    event.stopPropagation();
                });

            _.$window.on('keydown', function(event) {

                // Ignore if locked.
                    if (_.locked)
                        return;

                // Check for key.
                    if (_.keys[event.keyCode])
                        _.keys[event.keyCode]();

            });

        // Thumbnail clicks.
            _.$thumbnails.on('click', 'a', function(event) {
                event.preventDefault();
                _.show($(this).attr('href'));
            });

        // On page load.
            _.$body.removeClass('is-preload');

            // Create slides from "thumb" links.
            _.$thumbnails.find('a').each(function() {
                var _this = $(this),
                    slide = {

                        id: _this.attr('href'),
                        img: _this.find('img').attr('src'),
                        title: _this.find('img').attr('alt'),
                        thumb: _this.find('img').attr('data-thumbnail')
                    };

                // Add to slides array.
                _.slides.push(slide);
            });

            // Display the first slide.
            _.show(_.slides[0].id);

    },

    /**
     * Show a slide.
     * @param {string} id
     */
    show: function(id) {

        // Lock.
            _.locked = true;

        // Get slide.
            var slide = _.slides.filter(function(slide) {
                return slide.id === id;
            })[0];

        // Hide the current slide (if any).
            if (_.current !== null)
                $('#slide-' + _.current).removeClass('visible');

        // Add the new slide (creating the element if necessary).
            if ($('#slide-' + slide.id).length == 0) {

                // Create slide element.
                    var $slide = $('<div id="slide-' + slide.id + '" class="slide">')
                        .appendTo(_.$viewer.find('.inner'));

                // Create the slide contents.
                    $slide.append(
                        '<div class="image">' +
                            '<img src="' + slide.img + '" alt="" />' +
                        '</div>' +
                        '<div class="title">' +
                            '<h2>' + slide.title + '</h2>' +
                        '</div>'
                    );

            }

        // Make it visible.
            $('#slide-' + slide.id).addClass('visible');

        // Update current.
            _.current = slide.id;

        // Unlock.
            _.locked = false;

    },

    /**
     * Hide viewer.
     */
    hide: function() {

        // Lock.
            _.locked = true;

        // Remove visible class from current slide.
            $('#slide-' + _.current).removeClass('visible');

        // Reset current.
            _.current = null;

        // Unlock.
            _.locked = false;

    },

    /**
     * Toggle viewer.
     */
    toggle: function() {

        // If we're locked, bail.
            if (_.locked)
                return;

        // If we're visible, hide.
            if (_.$viewer.hasClass('visible'))
                _.hide();

        // Otherwise, show.
            else
                _.show(_.slides[0].id);

    },

    /**
     * Next slide.
     */
    next: function() {

        // If we're locked, bail.
            if (_.locked)
                return;

        // Get next slide.
            var index = _.slides.findIndex(function(slide) {
                return slide.id === _.current;
            });

            index++;

        // Loop back if necessary.
            if (index >= _.slides.length)
                index = 0;

        // Show next slide.
            _.show(_.slides[index].id);

    },

    /**
     * Previous slide.
     */
    previous: function() {

        // If we're locked, bail.
            if (_.locked)
                return;

        // Get previous slide.
            var index = _.slides.findIndex(function(slide) {
                return slide.id === _.current;
            });

            index--;

        // Loop back if necessary.
            if (index < 0)
                index = _.slides.length - 1;

        // Show previous slide.
            _.show(_.slides[index].id);

    },

    /**
     * Up.
     */
    up: function() {
        _.next();
    },

    /**
     * Down.
     */
    down: function() {
        _.previous();
    }

};

// Initialize.
    _.initProperties();
    _.initEvents();

})(jQuery);
