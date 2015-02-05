var hbs = require("express-hbs");

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
}

module.exports = registerHelpers;