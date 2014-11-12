'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var options = {
	url: 'http://coursepress.lnu.se/kurser',
	headers: {
		'User-Agent': 'aa223ap'
	}
};
var filename = 'coursepress.json';
var jsonlink = '/coursepress';
var json = {
	site: options.url,
	date_scraped: new Date(),
	courses: [],
	scraped_courses: 0
};
var regex = {
	COURSE_PATTERN: /kurs/,
	SYLLABUS_PATTERN: /coursesyllabus/,
	DATE_PATTERN: /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/
};

// checks url to contain the word 'kurs'
function isCourse (url) {
	return url.match(regex.COURSE_PATTERN);
}

// returns parsed date from string
function isDate (str) {
	var date = str.match(regex.DATE_PATTERN) || ['non-parseable date']; // funny
	return date[0];
}

// writes the scraped data to file
function saveDataToJSON () {
		fs.writeFileSync('public/scraped_data/' + filename, JSON.stringify(json, null, 4));
		console.log('Scraper saved to JSON: ' + filename);
}

// used as callback when scraping
function pushCourse (course) {
	json.courses.push(course);
	json.scraped_courses = json.courses.length;
}

// returns true if no previous scraping was found,
// or if scraped data is older than 5 minutes
function cachedDataHasExpired () {
	try {
		var cachedDate = new Date(require('../../public/scraped_data/coursepress.json').date_scraped).getTime() || null;
		if (cachedDate) {
			var now = new Date().getTime();
			console.log('Cached data has expired: ' + (now - cachedDate >= 300000).toString());
			return (now - cachedDate >= 300000);
		}
		else {
			console.log('Cached data has expired: couldn\'t read existing file.');
			return true; // no cached version exists
		}
	}
	// couldn't load saved json,
	// new scrape needs to be done
	catch (error) {
		console.log('Cached data has expired: couldn\'t read existing file.');
		return true;
	}
}

// matches links with syllabus generation
// if null, false
function matchSyllabus (href) {
	return href ? href.match(regex.SYLLABUS_PATTERN) : false;
}

// @domRepresentation: a cheerio object with loaded dom
// @callback: returns a course object
function scrapeCourses (domRepresentation, callback) {
			if (!domRepresentation) {
				console.log('scrapeCourses: missing params.');
			}
			// load all the urls and titles,
			// push to course {}
			domRepresentation('.item-title a').filter(function () {
			var data = domRepresentation(this);
			var course = {
				coursename: '',
				url: '',
				number: '',
				syllabus: '',
				description: '',
				first_blogpost: {
					title: '',
					author: '',
					date: ''
				}
			};
			data.each(function () {
					// if it's a course, use url, throw away otherwise
					if (isCourse(data[0].attribs['href'])) {
						course.url = data[0].attribs['href'];
						course.coursename = data.text();
						// make new request for each subpage,
						// push to course {}
						request(course.url, function (error, response, html) {
							if (!error && response.statusCode === 200) {
								var dom = cheerio.load(html, { normalizeWhitespace: true });
								dom('a').each(function (link) {
									if (matchSyllabus(dom('a')[link].attribs['href'])) {
										course.syllabus = dom('a')[link].attribs['href'];
									}
								});
								course.number = dom('#header-wrapper ul li + li + li > a').text() || 'no information';
								// short description of course
								// different formating for different courses
								// get h1 + p first, which is most common
								// get h2 + p second, uncommon
								course.description = (dom('div.entry-content h1 + p').text() || dom('div.entry-content h2 + p').text()) || 'description not available';
								// first blog post
								course.first_blogpost.title = dom('header.entry-header').children().first().text() || 'no title'; // title or non-parseable title, from old coursepress site
								course.first_blogpost.author = dom('p.entry-byline strong').first().text() || 'Anon teacher'; // name of author, or non-parseable.
								course.first_blogpost.date = isDate(dom('p.entry-byline').first().text()); // YY-MM-DD HH:MM or non-parsable date
								callback(course);
							}
						});
					}
				});
		});
}

function scrape () {
	// expired data is older than 5 minutes
	if (cachedDataHasExpired()) {
		// this could be done dynamically
		var numberOfCoursePages = [0, 1, 2, 3, 4];
		numberOfCoursePages.forEach(function (element, index) {
			options.url = 'http://coursepress.lnu.se/kurser/?bpage=' + (index + 1);
			request(options, function(error, response, html){
				if (!error && response.statusCode === 200) {
					var dom = cheerio.load(html, { normalizeWhitespace: true });
					scrapeCourses(dom, pushCourse);
				}
			});
		});
		// this should probably be done async
		setTimeout(saveDataToJSON, 45000);
	}
}

var coursepress = {
	scrape: scrape,
	filename: filename,
	jsonlink: jsonlink,
	url: options.url
};

module.exports = coursepress;
