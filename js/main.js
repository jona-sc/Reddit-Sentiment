var allComments = [];
var positiveComments = [];
var negativeComments = [];
var neutralComments = [];
var comment = {};

function getComments(subredditName) {
	var url = 'http://api.reddit.com/r/' + subredditName + '/comments';
	$.getJSON(url, function (body) {
		console.log(body)
		$('.positive.feed').html('');
		body.data.children.forEach(function (post) {
			var body = post.data.body;
			comment = {
				body: body

			}
			allComments.push(comment)
			// console.log(allComments)
		})
	});
}

function analyseComments(commentArray) {
		commentArray.forEach(function (thisComment) {
		$.ajax({
			url: 'https://loudelement-free-natural-language-processing-service.p.mashape.com/nlp-text/',
			type: 'GET',
			data: {text: thisComment.body},
			datatype: 'json',
			success: function(data) {
				var score = data["sentiment-score"]
				var sentiment = data["sentiment-text"]
				thisComment.score = score
				thisComment.sentiment = sentiment
			},
			beforeSend: function (xhr) {
				 xhr.setRequestHeader("X-Mashape-Authorization", "NIUtQInc7Wmsh59dMi6mveiUMHc1p1QzTBVjsndtfMs1yrPTuf");
			},
		})
	})
}

function splitComments() {
	allComments.forEach(function (thisComment) {
		console.log(thisComment)
		if(thisComment.sentiment='positive') {
			positiveComments.push(thisComment)
		} else if(thisComment.sentiment='negative') {
			negativeComments.push(thisComment)
		} else if(thisComment.sentiment='neutral') {
			neutralComments.push(thisComment)
		} else {console.log('didnt work')}
	})
}

function minifyHeader() {
		var hash = location.hash
		if(hash == '#2' | hash == '#3' | hash == '#4') {
			$('header').addClass('mini')
			$('#search_title').html('test')
			$('#search_title').show
		} else {
			$('header').removeClass('mini')
			$('#search_title').hide
		}
	}

window.onhashchange = function() {
	minifyHeader();
};


$(document).ready(function() {
	// Load full page jquery plugin
	$('#fullpage').fullpage();

	// On form subit, execute function using query
		$('#search_form').on('submit', function(e) {
		e.preventDefault();
		var subredditToShow = $('#search-term').val();
		getComments(subredditToShow);
		analyseComments(allComments);
		splitComments();
		console.log(positiveComments)
		console.log(negativeComments)
		console.log(neutralComments)
	});

	
	minifyHeader();
	
	

});