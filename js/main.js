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
var query = window.location.search.substring(1).split("?");

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
			var link_url = post.data.link_url;
			var commentID = post.data.id;
			var threadID = (post.data.link_id).replace("t3_", "");
			function checkURL() {
				if(link_url.search('reddit.com') != -1) {
					link_url = link_url + commentID
				} else {
					link_url = url.replace("api", "www")
					link_url = link_url + '/' + threadID
				}
			} 
			checkURL()
			var id = post.data.id;
			comment = {
				body: body,
				url: link_url,
				id: id
			}
			allComments.push(comment)
		});
		analyseComments(allComments);
	}) 
	.error(function() { nothingHere() })
}

// Run each comment in allComments[] through the sentiment API and turn it into an object with sentiment and score value. 
// Then push positive, negative and neutral comments into their respective array.
function analyseComments(commentArray) {
	commentArray.forEach(function (thisComment) {
		$.ajax({
			url: 'https://community-sentiment.p.mashape.com/text/',
			type: 'POST',
			data: {txt: thisComment.body},
			datatype: 'json',
			success: function(data) {
				var score = Math.round(data.result.confidence)
				var sentiment = data.result.sentiment
				thisComment.score = score.toString().replace(/-/g, '');
				thisComment.sentiment = sentiment
				if(thisComment.sentiment=='Positive') {
					$('.positive .feed ul').append('<a href="' + thisComment.url + '" target="_blank"><li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive bar' + ' ' + thisComment.score + ' ' + '"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative bar"></div></div></li></a>');
					$('.' + thisComment.score).css("width", + thisComment.score + '%')
					positiveComments.push(thisComment);
				} else if(thisComment.sentiment=='Negative') {
					$('.negative .feed ul').append('<a href="' + thisComment.url + '" target="_blank"><li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive bar"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative bar' + ' ' + thisComment.score + ' ' + '"></div></div></li></a>');
					$('.' + thisComment.score).css("width", thisComment.score + '%')
					negativeComments.push(thisComment);
				} else if(thisComment.sentiment=='Neutral') {
					$('.neutral .feed ul').append('<a href="' + thisComment.url + '" target="_blank"><li class="entry"><h3>' + thisComment.body + '</h3><div class="scaletext left">-</div><div class="scaletext right">+</div><div class="sentimentscale positive container cf"><div class="sentimentscale positive bar"></div></div><div class="sentimentscale negative container cf"><div class="sentimentscale negative bar"></div></div></li></a>');
					// $('.' + thisComment.score).css("width", thisComment.score + '%')
					neutralComments.push(thisComment);
				} else {
					console.log('didnt work on', thisComment);
				}
				getGraphs()
			}, 
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-Key", "1HGfSyYO3rmsh9oYsJtYWzWBxQTQp1UJZSXjsnMMWoXulZ87iu");
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
		$('#reddit-loading').hide()
		pieData[0].value = Math.round((positiveComments.length / 25 * 100))
		pieData[1].value = Math.round((negativeComments.length / 25 * 100))
		pieData[2].value = Math.round((neutralComments.length / 25 * 100))
		barChartData.datasets[0].data[0] = positiveComments.length
		barChartData.datasets[0].data[1] = neutralComments.length
		barChartData.datasets[0].data[2] = negativeComments.length
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

function nothingHere() {
	$('#reddit-loading').hide()
	$('.oops').show()
	$('.showwithgraphs').hide()
	$('#results_breakdown .split').hide()
}

function somethingHere() {
	$('#reddit-loading').show()
	$('.oops').hide()
	$('.showwithgraphs').show()
	$('#results_breakdown .split').show()
}

// Animate the positive/negative scale when you arrive on page #3
function animateScales() {
	var hash = location.hash	
	if (hash =='#3') {
		$('.bar').addClass('zero')
		setTimeout(function() {
			$('.bar').removeClass('zero')
		}, 1000)
	}
}

// Call minifyHeader() and animateScales() when the '#' element in the URL changes
window.onhashchange = function() {
	minifyHeader();
	animateScales();
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
	if (allComments.length == 0) {
		nothingHere()
	} else {
		somethingHere()
	}
	minifyHeader();
	checkForLocalStorage();
	var hash = location.hash

	// If '?' parameter is present in the URL, then getComments() using that parameter
	if(hash != "#1" && query != "") {
		subredditToShow = query
		$('#search_title').html('/r/' + subredditToShow)
		getComments(query)
		somethingHere()
		if(hash == "") {
			window.location = 'index.html' + '?' + query + "#2"
		} else if(hash == '#1') {
			$('#search_title').hide
		}	else {
			window.location = 'index.html' + '?' + query + hash
		}
	}

	// On form subit, execute getComments()
	$('#search_form').on('submit', function(e) {
		e.preventDefault();
		subredditToShow = $('#search-term').val();
		$('#search_title').html('/r/' + subredditToShow)
		getComments(subredditToShow);
		var hash = location.hash
		if(hash == "" | hash == "#1") {
			window.location = 'index.html' + '?' + subredditToShow + "#2"
		} else {
			window.location = 'index.html' + '?' + subredditToShow + hash
		}
	});

	// On selecting a radio button, execute getComments()
	$( "#reddit-form" ).change(function(form,name) {
		subredditToShow = $('input[name="subreddit"]:checked', '#reddit-form').val();
		$('#search_title').html('/r/' + subredditToShow)
		getComments(subredditToShow);
		var hash = location.hash
		if(hash == "" | hash == "#1") {
			window.location = 'index.html' + '?' + subredditToShow + "#2"
		} else {
			window.location = 'index.html' + '?' + subredditToShow + hash
		}
	});	
});





