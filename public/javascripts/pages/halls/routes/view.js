'use strict';

(function() {

	var onDocumentReady = function() {
		// for loaded images show image, hide preloader
		$('.route-photo').on('load', function() {
			var loaderSelector = $(this).data('loader-selector');
			$(loaderSelector).hide();

			$(this).show();
		}).each(function() {
			if (this.complete) {
				$(this).trigger('load');
			}
		});
	};

	$(document).ready(onDocumentReady);

})();
