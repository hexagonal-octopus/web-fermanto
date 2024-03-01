feather.replace();

// PRELOADER HANDLE
// ==================================
$(window).on('load', function() {
	$('.preloader').fadeOut();
});

$(function() {
	// Global Variables
	// ===================================
	// ===================================
	var navbar = $('.navbar');
	var mainNavigationLink = $('#mainNavigation a');
	var selectbox = $('.selectbox');
	var selectCat = $('.select-category');
	var imageProduct = $('.image--zoomlist');
	var tagElement = $('.tag');
	var timer;
	// var x = location.search.substr(1).split('&');

	// Functions
	// ===================================
	// ===================================

	// Function Add Tag Filter based on selected select-category
	// ===================================
	var addCategoryIntoTag = function(arr) {
		var tagList = $('.tag__lists');
		var tagListItem = '';

		// Assign array item into separated tag-item with close handler
		$.each(arr, function(index, value) {
			tagListItem += '<span class="tag__item">';
			tagListItem += value;
			tagListItem += '<i class="tag__remove"  data-feather="x"></i>';
			tagListItem += '</span>';
		});

		// fill tagList with assigned tag-item
		tagList.html(tagListItem);

		// reload feather js to showing svg
		feather.replace();

		// Insert buttonRemoveAll if there is tag item
		var buttonRemoveAll = $(
			'<div class="tag__action"><button class="button button--tertiary" id="removeAllTags">Delete Categories</button></div>'
		);

		if (arr.length > 0) {
			tagElement.css('display', 'flex');
			tagList.append(buttonRemoveAll);
		} else {
			tagElement.css('display', 'none');
		}

		// Tag self close event handler
		// ============================
		tagElement.on('click', '.tag__remove', function(e) {
			var valueElement = $(this)
				.parent()
				.text();

			$(this)
				.parent()
				.remove();
			$('input[value="' + valueElement + '"]').prop('checked', false);

			if ($('.tag__item').length === 0) {
				$('.tag')
					.css('display', 'none')
					.find('.tag__lists')
					.html('');
			}

			var removeItem = arr.indexOf(valueElement);
			if (removeItem !== -1) {
				arr.splice(removeItem, 1);
				// console.log(arr);
			}

			// Update Query parameter on window.location
			updateQuery = arr.join(',').replace(/\s/g, '+');
			insertParams('category', updateQuery);
		});

		// remove all Tags event handler
		// ======================================
		tagElement.on('click', '#removeAllTags', function() {
			arr.splice(0, arr.length);
			$('.tag').css('display', 'none');
			$('.tag__lists').html('');
			$('input.select-category__check').prop('checked', false);

			// Update Query parameter on window.location
			insertParams('category', arr);
		});
	};

	// Function Adding Parameter on Existing URL
	// @param {string} key of query
	// @param {value} value of query
	var insertParams = function(key, value) {
		// key = encodeURIComponent(key);
		// value = encodeURIComponent(value);

		// [TODO.1] Store Parameter Lists into array from existing URL Path split by '&'
		var currentParamLists = location.search.substr(1).split('&');

		// [TODO.2] Check if location.search is empty or not
		if (currentParamLists == '') {
			// Update History using ?key=value
			history.pushState(
				null,
				null,
				location.pathname + '?' + key + '=' + value
			);
		} else {
			// Update History using format ?search=initial&key=value
			var i = currentParamLists.length;
			var x;

			while (i--) {
				x = currentParamLists[i].split('=');

				if (x[0] == key) {
					x[1] = value;
					currentParamLists[i] = x.join('=');
					break;
				}
			}

			if (i < 0) {
				currentParamLists[currentParamLists.length] = [key, value].join(
					'='
				);
			}

			// document.location.search = currentParamLists.join('&');
			history.pushState(
				null,
				null,
				location.pathname + '?' + currentParamLists.join('&')
			);
		}
	};

	// Function Truncate text
	// ===================================
	var truncateFunction = function(text, max) {
		return text.substr(0, max - 1) + (text.length > max ? '&hellip;' : '');
	};

	var truncateText = function(el, limit) {
		var selector = $(el);
		if (selector.length > 0) {
			selector.each(function() {
				var selfElement = $(this);
				var selfText = selfElement.text();
				var modifiedText = truncateFunction(selfText, limit);

				selfElement.html(modifiedText);
			});
		}
	};

	// Initializations Default State
	// ===================================
	// ===================================

	// Truncate Text Initialize
	// ===================================
	truncateText('.lists__name-basket', 60);
	truncateText('.lists--products .cardview__name', 42);
	truncateText('.carousel--recipe .cardview__name', 62);
	truncateText('.carousel--featured .cardview__name', 27);
	truncateText('.cardview__name', 43);

	// Add Remove Button on Menu Tablet
	// ===================================
	if ($(window).width() < 985) {
		$(
			'<button class="button button--close js-button-close"><i data-feather="x" class="button__icon"></i></button>'
		).appendTo('.navbar__nav');
		feather.replace();
	}

	// Add arrow icon if main navigation has navchild
	// ===================================
	mainNavigationLink.each(function() {
		var _this = $(this);
		if (_this.siblings().length > 0 && $(window).width() >= 958) {
			_this.append('<span class="nav__arrow"></span>');
		}
	});

	// Initialize NICESCROLL
	// ===================================
	var scrollConfig = {
		cursorWidth: '6px',
		cursorcolor: '#009688',
		cursorborder: '0',
		cursoropacitymax: 0.8,
		autohidemode: false
	};

	// $('body').niceScroll(scrollConfig);

	var subNav = $('.subnav');
	if (subNav.length > 0) {
		subNav.niceScroll(scrollConfig);
	}

	var basketView = $('.lists--basket ul');
	if (basketView.length > 0) {
		basketView.niceScroll(scrollConfig);
	}

	var selectLists = $('.selectbox ul');
	if (selectLists.length > 0) {
		selectLists.niceScroll(scrollConfig);
	}

	// Initialize OwlCarousel
	// ===================================
	var productCarousel = $('.js-product-carousel');
	if (productCarousel.length > 0) {
		productCarousel.owlCarousel({
			nav: true,
			navText: [
				'<i class="carousel__icon carousel__icon-prev"></i>',
				'<i class="carousel__icon carousel__icon-next"></i>'
			],
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				},
				1140: {
					items: 2
				}
			}
		});
	}

	var recipeCarousel = $('.js-recipe-carousel');
	if (recipeCarousel.length > 0) {
		recipeCarousel.owlCarousel({
			nav: true,
			navText: [
				'<i class="carousel__icon carousel__icon-prev"></i>',
				'<i class="carousel__icon carousel__icon-next"></i>'
			],
			responsive: {
				0: {
					items: 1
				},
				768: {
					item: 3
				},
				1140: {
					items: 3
				}
			}
		});
	}

	var partnerCarousel = $('.js-partner-carousel');
	if (partnerCarousel.length > 0) {
		partnerCarousel.owlCarousel({
			nav: false,
			autoplayTimeout: 3000,
			responsive: {
				0: {
					items: 3
				},
				768: {
					items: 4
				},
				1140: {
					items: 6
				}
			},
			autoplay: true,
			loop: true,
			dots: false
		});
	}

	// Initialize Zoom Image
	// ===================================
	if (imageProduct.length > 0) {
		// [TODO 1] Find the first thumbnail image
		var firstChildThumbImage = imageProduct.find(
			'.image__thumb:first-child img'
		);

		// [TODO 2] If exists get the filename, else set the default image
		if (firstChildThumbImage.length > 0) {
			firstChildThumbImage = firstChildThumbImage
				.attr('src')
				.split('/')
				.pop();
		} else {
			firstChildThumbImage = 'img-no-product.jpg';
		}

		// [TODO 3] Create New element Image
		var imageFeature = $('<img>');
		imageFeature.addClass('image__feature-item').attr({
			src: './assets/images/catalog/full/' + firstChildThumbImage,
			alt: 'Product Feature'
		});

		// [TODO 4] Append Image into parent and make it zoomable
		$('#zoomableImage')
			.append(imageFeature)
			.zoom();

		// [TODO 5] Set Class Active on first Thumb Image
		imageProduct
			.find('.image__thumb:first-child .image__thumb-item')
			.addClass('active');
	}

	// Initialize Revolution Slider
	// ===================================
	var revslider = $('#rev_slider_fermanto');
	if (revslider.length > 0) {
		revslider.show().revolution({
			delay: 4000,
			sliderLayout: 'auto',
			navigation: {
				arrows: {
					enable: false,
					style: 'hesperiden',
					hide_onleave: false
				},

				bullets: {
					enable: true,
					style: 'hesperiden',
					hide_onleave: false,
					h_align: 'right',
					v_align: 'bottom',
					h_offset: 5,
					v_offset: -30,
					space: 8,
					tmp: '<span class="navigation-custom"><span>'
				}
			}
		});
	}

	// Initialize autoNumeric
	// ===================================
	// $('.auto-numeric').each(function() {
	// 	var number = $(this).text();
	// 	numConversion = addPeriod(number);
	// 	$(this).text('Rp ' + numConversion);
	// });

	// Events Handler
	// ===================================
	// ===================================

	// Button Add To Basket Event
	// ==============================
	var buttonAddBasket = $('.js-add-to-basket');
	if (buttonAddBasket.length > 0) {
		buttonAddBasket.on('click', function() {
			var _thisEl = $(this);
			_thisEl.prop('disabled', true);

			// Calling Loader, indicate processing data
			// ====================================
			// $('.loader').css('display', 'flex');
			// setTimeout(function() {
			// 	$('.loader').addClass('loader--visible');
			// }, 20);

			// Call a Toast
			if (!$('.toast--success').hasClass('toast--visible')) {
				// Showing Loader
				$('.toast--success').css('display', 'block');

				setTimeout(function() {
					$('.toast--success').addClass('toast--visible');
				}, 20);

				// After 3 seconds removing the toast
				timer = setTimeout(function() {
					$('.toast--success.toast--visible')
						.removeClass('toast--visible')
						.one('transitionend', function() {
							$(this).attr('style', '');
						});
					_thisEl.prop('disabled', false);
				}, 3000);
			}
		});
	}

	// Button Hamburger Menu Event
	navbar.on('click', '.button--toggler-menu', function() {
		$('.navbar__nav').addClass('navbar__nav--show');
		$('body')
			.addClass('overflow-hidden')
			.getNiceScroll()
			.remove();
	});

	// Button Close Menu Event
	navbar.on('click', '.js-button-close', function() {
		$(this)
			.parent()
			.removeClass('navbar__nav--show');
		$('body')
			.removeClass('overflow-hidden')
			.getNiceScroll()
			.resize();
	});

	mainNavigationLink.on('click', function(e) {
		if ($(this).siblings().length > 0 && $(window).width() >= 958) {
			e.preventDefault();

			$(this)
				.parent()
				.toggleClass('active');

			// rebuild niceScroll
			$('.subnav')
				.getNiceScroll()
				.resize();
		}
	});

	// Scrollto Event Handler
	if ($('[data-toggle="scrollto"]').length > 0) {
		$('[data-toggle="scrollto"]').on('click', function(e) {
			e.preventDefault();
			var elementTarget = $(this).attr('data-target');
			$('body,html').animate(
				{ scrollTop: $(elementTarget).offset().top },
				500
			);
		});
	}

	// Call Modal Dialog
	if ($('.modal').length > 0) {
		$('[data-toggle="modal"]').on('click', function(e) {
			e.preventDefault();

			var elementTarget = $(this).attr('data-target');

			$(elementTarget).css({
				display: 'block',
				'z-index': '1010'
			});

			setTimeout(function() {
				$(elementTarget).addClass('modal--active');
				$(elementTarget)
					.closest('body')
					.addClass('overflow-hidden');
			}, 20);

			if (basketView.length > 0) {
				basketView.getNiceScroll().resize();
			}
		});

		$('[data-dismiss="modal"]').on('click', function(e) {
			e.preventDefault();

			$(this)
				.closest('.modal')
				.removeClass('modal--active')
				.one('transitionend', function() {
					$(this).attr('style', '');
				});

			setTimeout(function() {
				$('body').removeClass('overflow-hidden');
			}, 400);
		});
	}

	// Call Toast Notification
	var toast = $('.toast');
	if (toast.length > 0) {
		$('[data-dismiss="toast"]').on('click', function() {
			$(this)
				.closest('.toast')
				.removeClass('toast--visible')
				.one('transitionend', function() {
					$(this).attr('style', '');
				});
			clearTimeout(timer);
			$('.js-add-to-basket').prop('disabled', false);
		});
	}

	// Selectbox Click handler
	// ===================================
	selectbox.on('click', '.selectbox__header', function() {
		var _elTarget = $(this);
		if (!_elTarget.closest('.selectbox').hasClass('selectbox--is-open')) {
			_elTarget.siblings('.selectbox__body').css('display', 'block');

			setTimeout(function() {
				_elTarget.closest('.selectbox').addClass('selectbox--is-open');
				selectLists.getNiceScroll().resize();
			}, 20);
		} else {
			_elTarget
				.closest('.selectbox')
				.removeClass('selectbox--is-open')
				.one('transitionend', function() {
					$(this)
						.find('.selectbox__body')
						.attr('style', '');
				});
		}
	});

	selectbox.on('click', '.selectbox__body span', function(e) {
		var queryName = e.target.getAttribute('data-name');
		var selectedName = e.target.innerText;
		//console.log(e);

		$(this)
			.closest('.selectbox')
			.find('.selectbox__text')
			.html(selectedName);

		$('.selectbox.selectbox--is-open')
			.removeClass('selectbox--is-open')
			.one('transitionend', function() {
				$('.selectbox__body').attr('style', '');
			});

		$('.selectbox__body li').removeClass('active');
		$(this)
			.parent()
			.addClass('active');

		// Update queryString without reload browser
		// @param {object} state
		// @param {string} title:optional
		// @param {string} url
		history.pushState(null, 'brands', '?brands=' + queryName);

		//document.location.search = '?brands=' + queryName;
	});

	// Select category Click handler
	// ===================================
	selectCat.on('click', '.select-category__header', function(e) {
		var _thisEl = $(this);
		if (
			!_thisEl
				.closest('.select-category')
				.hasClass('select-category--is-open')
		) {
			$('.select-category__body').css('display', 'block');
			setTimeout(function() {
				_thisEl
					.closest('.select-category')
					.addClass('select-category--is-open');
			}, 20);
		} else {
			console.log('test');
			_thisEl
				.closest('.select-category')
				.removeClass('select-category--is-open')
				.one('transitionend', function() {
					$(this)
						.find('.select-category__body')
						.attr('style', '');
				});
		}
	});

	imageProduct.on('click', '.image__thumb-item', function() {
		var thumbFilename = $(this)
			.find('img')
			.attr('src')
			.split('/')
			.pop();

		$('.image__thumb-item').removeClass('active');
		$(this).addClass('active');

		$(this)
			.closest('.image--zoomlist')
			.find('#zoomableImage img')
			.attr('src', './assets/images/catalog/full/' + thumbFilename);

		setTimeout(function() {
			$('#zoomableImage')
				.trigger('zoom.destroy')
				.zoom();
		}, 20);
	});

	/////////////////////////////////
	// Manage Category Filter
	////////////////////////////////

	// create empty array as container
	var categoryArray = [];

	$('.select-category__check').each(function() {
		$(this).on('change', function() {
			var checkValue = $(this).val();

			if ($(this).is(':checked')) {
				// store checked box into array
				categoryArray.push(checkValue);
			} else {
				// get the index of selected box in the updated array
				var removedList = categoryArray.indexOf(checkValue);

				// takeout the checked box in the array
				if (removedList !== -1) {
					categoryArray.splice(removedList, 1);
				}
			}

			var q = categoryArray.join(',').replace(/\s/g, '+');
			// console.log(categoryArray);

			addCategoryIntoTag(categoryArray);

			// Calling Function Adding Parameter on Existing URL
			insertParams('category', q);
		});
	});

	// Cancels if document click or press Key Escape
	// -----------------------------------------------------------
	$(document).on('click', function(e) {
		// Cancel active class on Our Brands Menu
		if (!$(e.target).closest('.nav').length) {
			$('.nav__item').removeClass('active');
		}

		// Cancel Modal Active on Basket Modal
		// if (
		// 	!$(e.target).closest(
		// 		'.modal__dialog, .button--basket, .nav, [data-toggle="modal"]'
		// 	).length
		// ) {
		// 	$('.modal.modal--active')
		// 		.removeClass('modal--active')
		// 		.one('transitionend', function() {
		// 			$(this).attr('style', '');
		// 			$(this)
		// 				.closest('body')
		// 				.removeClass('overflow-hidden');
		// 		});
		// 	// $('body').removeClass('overflow-hidden');
		// }

		// Cancel select-category
		if (!$(e.target).closest('.select-category').length) {
			$('.select-category.select-category--is-open')
				.removeClass('select-category--is-open')
				.one('transitionend', function() {
					$(this)
						.find('.select-category__body')
						.attr('style', '');
				});
		}

		// Cancel selectbox
		if (!$(e.target).closest('.selectbox').length) {
			$('.selectbox.selectbox--is-open')
				.removeClass('selectbox--is-open')
				.one('transitionend', function() {
					$(this)
						.find('.selectbox__body')
						.attr('style', '');
				});
		}

		// Cancel if User press 'Esc' Key
		// if (e.keyCode == 27) {
		// 	$('.nav__item').removeClass('active');
		// 	if ($('.modal').hasClass('modal--active')) {
		// 		$('.modal')
		// 			.removeClass('modal--active')
		// 			.one('transitionend', function() {
		// 				$(this).attr('style', '');
		// 				$(this)
		// 					.closest('body')
		// 					.removeClass('overflow-hidden');
		// 			});
		// 	}
		// }
	});
});
