'use strict';
// @loadedCheerio: a cheerio object with loaded dom
// @scrapeobject: a JS object to write to
function getCourses (loadedCheerio, scrapeobject) {
			if (!loadedCheerio || !scrapeobject) {
				console.log('cheerio.getCourses: missing params.');
			}
			loadedCheerio('.item-title a').filter(function () {
			var data = loadedCheerio(this);
			data.each(function () {
				var course = {
					coursename: data.text(),
					url: data[0].attribs['href']
				};
			scrapeobject.courses.push(course);
			scrapeobject.scraped_courses = scrapeobject.courses.length;
			});
		});
}

var coursepress = {};

coursepress.options = {
	url: 'http://coursepress.lnu.se/kurser',
	headers: {
		'User-Agent': 'Webbteknik II som skrapar'
	}
};

coursepress.cheerio = {};
coursepress.cheerio.getCourses = getCourses;

exports.options = coursepress.options;
exports.cheerio = coursepress.cheerio;
exports.filename = 'coursepress.json';
exports.jsonlink = '/coursepress';
