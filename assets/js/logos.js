/*
	Logo loader: fills <img data-logo-domain="cern.ch"> from the logo.dev CDN.
	If logo.dev has no logo for a domain, data-logo-fallback is used (or the image is hidden).
*/
(function () {
	// logo.dev publishable key (pk_...). Safe to be public; never put a secret sk_ key here.
	var LOGO_DEV_TOKEN = 'pk_aDFMsRbORqOHtNGHZoW0Xw';

	document.querySelectorAll('img[data-logo-domain]').forEach(function (img) {
		var fallback = img.getAttribute('data-logo-fallback');
		img.onerror = function () {
			img.onerror = function () { img.style.visibility = 'hidden'; };
			if (fallback) img.src = fallback; else img.onerror();
		};
		img.src = 'https://img.logo.dev/' + img.getAttribute('data-logo-domain') +
			'?token=' + LOGO_DEV_TOKEN + '&size=128&format=png&retina=true&fallback=404&theme=light';
	});
})();
