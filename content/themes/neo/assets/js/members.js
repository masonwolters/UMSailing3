
var PersonView = Backbone.View.extend({
	el: '#modal',

	template: _.template(
		'\
			<div class="modal-dialog">\
			  <div class="modal-content">\
			    <div class="modal-header">\
			    	<img src="<%= person.image %>">\
			    </div>\
			    <div class="modal-body">\
				    <h3 style="margin-left: 15px;"><%= person.name %></h3>\
			    	<div class="col-sm-6">\
			    		<label>Year</label>\
			    		<p><%= person.year %></p>\
			    	</div>\
			    	<div class="col-sm-6">\
			    		<label>Major</label>\
			    		<p><%= person.major%></p>\
			    	</div\
					<div class="col-sm-6">\
						<label style="margin-left: 15px;">Bio</label>\
						<p style="margin-left: 15px; margin-right: 15px;"><%= person.bio %></p>\
					</div>\
			   	</div>\
			  </div\
			</div>\
		'
	),

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.html(this.template({person: this.model}));
		this.$el.modal();
	}
});

function initMembers() {
	$('.memberName').click(function(ev) {
		var person = $(ev.target).data('json');
		var personView = new PersonView({model: person});
	});
}