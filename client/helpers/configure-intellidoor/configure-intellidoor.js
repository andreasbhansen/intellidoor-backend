//Session.set('UsersDoors', []);

Template.ConfigureIntellidoor.rendered = function ()
{
	$('.modal-trigger').leanModal();

	var userUUID = UUIDs.findOne();
	Session.set('UserUUID', userUUID.UUID);

};

Template.ConfigureIntellidoor.helpers({
	doors: function ()
	{
		console.log(Doors.find().fetch());
		return Doors.find();
	},
	usersWithAccess: function (users_with_access)
	{
		var count = 0;
		for (var i = 0; i < users_with_access.length; i++)
		{
			var user = users_with_access[i];
			if (!user.pending_access)
			{
				count++;
			}
		}

		return count;
	},
	isUserDoorOwner: function (users_with_access)
	{
		var isDoorOwner = false;
		for (var i = 0; i < users_with_access.length; i++)
		{
			var user = users_with_access[i];

			console.log(user.email);
			console.log(Meteor.user().emails[0].address);

			if (user.email === Meteor.user().emails[0].address)
			{
				if (user.door_owner)
				{
					isDoorOwner = true;
					console.log('Mid-for loop isDoorOwner', isDoorOwner);
				}
			}
		}
		return isDoorOwner;
	},
	usersPendingAccess: function (users_with_access)
	{
		var count = 0;
		for (var i = 0; i < users_with_access.length; i++)
		{
			var user = users_with_access[i];
			if (user.pending_access)
			{
				count++;
			}
		}

		return count;
	}
});

Template.ConfigureIntellidoor.events({
	'click #btn-add-row': function (e)
	{
		e.preventDefault();

		var doorData = {
			//"owner_id": Meteor.userId(),
			"location": $('#door-location').val(),
			"custom_name": $('#door-name').val(),
			"GCM_tokens": [],
			"users_with_access": [
				{
					"email": Meteor.user().emails[0].address,
					"got_access": true,
					"pending_access": false,
					"is_home": true,
					"door_owner": true,
					"UUID": Session.get('UserUUID'),
					"integrations": [
						/*{
						 "name": "TV",
						 "active": true
						 }*/
					]
				}
			]
		};

		Meteor.call('CreateNewDoorForUser', doorData, function (err, data)
		{
			if (!err)
			{
				Materialize.toast('Door added: ' + doorData.custom_name, 2500);
			}
		});
	}
});