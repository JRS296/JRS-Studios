(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Research tab deep links.
					else if (location.hash == '#research'
					||	location.hash == '#research-publications'
					||	location.hash == '#research-interests') {

						event.preventDefault();
						event.stopPropagation();

						$main._show('research');
						window.setResearchTab(
							location.hash == '#research-interests' ? 'interests' : 'publications',
							false
						);

					}

				// Projects folder deep links.
					else if (location.hash == '#projects'
					||	location.hash.indexOf('#projects/') === 0) {

						event.preventDefault();
						event.stopPropagation();

						if (!$('#projects').hasClass('active'))
							$main._show('projects');

						window.setProjectsView(
							location.hash === '#projects'
								? ''
								: location.hash.replace(/^#projects\/?/, ''),
							false
						);

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						var id = location.hash.substr(1);

						if (id == 'research'
						||	id == 'research-publications'
						||	id == 'research-interests') {
							$main._show('research', true);
							window.setResearchTab(id == 'research-interests' ? 'interests' : 'publications', false);
						}
						else if (id == 'projects'
						||	id.indexOf('projects/') === 0) {
							$main._show('projects', true);
							window.setProjectsView(
								id === 'projects' ? '' : id.replace(/^projects\/?/, ''),
								false
							);
						}
						else
							$main._show(id, true);
					});

		// Copyright year.
			var $copyright = $('#footer .copyright');
			if ($copyright.length)
				$copyright.text('\u00A9 ' + new Date().getFullYear() + ' JRS Studios');

		// Research tabs.
			window.setResearchTab = function(tabId, updateHash) {
				var $tabs = $('[data-tabs]'),
					$buttons = $tabs.find('[role="tab"]'),
					$panels = $tabs.find('[data-panel]'),
					$button = $buttons.filter('[data-tab="' + tabId + '"]');

				if ($button.length == 0)
					return;

				$buttons
					.removeClass('active')
					.attr('aria-selected', 'false');

				$button
					.addClass('active')
					.attr('aria-selected', 'true');

				$panels
					.removeClass('active')
					.attr('hidden', true);

				$panels
					.filter('[data-panel="' + tabId + '"]')
					.addClass('active')
					.removeAttr('hidden');

				if (updateHash) {
					var nextHash = '#' + ($button.data('hash') || ('research-' + tabId));
					if (location.hash != nextHash)
						history.replaceState(null, '', nextHash);
				}
			};

			$('[data-tabs]').each(function() {
				var $tabs = $(this),
					$buttons = $tabs.find('[role="tab"]');

				$buttons.on('click', function(event) {
					event.preventDefault();
					window.setResearchTab($(this).data('tab'), true);
				});
			});

		// Projects folder navigation.
			var projectsLabels = {
				'dijkstra': 'Dijkstra',
				'auto-mp3': 'Auto-Mp3',
				'chronicles': 'Chronicles',
				'systems': 'Systems Software',
				'vit': 'VIT Vellore',
				'vit/nulakam': 'Nulakam',
				'professional': 'Professional Training'
			};

			window.setProjectsView = function(path, updateHash) {
				var $root = $('[data-projects-root]'),
					$views = $root.children('[data-projects-view]'),
					$crumb = $('[data-projects-breadcrumb]'),
					normalized = (path || '').replace(/^\/+|\/+$/g, ''),
					$target = $views.filter(function() {
						return String($(this).attr('data-projects-view') || '') === normalized;
					});

				if ($target.length == 0) {
					normalized = '';
					$target = $views.filter(function() {
						return String($(this).attr('data-projects-view') || '') === '';
					});
				}

				$views.each(function() {
					$(this).removeClass('active').prop('hidden', true);
				});

				$target.each(function() {
					$(this).addClass('active').prop('hidden', false);
				});

				// Breadcrumb.
					var html = '<a href="#projects" data-projects-path="">Projects</a>';

					if (normalized) {
						var parts = normalized.split('/'),
							acc = [];

						parts.forEach(function(part, index) {
							acc.push(part);
							var full = acc.join('/'),
								label = projectsLabels[full] || part,
								isLast = index === parts.length - 1;

							html += '<span class="projects-breadcrumb__sep" aria-hidden="true">/</span>';

							if (isLast)
								html += '<span class="projects-breadcrumb__current">' + label + '</span>';
							else
								html += '<a href="#projects/' + full + '" data-projects-path="' + full + '">' + label + '</a>';
						});
					}

					$crumb.html(html);

				if (updateHash) {
					var nextHash = normalized ? ('#projects/' + normalized) : '#projects';
					if (location.hash != nextHash)
						history.pushState(null, '', nextHash);
				}

				$window.triggerHandler('resize.flexbox-fix');
			};

			// Intercept folder / breadcrumb links so views switch even if hash plumbing stalls.
			$(document).on('click', 'a[href^="#projects"]', function(event) {
				var href = $(this).attr('href') || '';

				if (href !== '#projects' && href.indexOf('#projects/') !== 0)
					return;

				event.preventDefault();

				if (!$('#projects').hasClass('active'))
					$main._show('projects');

				window.setProjectsView(
					href === '#projects' ? '' : href.replace(/^#projects\/?/, ''),
					true
				);
			});

			// Keep browser back/forward in sync with pushState updates.
			$window.on('popstate', function() {
				if (location.hash == '#projects'
				||	location.hash.indexOf('#projects/') === 0) {
					if (!$('#projects').hasClass('active'))
						$main._show('projects');

					window.setProjectsView(
						location.hash === '#projects'
							? ''
							: location.hash.replace(/^#projects\/?/, ''),
						false
					);
				}
			});

			// Default root view when Projects opens without a subpath.
			window.setProjectsView('', false);

})(jQuery);