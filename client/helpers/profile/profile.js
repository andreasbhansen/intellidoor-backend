Template.Profile.helpers({
	userUUID: function ()
	{
		return UUIDs.findOne();
	}
});

Template.Profile.events({
	'click #btn-save-profile': function (e)
	{
		var UUID = $('#userUUID').val();
		console.log('UUID', UUID);

		e.preventDefault();
		Meteor.call('SetUUIDToUser', UUID, function (err, data)
		{
			console.log(data);
		});
	}
});