'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var options = {
	url: 'http://coursepress.lnu.se/kurser',
	headers: {
		'User-Agent': 'Webbteknik II som skrapar'
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
	SYLLABUS_PATTERN: /GenerateDocument.ashx/,
	DATE_PATTERN: /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/
};

// checks url to contain the word 'kurs'
function isCourse (url) {
	return url.match(regex.COURSE_PATTERN);
}

// returns parsed date from string
function isDate (str) {
	var date = str.match(regex.DATE_PATTERN) || ['non-parseable date']; // funny but ugly hack detected
	return date[0];
}

//
function fetchSyllabus (hrefCheerio) {
	var hrefs = hrefCheerio;
	return hrefs.match(regex.SYLLABUS_PATTERN);
}

// @loadedCheerio: a cheerio object with loaded dom
// @callback: returns a course object
function scrapeCourses (loadedCheerio, callback) {
			if (!loadedCheerio) {
				console.log('cheerio.getCourses: missing params.');
			// load all the urls and titles,
			// push to course {}
			}
			loadedCheerio('.item-title a').filter(function () {
			var data = loadedCheerio(this);
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
								var loader = cheerio.load(html, { normalizeWhitespace: true });
								// TODO
								//fetchSyllabus(loader('a').toString());
								course.number = loader('#header-wrapper ul li + li + li > a').text() || 'no information';
								// short description of course
								// different formating for different courses
								// get h1 + p first, which is most common
								// get h2 + p second, uncommon
								course.description = (loader('div.entry-content h1 + p').text() || loader('div.entry-content h2 + p').text()) || 'description not available';
								// first blog post
								course.first_blogpost.title = loader('header.entry-header').children().first().text() || 'no title'; // title or non-parseable title, from old coursepress site
								course.first_blogpost.author = loader('p.entry-byline strong').first().text() || 'Anon teacher'; // name of author, or non-parseable.
								course.first_blogpost.date = isDate(loader('p.entry-byline').first().text()); // YY-MM-DD HH:MM or non-parsable date
								callback(course);
							}
						});
					}
				});
		});
}

// writes the scraped data to file
function saveDataToJSON () {
		fs.writeFile('public/scraped_data/' + filename, JSON.stringify(json, null, 4), function(err){
			if (err) {
					throw err;
			}
			console.log('Scraper saved to JSON: ' + filename);
		});
}

// used as callback when scraping
function pushCourse (course) {
	json.courses.push(course);
	json.scraped_courses = json.courses.length;
}


function scrape () {
	request(options, function(error, response, html){
			if (!error && response.statusCode === 200) {
				var loader = cheerio.load(html, { normalizeWhitespace: true });
				scrapeCourses(loader, pushCourse);
			}
		});
		setTimeout(saveDataToJSON, 15000);
}

var coursepress = {
	scrape: scrape,
	filename: filename,
	jsonlink: jsonlink,
	url: options.url
};

module.exports = coursepress;
