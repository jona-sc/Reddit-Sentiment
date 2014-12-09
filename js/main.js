var allComments = [];
var positiveComments = [];
var negativeComments = [];
var neutralComments = [];
var allSubReddits = []
var comment = {};

function getComments(subredditName) {
	var url = 'http://api.reddit.com/r/' + subredditName + '/comments';
	$.getJSON(url, function (body) {
		allComments = [];
		positiveComments = [];
		negativeComments = [];
		neutralComments = [];
		comment = {};
		$('.positive .feed ul').html('');
		$('.negative .feed ul').html('');
		$('.neutral .feed ul').html('');
		body.data.children.forEach(function (post) {
			var body = post.data.body;
			comment = {
				body: body
			}
			allComments.push(comment)
		});
		analyseComments(allComments);
	}); 
}

function analyseComments(commentArray) {
	commentArray.forEach(function (thisComment) {
		$.ajax({
			url: 'https://loudelement-free-natural-language-processing-service.p.mashape.com/nlp-text/',
			type: 'GET',
			data: {text: thisComment.body},
			datatype: 'json',
			// async: false,
			success: function(data) {
				var score = Math.round(data["sentiment-score"] * 100) + '%'
				var sentiment = data["sentiment-text"]
				thisComment.score = score
				thisComment.sentiment = sentiment
				if(thisComment.sentiment=='positive') {
					$('.positive .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="entrydetails">' + thisComment.sentiment + '</div><div class="entrydetails">' + thisComment.score + '</div></li>');
					positiveComments.push(thisComment);
				} else if(thisComment.sentiment=='negative') {
					$('.negative .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="entrydetails">' + thisComment.sentiment + '</div><div class="entrydetails">' + thisComment.score + '</div></li>');
					negativeComments.push(thisComment);
				} else if(thisComment.sentiment=='neutral') {
					$('.neutral .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="entrydetails">' + thisComment.sentiment + '</div><div class="entrydetails">' + thisComment.score + '</div></li>');
					neutralComments.push(thisComment);
				} else {
					console.log('didnt work on', thisComment);
				}
			}, 
			beforeSend: function (xhr) {
				 xhr.setRequestHeader("X-Mashape-Authorization", "NIUtQInc7Wmsh59dMi6mveiUMHc1p1QzTBVjsndtfMs1yrPTuf");
			} 
		});
	}); 
};

// function getSubreddits() {
// 	var url = 'http://api.reddit.com/reddits';
// 	$.getJSON(url, function (body) {
// 		body.data.children.forEach(function (post) {
// 			var subreddit = post.data.display_name;
// 			allSubReddits.push(subreddit)
// 			console.log(allSubReddits)
// 		});
// 	});
// }

function graphs() {
	var numPositive = positiveComments.length;
	var numNegative = negativeComments.length;
	var numNeutral = neutralComments.length;
	var totalComments = numPositive += numNeutral += numNegative;
	console.log(totalComments)
}



function minifyHeader() {
		var hash = location.hash
		if(hash == '#2' | hash == '#3' | hash == '#4') {
			$('header').addClass('mini')
			$('#search_title').html('/r/' + $('#search-term').val())
			$('#search_title').show
		} else {
			$('header').removeClass('mini')
			$('#search_title').html('')
			$('#search_title').hide
		}
	}

window.onhashchange = function() {
	minifyHeader();
};

$(document).ready(function() {
	$('#fullpage').fullpage();
	minifyHeader();


	// On form subit, execute function using query
	$('#search_form').on('submit', function(e) {
		e.preventDefault();
		var subredditToShow = $('#search-term').val();
		getComments(subredditToShow);
		window.location = 'index.html#2'
	});
});
