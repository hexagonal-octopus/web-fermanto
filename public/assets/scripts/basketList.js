// Prevent Doube-tap-To-Zoom == IIFE
(function($) {
	$.fn.nodoubletapzoom = function() {
		$(this).bind('touchstart', function preventZoom(e) {
			var t2 = e.timeStamp,
				t1 = $(this).data('lastTouch') || t2,
				dt = t2 - t1,
				fingers = e.originalEvent.touches.length;
			$(this).data('lastTouch', t2);
			if (!dt || dt > 500 || fingers > 1) return; // not double-tap

			e.preventDefault(); // double tap - prevent the zoom
			// also synthesize click events we just swallowed up
			$(this)
				.trigger('click')
				.trigger('click');
		});
	};
})(jQuery);

$(function() {
	// Global Variables
	// ===================================
	var currencyOptions = {
		alias: 'currency',
		prefix: 'Rp ',
		groupSeparator: '.',
		digits: '0',
		allowMinus: false,
		autoUnmask: true,
		rightAlign: false
	};
	var tableSubTotal = $('.table__subtotal');
	var tableNettTotal = $('.table__netttotal');
	var tableGrandTotal = $('.table__grandtotal');

	// Make Array from available tabel subtotal
	var tableSubTotalArr = $.makeArray(tableSubTotal);

	// InputMask Init
	// ===================================
	if ($('.mask-currency').length > 0) {
		$('.mask-currency').inputmask(currencyOptions);
	}

	// Check autoUnmask
	// $('.mask-currency').each(function() {
	// 	console.log($(this).val());
	// });

	// Function Trigger Modal Confirm
	// ===================================
	var confirmModal = function(callback) {
		// Activated Modal Confirmation
		$('#modalConfirmAlert').css({
			display: 'block',
			'z-index': '1010'
		});

		setTimeout(function() {
			$('#modalConfirmAlert').addClass('modal--active');
		}, 20);

		// Get the callback function with argument = true after click event
		// Dismiss Modal
		$('#buttonConfirmed').on('click', function() {
			callback(true);
			$(this)
				.closest('.modal')
				.removeClass('modal--active')
				.one('transitionend', function() {
					$(this).attr('style', '');
				});
		});
	};

	// Function Calculate Subtotal
	// =======================================================
	var subTotalCalculation = function(price, qty, subtotal) {
		var calculatePrice = price.val() * qty.val();
		subtotal.val(calculatePrice).inputmask(currencyOptions);
	};

	// Function Calculate Sum Subtotal
	// =======================================================
	var sumTotalCalculation = function(arr) {
		var sum = arr.reduce(function(sum, element) {
			return sum + Number(element.value);
		}, 0);
		// console.log(sum);

		tableNettTotal.val(sum).inputmask(currencyOptions);
		tableGrandTotal.val(sum).inputmask(currencyOptions);
	};

	// Inital State Calculate each SubTotal
	// ======================================
	if (tableSubTotal.length > 0) {
		tableSubTotal.each(function() {
			var inputQty = $(this)
				.closest('.table__row')
				.find('.input--qty');
			var basePrice = $(this)
				.closest('.table__row')
				.find('.table__base-price');
			subTotalCalculation(basePrice, inputQty, $(this));
		});

		sumTotalCalculation(tableSubTotalArr);
	}

	// Event Handler
	// ======================================

	// Increment and Decrements Value Input
	$('.button--icon-decrement').on('click', function(e) {
		e.preventDefault();
		var inputQty = $(this)
			.parent()
			.find('.input--qty');
		var subTotal = $(this)
			.closest('.table__row')
			.find('.table__subtotal');
		var basePrice = $(this)
			.closest('.table__row')
			.find('.table__base-price');
		var currentValue = parseInt(inputQty.val());

		if (currentValue > 1) {
			currentValue--;
			inputQty.val(currentValue);
		} else {
			inputQty.val(1);
		}

		subTotalCalculation(basePrice, inputQty, subTotal);
		sumTotalCalculation(tableSubTotalArr);
	});

	$('.button--icon-increment').on('click', function(e) {
		e.preventDefault();
		var inputQty = $(this)
			.parent()
			.find('.input--qty');
		var subTotal = $(this)
			.closest('.table__row')
			.find('.table__subtotal');
		var basePrice = $(this)
			.closest('.table__row')
			.find('.table__base-price');
		var currentValue = parseInt(inputQty.val());

		if (currentValue < 9999) {
			currentValue++;
			inputQty.val(currentValue);
		} else {
			inputQty.val(9999);
		}

		subTotalCalculation(basePrice, inputQty, subTotal);
		sumTotalCalculation(tableSubTotalArr);
	});

	// Quantity On Change
	$('.input--qty').on('change', function() {
		var value = $(this).val();
		var maxLength = 4;
		var _this = $(this);
		var regex = /^[0-9]+$/;
		var inputQty = $(this)
			.parent()
			.find('.input--qty');
		var subTotal = $(this)
			.closest('.table__row')
			.find('.table__subtotal');
		var basePrice = $(this)
			.closest('.table__row')
			.find('.table__base-price');

		if (value && value.length > maxLength) {
			alert('Input Number Exceeded, Max Quantity is 9999');
			_this.val(value.substr(0, maxLength));
		}

		if (!value.match(regex)) {
			alert('Must Input Numbers');

			$(this).val(1);
		}

		subTotalCalculation(basePrice, inputQty, subTotal);
		sumTotalCalculation(tableSubTotalArr);
	});

	// Button Delete Basket List Item
	// ===================================
	$('.js-button-delete').on('click', function() {
		var _this = $(this);
		confirmModal(function(confirm) {
			if (confirm) {
				_this.closest('.table__row').remove();

				// removing selected item from Table subtotal array using splice method
				var thisSubTotal = _this
					.closest('.table__row')
					.find('.table__subtotal.mask-currency')[0];

				var removedItem = tableSubTotalArr.indexOf(thisSubTotal);
				if (removedItem !== -1) {
					tableSubTotalArr.splice(removedItem, 1);
				}

				// Get the updated subtotal array
				var updatedTableSubTotalArr = tableSubTotalArr;

				sumTotalCalculation(updatedTableSubTotalArr);
			}
		});
	});
});
