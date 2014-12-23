//////////////////////
// Global Variables //
//////////////////////

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
var subredditToShow = "";

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
		fillColor : "rgba(255, 255, 255, 0.2)",
		strokeColor : "rgba(220,220,220,0.8)",
		highlightFill: "rgba(255, 255, 255, 0.15)",
		highlightStroke: "rgba(220,220,220,1)",
		data : [0, 0, 0]
	}
	]

}

///////////////////////////////////
// Retrieve and Analyse Comments //
///////////////////////////////////

// Get the comment body of the 25 most recent comments from the enterred subreddit and push them to allComments[]
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

// Run each comment in allComments[] through the sentiment API and turn it into an object with sentiment and score value. 
// Then push positive, negative and neutral comments into their respective array.
function analyseComments(commentArray) {
	commentArray.forEach(function (thisComment) {
		$.ajax({
			url: 'https://loudelement-free-natural-language-processing-service.p.mashape.com/nlp-text/',
			type: 'GET',
			data: {text: thisComment.body},
			datatype: 'json',
			success: function(data) {
				var score = Math.round(data["sentiment-score"] * 100)
				console.log(score)
				var sentiment = data["sentiment-text"]
				thisComment.score = score.toString().replace(/-/g, '');
				thisComment.sentiment = sentiment
				if(thisComment.sentiment=='positive') {
					$('.positive .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive' + ' ' + thisComment.score + ' ' + '"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative"></div></div></li>');
					$('.' + thisComment.score).css("width", thisComment.score + '%')
					positiveComments.push(thisComment);
				} else if(thisComment.sentiment=='negative') {
					$('.negative .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative' + ' ' + thisComment.score + ' ' + '"></div></div></li>');
					$('.' + thisComment.score).css("width", thisComment.score + '%')
					negativeComments.push(thisComment);
				} else if(thisComment.sentiment=='neutral') {
					$('.neutral .feed ul').append('<li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative"></div></div></li>');
					// $('.' + thisComment.score).css("width", thisComment.score + '%')
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

// Set variables as the number of objects in the positive, negative and neutral arrays then sends those values to the chart data. 
function getGraphs() {
	numPositive = positiveComments.length
	numNegative = negativeComments.length
	numNeutral = neutralComments.length
	totalComments = numPositive += numNeutral += numNegative;
	if(totalComments == 25) {
		console.log(totalComments)
		$('#reddit-loading').hide()
		pieData[0].value = Math.round((positiveComments.length / 25 * 100))
		pieData[1].value = Math.round((negativeComments.length / 25 * 100))
		pieData[2].value = Math.round((neutralComments.length / 25 * 100))
		barChartData.datasets[0].data[0] = positiveComments.length
		barChartData.datasets[0].data[1] = neutralComments.length
		barChartData.datasets[0].data[2] = negativeComments.length
		console.log(pieData)
		console.log(barChartData)
		drawGraphs()
	} 
}

// Draw a pie and bar chart using the chart data 
function drawGraphs() {
	var ctx1 = document.getElementById("pie-chart").getContext("2d");
	myPie = new Chart(ctx1).Doughnut(pieData, {
		animationSteps : 80,
		animationEasing : "easeOutQuad",
		responsive: true,
		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
	});
	var ctx2 = document.getElementById("bar-chart").getContext("2d");
	myBar = new Chart(ctx2).Bar(barChartData, {
		responsive : true
	});
}


//////////////////
// Extra Things //
//////////////////

// Make the header smaller on sliders 2, 3 & 4
function minifyHeader() {
	var hash = location.hash
	if(hash == '#2' | hash == '#3' | hash == '#4') {
		$('header').addClass('mini')
		$('#search_title').html('/r/' + subredditToShow)
		$('#search_title').show
	} else {
		$('header').removeClass('mini')
		$('#search_title').html('')
		$('#search_title').hide
		if (typeof myPie !== 'undefined') {
			myPie.destroy()
			myBar.destroy()
			myPie.destroy()
		} 
	}
}

// Call minifyHeader() when the '#' element in the URL changes
window.onhashchange = function() {
	minifyHeader();
};

// Pull the current top 25 subreddits using the Reddit API and print them to the page as radio buttons in a form
function getSubreddits() {
	var url = 'http://api.reddit.com/reddits';
	$.getJSON(url, function (body) {
		body.data.children.forEach(function (post) {
			var subreddit = post.data.display_name;
			allSubReddits.push(subreddit)
			$('#reddit-form').append('<input type="radio" class="subredditradio" id="' + subreddit +'" name="subreddit" value="' + subreddit + '"><label for="' + subreddit +'">' + subreddit + '</label>')
		});
		console.log(allSubReddits)
		localStorage.setItem('subreddit', JSON.stringify(allSubReddits));
	}); 
}

// Check for subreddits in localStorage and print them to page. If not in localStorage, getSubReddits()
function checkForLocalStorage() {
	if(typeof(localStorage)=='undefined'){
		getSubreddits()
	} else {
		if (localStorage.getItem('subreddit')) {
			var allSubReddits = (JSON.parse(localStorage.getItem('subreddit')))
			allSubReddits.forEach(function (post) {
				var subreddit = post
				$('#reddit-form').append('<input type="radio" class="subredditradio" id="' + subreddit +'" name="subreddit" value="' + subreddit + '"><label for="' + subreddit +'">' + subreddit + '</label>')
			})
		} else {
			getSubreddits()
		}
	}
}

////////////////////
// Document Ready //
////////////////////

$(document).ready(function() {
	$('#fullpage').fullpage();
	minifyHeader();
	checkForLocalStorage();
	$('#reddit-list').hide()
	if (allComments.length == 0) {
		$('#reddit-loading').hide()
		$('.oops').show()
		$('.showwithgraphs').hide()
	} else {
		$('.oops').hide()
		$('.showwithgraphs').show()
	}

	// On form subit, execute getComments()
	$('#search_form').on('submit', function(e) {
		e.preventDefault();
		$('#reddit-loading').show()
		$('.oops').hide()
		$('.showwithgraphs').show()
		subredditToShow = $('#search-term').val();
		getComments(subredditToShow);
		window.location = 'index.html#2'
	});

	// On selecting a radio button, execute getComments()
	$( "#reddit-form" ).change(function(form,name) {
		subredditToShow = $('input[name="subreddit"]:checked', '#reddit-form').val();
		getComments(subredditToShow);
		$('#reddit-loading').show()
		$('.oops').hide()
		$('.showwithgraphs').show()
		window.location = 'index.html#2'
	});	
});





