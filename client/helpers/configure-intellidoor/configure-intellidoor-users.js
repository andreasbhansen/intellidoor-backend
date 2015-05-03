Template.ConfigureIntellidoorUsers.rendered = function ()
{
	console.log('rendered');
	$('.modal-trigger').leanModal();
};

Template.ConfigureIntellidoorUsers.helpers({
	door_info: function ()
	{
		return Doors.findOne({_id: Session.get('DoorId')});
	}
});

Template.ConfigureIntellidoorUsers.events({
	'click .user-has-access': function (e, tmpl)
	{
		e.preventDefault();

		var hasAccess = $(e.target).prop('checked');

		Meteor.call('ModifyUserAccessForDoor', Session.get('DoorId'), this.email, hasAccess, function (err, data)
		{
			if (!err)
			{
				console.log(data);
			}
		});
	},
	'click .is-user-at-home': function (e, tmpl)
	{
		e.preventDefault();

		var isHome = $(e.target).prop('checked');

		console.log(isHome);

		Meteor.call('SetUserIsHome', Session.get('DoorId'), this.email, this.got_access, isHome, function (err, data)
		{
			if (!err)
			{
				console.log(data);
			}
		});
	},
	'click #btn-add-user': function (e)
	{
		e.preventDefault();

		var email = $('#new-user-email').val();

		Meteor.call('FindUserUUID', email, function (err, data)
		{
			// No user by "that" email was found
			if (data.length != 0)
			{
				var userUUID = data[0].UUID;

				Meteor.call('AddUserToDoor', Session.get('DoorId'), email, userUUID, function (err, data)
				{
					console.log("Err: ", err);
					if (!err)
					{
						Materialize.toast('User added: ' + email, 2500);
					}
				});
			}
			else
			{
				Materialize.toast('No such user found', 2500, 'toast-alert');
			}
		});


	},
	'click #btn-remove-user': function (e)
	{
		e.preventDefault();

		Meteor.call('RemoveUserFromDoor', Session.get('DoorId'), this.email, function (err, data)
		{
			if (!err)
			{
				console.log("Error from RemoveUserFromDoor call ", data);
			}
		});
	},
	'click #btn-add-token': function (e)
	{
		e.preventDefault();

		var token = $('#new-token').val();

		Meteor.call('AddGCMTokenToDoor', Session.get('DoorId'), token, function (err, data)
		{
			console.log("Err: ", err);
			if (!err)
			{
				Materialize.toast('Token added', 2500);
			}
		});
	}
});