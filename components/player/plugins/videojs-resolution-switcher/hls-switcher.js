/*! videojs-resolution-switcher - 2015-7-26
 * Copyright (c) 2016 Kasper Moskwiak
 * Modified by Pierre Kraft
 * Licensed under the Apache-2.0 license. */
import storage from '../../../../utils/storage';

(function() {
    'use strict';
    var videojs = null;
    if (typeof window.videojs === 'undefined' && typeof require === 'function') {
        videojs = require('video.js');
    } else {
        videojs = window.videojs;
    }

    function addClass(el, className) {
        el.className += className;
    }

    function removeIconClass(el) {
    // var elClass = ' ' + el.className + ' '
    // el.className = elClass
        var reg = new RegExp(/(icon-)\w+/);
        el.className = el.className.replace(reg, '');
    }
    // function getUrlParamWithHash(name) {
    //   const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    //   const r = window.location.href.split('?')[1].match(reg)
    //   return r !== null ? decodeURIComponent(r[2].replace(/(\+)+/g, ' ')) : null
    // }

    (function(window, videojs) {
        var defaults = {};
        var videoJsHlsSwitcher;
        var currentResolution = {}; // stores current resolution
        var menuItemsHolder = {}; // stores menuItems

        function setSourcesSanitized(player, sources, label, customSourcePicker) {
            currentResolution = {
                label: label,
                sources: sources
            };
            if (typeof customSourcePicker === 'function') {
                return customSourcePicker(player, sources, label);
            }
            /*
      return player.src(sources.map(function(src) {
        return { src: src.src, type: src.type, res: src.res }
      }))
      */
        }

        /*
    /*
     * Resolution menu item
     */
        var MenuItem = videojs.getComponent('MenuItem');
        var ResolutionMenuItem = videojs.extend(MenuItem, {
            constructor: function(player, options, onClickListener, label) {
                this.onClickListener = onClickListener;
                this.label = label;
                // Sets this.player_, this.options_ and initializes the component
                MenuItem.call(this, player, options);
                this.src = options.src;

                this.on('click', this.onClick);
                this.on('touchstart', this.onClick);

                if (options.initialySelected) {
                    this.showAsLabel();
                    this.selected(true);

                    this.addClass('vjs-selected');
                }
            },
            showAsLabel: function() {
                // Change menu button label to the label of this item if the menu button label is provided
                var iconFontMap = {
                    '240': 'icon-p3',
                    '480': 'icon-p2',
                    '720': 'icon-p',
                    '1080': 'icon-p1',
                };
                if (this.label) {
                    removeIconClass(this.label);
                    addClass(this.label, iconFontMap[this.options_.res]);

                    // this.label.innerHTML = this.options_.label
                }
            },
            onClick: function(customSourcePicker) {
                if (storage.get('markedHlsLevel') && this.src[0].res === storage.get('markedHlsLevel')) {
                    return;
                }
                customSourcePicker.target.parentNode.style.visibility = 'hidden';
                setTimeout(function() {
                    customSourcePicker.target.parentNode.style.visibility = 'visible';
                }, 500);
                storage.set('markedHlsLevel', this.src[0].res);
                this.onClickListener(this);
                // Remember player state
                var currentTime = this.player_.currentTime();
                var ended = this.player_.ended();
                var isPaused = this.player_.paused();
                this.showAsLabel();

                // add .current class
                this.addClass('vjs-selected');
                // Hide bigPlayButton
                if (!isPaused) {
                    this.player_.bigPlayButton.hide();
                }
                if (typeof customSourcePicker !== 'function' &&
          typeof this.options_.customSourcePicker === 'function') {
                    customSourcePicker = this.options_.customSourcePicker;
                }
                // Change player source and wait for loadeddata event, then play video
                // loadedmetadata doesn't work right now for flash.
                // Probably because of https://github.com/videojs/video-js-swf/issues/124
                // If player preload is 'none' and then loadeddata not fired. So, we need timeupdate event for seek handle (timeupdate doesn't work properly with flash)
                var that = this;
                var handleSeekEvent = 'loadeddata';
                if (this.player_.preload() === 'none' && this.player_.techName_ !== 'Flash') {
                    handleSeekEvent = 'timeupdate';
                }
                this.player_.src([{
                    src: this.src[0].url,
                    type: 'application/x-mpegURL',
                }]).one(handleSeekEvent, function() {
                    this.player_.trigger('reschangeFinish', that.options_.label);
                    this.player_.currentTime(currentTime);
                    if (isPaused && !ended) {
                        this.player_.pause();
                    } else { // 播放结束而暂停
                        this.player_.play(); // 重新播放
                    }
                });
                this.player_.trigger('resolutionchange');
            }
        });

        /*
     * Resolution menu button
     */
        var MenuButton = videojs.getComponent('MenuButton');
        var ResolutionMenuButton = videojs.extend(MenuButton, {
            constructor: function(player, options, settings, label) {
                this.sources = options.sources;
                this.label = label;
                // Sets this.player_, this.options_ and initializes the component
                MenuButton.call(this, player, options, settings);
                if (settings.dynamicLabel) {
                    this.el().appendChild(label);
                } else {
                    var staticLabel = document.createElement('span');
                    videojs.addClass(staticLabel, 'vjs-resolution-button-staticlabel');
                    this.el().appendChild(staticLabel);
                }
            },
            createItems: function() {
                var menuItems = [];
                var labels = (this.sources && this.sources.label) || {};
                var onClickUnselectOthers = function(clickedItem) {
                    menuItems.map(function(item) {
                        item.selected(item === clickedItem);
                        item.removeClass('vjs-selected');
                    });
                };

                for (var key in labels) {
                    if (labels.hasOwnProperty(key)) {
                        menuItems.push(new ResolutionMenuItem(
                            this.player_,
                            {
                                label: key,
                                res: labels[key][0].res,
                                src: labels[key],
                                initialySelected: key === this.options_.initialySelectedLabel,
                                customSourcePicker: this.options_.customSourcePicker
                            },
                            onClickUnselectOthers,
                            this.label));
                        // Store menu item for API calls
                        menuItemsHolder[key] = menuItems[menuItems.length - 1];
                    }
                }
                return menuItems;
            }
        });

        /**
     * Initialize the plugin.
     * @param {object} [options] configuration for the plugin
     */
        videoJsHlsSwitcher = function(options) {
            var settings = videojs.mergeOptions(defaults, options);
            var player = this;
            var label = document.createElement('span');
            var groupedSrc = {};

            videojs.addClass(label, 'vjs-resolution-button-label');
            videojs.addClass(label, 'iconfont');
            videojs.addClass(label, 'icon-p3');
            /**
       * Updates player sources or returns current source URL
       * @param   {Array}  [src] array of sources [{src: '', type: '', label: '', res: ''}]
       * @returns {Object|String|Array} videojs player object if used as setter or current source URL, object, or array of sources
       */
            player.updateHlsSrc = function(src, selectIndex) {
                // Return current src if src is not given
                if (!src) { return player.src(); }
                // Dispose old resolution menu button before adding new sources
                if (player.controlBar.hlsSwitcher) {
                    player.controlBar.hlsSwitcher.dispose();
                    delete player.controlBar.hlsSwitcher;
                }
                // Sort sources
                src = src.sort(compareResolutions);

                groupedSrc = bucketSources(src);
                var choosen = chooseSrc(groupedSrc, src, selectIndex);
                var menuButton = new ResolutionMenuButton(player, { sources: groupedSrc, initialySelectedLabel: choosen.label, initialySelectedRes: choosen.res, customSourcePicker: settings.customSourcePicker }, settings, label);
                videojs.addClass(menuButton.el(), 'vjs-resolution-button');
                player.controlBar.hlsSwitcher = player.controlBar.el_.insertBefore(menuButton.el_, player.controlBar.getChild('volumeControl').el_);
                player.controlBar.hlsSwitcher.dispose = function() {
                    this.parentNode.removeChild(this);
                };

                return setSourcesSanitized(player, choosen.sources, choosen.label);
            };

            /**
       * Returns current resolution or sets one when label is specified
       * @param {String}   [label]         label name
       * @param {Function} [customSourcePicker] custom function to choose source. Takes 3 arguments: player, sources, label. Must return player object.
       * @returns {Object}   current resolution object {label: '', sources: []} if used as getter or player object if used as setter
       */
            player.currentResolution = function(label, customSourcePicker) {
                if (label == null) { return currentResolution; }
                if (menuItemsHolder[label] != null) {
                    menuItemsHolder[label].onClick(customSourcePicker);
                }
                return player;
            };

            /**
       * Returns grouped sources by label, resolution and type
       * @returns {Object} grouped sources: { label: { key: [] }, res: { key: [] }, type: { key: [] } }
       */
            player.getGroupedSrc = function() {
                return groupedSrc;
            };

            /**
       * Method used for sorting list of sources
       * @param   {Object} a - source object with res property
       * @param   {Object} b - source object with res property
       * @returns {Number} result of comparation
       */
            function compareResolutions(a, b) {
                if (!a.res || !b.res) { return 0; }
                return (+(b.res).slice(0, -1)) - (+(a.res).slice(0, -1));
            }

            /**
       * Group sources by label, resolution and type
       * @param   {Array}  src Array of sources
       * @returns {Object} grouped sources: { label: { key: [] }, res: { key: [] }, type: { key: [] } }
       */
            function bucketSources(src) {
                var resolutions = {
                    label: {},
                    res: {},
                    type: {}
                };
                src.map(function(source) {
                    initResolutionKey(resolutions, 'label', source);
                    initResolutionKey(resolutions, 'res', source);
                    initResolutionKey(resolutions, 'type', source);

                    appendSourceToKey(resolutions, 'label', source);
                    appendSourceToKey(resolutions, 'res', source);
                    appendSourceToKey(resolutions, 'type', source);
                });
                return resolutions;
            }

            function initResolutionKey(resolutions, key, source) {
                if (resolutions[key][source[key]] == null) {
                    resolutions[key][source[key]] = [];
                }
            }

            function appendSourceToKey(resolutions, key, source) {
                resolutions[key][source[key]].push(source);
            }

            /**
       * Choose src if option.default is specified
       * @param   {Object} groupedSrc {res: { key: [] }}
       * @param   {Array}  src Array of sources sorted by resolution used to find high and low res
       * @returns {Object} {res: string, sources: []}
       */
            function chooseSrc(groupedSrc, src, index) {
                var selectedRes = settings['default']; // use array access as default is a reserved keyword
                var selectedLabel = '';

                selectedRes = src[index].res;
                selectedLabel = src[index].label;

                /*
        if (selectedRes === 'high') {
          selectedRes = src[0].res
          selectedLabel = src[0].label
        } else if (selectedRes === 'low' || selectedRes == null || !groupedSrc.res[selectedRes]) {
          // Select low-res if default is low or not set
          selectedRes = src[src.length - 1].res
          selectedLabel = src[src.length - 1].label
        } else if (groupedSrc.res[selectedRes]) {
          selectedLabel = groupedSrc.res[selectedRes][0].label
        }
        */

                return { res: selectedRes, label: selectedLabel, sources: groupedSrc.res[selectedRes] };
            }

            player.ready(function() {
                if (player.options_.sources.length > 1) {
                    // tech: Html5 and Flash
                    // Create resolution switcher for videos form <source> tag inside <video>
                    player.updateHlsSrc(player.options_.sources);
                }
            });
        };

        // register the plugin
        videojs.plugin('videoJsHlsSwitcher', videoJsHlsSwitcher);
    })(window, videojs);
})();
