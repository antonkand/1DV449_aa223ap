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

// @loadedCheerio: a cheerio object with loaded dom
// @scrapeobject: a JS object to write to
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
				description: '',
				first_blogpost: {
					title: '',
					author: '',
					date: '',
					post_body: ''
				}
			};
			data.each(function () {
				course.coursename = data.text();
				course.url = data[0].attribs['href'];
				// make new request for each subpage,
				// push to course {}
				request(course.url, function (error, response, html) {
					if (!error && response.statusCode === 200) {
						var loader = cheerio.load(html, { normalizeWhitespace: true });
						// short description of course
						loader('div.entry-content').filter(function () {
							var courseDescription = loader(this);
							// TODO: Fix course description
							// console.log(courseDescription.first().text());
							// doc('div.entry-content').first('p').text()
							course.description = courseDescription.first('p').text();
						});
						// first blog post
						loader('header.entry-header').filter(function () {
							var blogPost = loader(this);
							// console.log(blogPost.children().first().text()); // h1 with title
							console.log(blogPost.children().first()); // strong with author
							course.first_blogpost.title = blogPost.children().first().text() || 'no title';
							// course.first_blogpost.author = blogPost.children().second().text();
						});

					callback(course);
					}
				});
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
	// console.log('pushCourse @course:');
	// console.log(course);
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
