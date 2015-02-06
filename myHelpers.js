var hbs = require("express-hbs");
var members = require("./content/members.json");
var _ = require('lodash');

registerHelpers = function() {
	String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
	}

	hbs.registerHelper('hasTag', function(tag, options) {
		for (var i = 0; i < this.tags.length; i++) {
			if (this.tags[i].name == tag) {
				return options.fn(this);
			}
		}
		return options.inverse(this);
	});
	hbs.registerHelper('print', function(obj, options) {
		console.log(obj);
		return options.fn(this);
	});
	hbs.registerHelper('isPhotoAlbum', function(options) {
		for (var i = 0; i < this.tags.length; i++) {
			console.log('COMPARE: '+this.tags[i].name+'; TO: album');
			if (this.tags[i].name == 'album') {
				return options.fn(this);
			}
		}
		return options.inverse(this);
		// if (this.markdown.startsWith('[PHOTOALBUM]')) {
		// 	return options.fn(this);
		// } else {
		// 	return options.inverse(this);
		// }
	});
	hbs.registerHelper('isMembersPage', function(options) {
		for (var i = 0; i < this.tags.length; i++) {
			if (this.tags[i].name == 'teamMembers') {
				return options.fn(this);
			}
		}
		return options.inverse(this);
	});
	hbs.registerHelper('eachPhoto', function(options) {
		var ret = "";
		var content = this.markdown;
		var matches = content.match(/\((.*?)\)/);

		var images = [];

		while (matches) {
			images.push(matches[1]);
			content = content.replace(/\((.*?)\)/, '');
			matches = content.match(/\((.*?)\)/);
		}

		console.log(images);

		for (var i = 0; i < images.length; i++) {
			ret += options.fn(images[i]);
		}

		return ret;
	});
	hbs.registerHelper('eachEB', function(options) {
		var ret = '';
		var members = JSON.parse(this.markdown);
		var eb = _.filter(members.people, function(person) {
			for (var i = 0; i < members.executiveBoard.length; i++) {
				if (members.executiveBoard[i] == person.id) {
					return true;
				}
			}
			return false;
		});

		for (var i = 0; i < eb.length; i++) {
			ret += options.fn(eb[i]);
		}

		return ret;
	});
	hbs.registerHelper('ebTitle', function(options) {
		var year = this.year;
		if (year.length > 2) {
			year = year.substring(2, 4);
		}
		return this.name + ' \''+ year + ', ' + this.role;
	});
	hbs.registerHelper('eachPerson', function(options) {
		var ret = '';

		var byYear = {};
		var years = [];
		var members = JSON.parse(this.markdown);

		for (var i = 0; i < members.people.length; i++) {
			var person = members.people[i];
			if (byYear[person.year]) {
				byYear[person.year].push(person);
			} else {
				byYear[person.year] = [person];
				years.push(person.year);
			}
		}

		years.sort();
		for (var i = 0; i < years.length; i++) {
			var people = _.sortBy(byYear[years[i]], 'name');
			for (var j = 0; j < people.length; j++) {
				ret += options.fn(people[j]);
			}
		}

		return ret;
	});
	hbs.registerHelper('stringify', function(obj, options) {
		return JSON.stringify(obj).replace(/(['])/g, '&#39;');
	});
}

module.exports = registerHelpers;