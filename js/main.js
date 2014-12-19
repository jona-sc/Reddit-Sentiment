var allComments = [];
var positiveComments = [];
var negativeComments = [];
var neutralComments = [];
var allSubReddits = []
var comment = {};
var numPositive = 0;
var numNegative = 0;
var numNeutral = 0;
var totalComments = 0;

//////////////////
// Graph Inputs //
//////////////////

var pieData = [
				{
					value: 0,
					color:"#5ACA74",
					highlight: "#6FD387",
					label: "Positive"
				},
				{
					value: 0,
					color: "#E45757",
					highlight: "#E56D6D",
					label: "Negative"
				},
				{
					value: 0,
					color: "#9BC5CF",
					highlight: "#B5D5DD",
					label: "Neutral"
				},
					

			];

var barChartData = {
		labels : ["Postive","Neutral","Negative"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.8)",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "rgba(220,220,220,0.75)",
				highlightStroke: "rgba(220,220,220,1)",
				data : [0, 0, 0]
			}
		]

	}

///////////////////////////////////
// Retrieve and Analyse Comments //
///////////////////////////////////

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
				getGraphs()
			}, 
			beforeSend: function (xhr) {
				 xhr.setRequestHeader("X-Mashape-Authorization", "NIUtQInc7Wmsh59dMi6mveiUMHc1p1QzTBVjsndtfMs1yrPTuf");
			} 
		}); 
	}); 
};

//////////////////
// Build Graphs //
//////////////////

function getGraphs() {
		numPositive = positiveComments.length
		numNegative = negativeComments.length
		numNeutral = neutralComments.length
		totalComments = numPositive += numNeutral += numNegative;
		if(totalComments == 25) {
			console.log(totalComments)
			$('#reddit-loading').hide()
			pieData[0].value = positiveComments.length
			pieData[1].value = negativeComments.length
			pieData[2].value = neutralComments.length
			barChartData.datasets[0].data[0] = positiveComments.length
			barChartData.datasets[0].data[1] = neutralComments.length
			barChartData.datasets[0].data[2] = negativeComments.length
			console.log(pieData)
			console.log(barChartData)
			drawGraphs()
		} 
}

function drawGraphs() {
	var ctx1 = document.getElementById("pie-chart").getContext("2d");
	window.myPie = new Chart(ctx1).Pie(pieData, {
		 animationSteps : 80,
		 animationEasing : "easeOutQuart",
		 responsive: true,
	});
	var ctx2 = document.getElementById("bar-chart").getContext("2d");
	window.myBar = new Chart(ctx2).Bar(barChartData, {
			responsive : true
		});
}


//////////////////
// Extra Things //
//////////////////

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



$(document).ready(function() {
	$('#fullpage').fullpage();
	minifyHeader();
	if (allComments.length == 0) {
		$('#reddit-loading').hide()
	}

	// On form subit, execute function
	$('#search_form').on('submit', function(e) {
		e.preventDefault();
		$('#reddit-loading').show()
		var subredditToShow = $('#search-term').val();
		getComments(subredditToShow);
		window.location = 'index.html#2'
	});
});





		