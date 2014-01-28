$(window).load(function(){
	$('.outer-spinner').hide();
	$('#wait').hide();
	$('#layout').show();
});

$(document).ready(function() {

	$("button.close").click(function(){
		$(this).parent().parent().remove();
	});


	$(document).on('click', '.modal-close', function(event){ 
		console.log('modal-close');
		event.preventDefault(); 
		$('.modal').slideUp(); 
	});

	$('.modal-toggle').click(function(event){


		event.preventDefault(); 

		var tocall = $(this).attr('href');
		console.log(tocall);

		$.ajax({
			url: tocall,
		}).success(function( data ) {
			console.log(data);
			$('.inner-modal').html(data);
			$('.modal').slideDown();
		}).error(function(data){
			$('.inner-modal').html('<span class"pure-badge pure-badge-warning>Can\'t load form. Please try again</span>"');
			$('.modal').slideDown();
			console.log(data);
		});
	});
});