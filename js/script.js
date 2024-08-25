/*jshint jquery:true */

$(document).ready(function($) {
	"use strict";

	/* global google: false */
	/*jshint -W018 */
		
	/*-------------------------------------------------*/
	/* = datepicker
	/*-------------------------------------------------*/

	try{

		$( "#date" ).datepicker();

	} catch(err) {
	}
	
	/*-------------------------------------------------*/
	/* =  OWL carousell
	/*-------------------------------------------------*/
	try {
		var owlWrap = $('.owl-wrapper');

		if (owlWrap.length > 0) {

			if (jQuery().owlCarousel) {
				owlWrap.each(function(){

					var carousel= $(this).find('.owl-carousel'),
						dataNum = $(this).find('.owl-carousel').attr('data-num'),
						dataNum2,
						dataNum3;

					if ( dataNum == 1 ) {
						dataNum2 = 1;
						dataNum3 = 1;
					} else if ( dataNum == 2 ) {
						dataNum2 = 2;
						dataNum3 = dataNum - 1;
					} else {
						dataNum2 = dataNum - 1;
						dataNum3 = dataNum - 2;
					}

					carousel.owlCarousel({
						autoPlay: 24000,
						navigation : true,
						items : dataNum,
						itemsDesktop : [1199,dataNum2],
						itemsDesktopSmall : [991,dataNum3],
						itemsTablet : [768, dataNum3],
					});

				});
			}
		}

	} catch(err) {

	}
	
	/* ---------------------------------------------------------------------- */
	/*	Contact Map
	/* ---------------------------------------------------------------------- */

	try {
		var fenway = [42.345573,-71.098326]; //Change a map coordinate here!
		var markerPosition = [42.345573,-71.098326]; //Change a map marker here!
    	$('#map')
			.gmap3({
				center:fenway,
				zoom: 13,
				mapTypeId: "shadeOfGrey", // to select it directly
				scrollwheel: false,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, "shadeOfGrey"]
				}
			})
			.styledmaptype(
			"shadeOfGrey",
			[
				{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":60}]},
				{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":86}]},
				{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
				{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":90}]},
				{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":87},{"weight":1.2}]},
				{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":90}]},
				{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":91}]},
				{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":87}]},
				{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":99},{"weight":0.2}]},
				{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":88}]},
				{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":86}]},
				{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":79}]},
				{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":87}]}
			],
			{name: "Shades of Grey"});
			$('#map')
				.gmap3({
					center: fenway,
					zoom: 13,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				})
				.marker({
					position: markerPosition,
					icon: 'images/marker.png'
			});
	} catch(err) {

	}

	/*-------------------------------------------------*/
	/* =  flexslider
	/*-------------------------------------------------*/

	try {

		var SliderPost = $('.flexslider');

		SliderPost.flexslider({
			slideshowSpeed: 10000,
			easing: "swing"
		});
	} catch(err) {

	}

	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	function validateEmail(email) {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	function validate(){
		const name = document.getElementById("name").value ?? ''
		const email = document.getElementById("mail").value ?? ''
		const comments = document.getElementById("comment").value ?? ''

		if(name.trim().length == 0 || !validateEmail(email)|| comments.trim().length == 0){
			$('#msg').removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html("Los campos de Email y Nombre son requeridos.").fadeIn('slow').delay(5000).fadeOut('slow');
			return false
		}
		return { name, email, comments }
	}

	var submitContact = $('#submit_contact'),
		submitReservation = $('#submit_reservation'),
		message = $('#msg');

	submitContact.on('click', function(e){
		e.preventDefault();

		var $this = $(this);

		const val = validate()
		if(!val) return;

		const dataObj = {
			...val,
			website: document.getElementById("website").value,
			subject: document.getElementById("subject").value,
			type: "CONTACT"
		}
		
		$.ajax({
			type: "POST",
			url: './.netlify/functions/mail',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(dataObj),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text],textarea,select').filter(':visible').val('');
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-success').html("Tu mensaje ha sido enviado. Gracias!").fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

	function validateReservation(){
		const name = document.getElementById("name").value ?? ''
		const email = document.getElementById("mail").value ?? ''
		const date = document.getElementById("date").value ?? ''
		const time = document.getElementById("time").value ?? ''
		const guests = document.getElementById("guests").value ?? ''
		const phone = document.getElementById("phone-number").value ?? ''

		if(name.trim().length == 0 || !validateEmail(email)|| date.trim().length == 0){
			$('#msg').removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html("Todos los campos son requeridos.").fadeIn('slow').delay(5000).fadeOut('slow');
			return false
		}

		if(time.trim().length == 0 || guests.trim().length == 0|| phone.trim().length == 0){
			$('#msg').removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html("Todos los campos son requeridos.").fadeIn('slow').delay(5000).fadeOut('slow');
			return false
		}
		return { name, email, date, time, guests, phone }
	}

	submitReservation.on('click', function(e){
		e.preventDefault();

		var $this = $(this);

		const val = validateReservation()
		if(!val) return;

		const dataObj = {
			...val,
			type: "RESERVATION"
		}
		
		$.ajax({
			type: "POST",
			url: './.netlify/functions/mail',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(dataObj),
			success: function(data) {

				if(data.info !== 'error'){
					$this.parents('form').find('input[type=text]').filter(':visible').val('');
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-success').html("Tu resevación ha sido enviado. Gracias!").fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

	/* ---------------------------------------------------------------------- */
	/*	Header animate after scroll
	/* ---------------------------------------------------------------------- */

	(function() {

		var docElem = document.documentElement,
			didScroll = false,
			changeHeaderOn = 70;
			document.querySelector( 'header, a.go-top' );
		function init() {
			window.addEventListener( 'scroll', function() {
				if( !didScroll ) {
					didScroll = true;
					setTimeout( scrollPage, 100 );
				}
			}, false );
		}
		
		function scrollPage() {
			var sy = scrollY();
			if ( sy >= changeHeaderOn ) {
				$( 'header' ).addClass('active');
				$( 'a.go-top' ).addClass('active');
			}
			else {
				$( 'header' ).removeClass('active');
				$( 'a.go-top' ).removeClass('active');
			}
			didScroll = false;
		}
		
		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}
		
		init();
		
	})();

});
