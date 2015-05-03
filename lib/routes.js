/* global Router */
/*
 * Web routes
 */

Router.configure({
	layoutTemplate: 'Layout'
});

Router.route('/', function ()
{
	this.render('Home')
});

Router.route('/register', function ()
{
	this.render('Register');
});

Router.route('/dashboard', function ()
{
	this.render('Dashboard');
});

Router.route('/profile', {
	waitOn: function ()
	{
		return Meteor.subscribe('UserUUID', Meteor.user().emails[0].address);
		//return Meteor.subscribe('userData');
	},
	action: function ()
	{
		if (this.ready())
		{
			this.render('Profile');
		}
	}
});

Router.route('/configure-intellidoor', {
	waitOn: function ()
	{
		return Meteor.subscribe('DoorsForUser', Meteor.user().emails[0].address) && Meteor.subscribe('UserUUID', Meteor.user().emails[0].address);
	},
	action: function ()
	{
		if (this.ready())
		{
			this.render('ConfigureIntellidoor')
		}
	}
});

Router.route('/configure-intellidoor/:door_id/configure-users', {
	waitOn: function ()
	{
		return Meteor.subscribe('DoorsForUser', Meteor.user().emails[0].address) && Meteor.subscribe('UUIDs');
	},
	data: function ()
	{

		//return {door_id: this.params.door_id}
	},
	action: function ()
	{
		if (this.ready())
		{
			Session.set('DoorId', this.params.door_id);
			this.render('ConfigureIntellidoorUsers')
		}
	}
});

AccountsTemplates.configureRoute('signIn', {
	name: 'login',
	path: '/login',
	template: 'Login',
	layoutTemplate: 'Layout',
	redirect: '/dashboard'
});

AccountsTemplates.configure({
	hideSignUpLink: true,
	hideSignInLink: true
});

/*
 * Server-side API routes
 */
Router
	.route('/api/', {where: 'server'})
	.get(function ()
	{
		this.response.setHeader('Content-Type', 'application/json');
		this.response.end(JSON.stringify({'message': 'Missing endpoint'}));
	})
	.post(function ()
	{
		/* Get request body data:
		 this.request.body.[variable_name]
		 console.log(this.request.body.door_id);
		 */
	});

Router
	.route('/api/check-door-access-for-email', {where: 'server'})
	.get(function ()
	{

		// Do on client as well (let's not trust the client fully, tho)!
		var door_id = this.request.body.door_id;
		var email = this.request.body.email;

		var door = Doors.findOne({
			"_id": door_id, "users_with_access.email": email
		});
		/*        this.response.setHeader('Content-Type', 'application/json');
		 this.response.end(JSON.stringify({'message': 'Open'}));*/

		console.log(door);

	});

Router
	.route('/api/open-door', {where: 'server'})
	.post(function ()
	{
		// Send notification to main door owner if it opens?
		openDoor(x, y);

	});

Router
	.route('/api/get-doors-user-can-access/:email', {where: 'server'})
	.get(function ()
	{
		var email = this.params.email;
		getDoorsUserCanAccess(email, this);
	});

Router
	.route('/api/update-door', {where: 'server'})
	.post(function () {
		var req = JSON.stringify(this.request.body);
		var reqSubstr = req.substr(0, req.length-4);
		reqSubstr = reqSubstr.substr(1);

		var parsed = JSON.parse(reqSubstr);
		var obj = JSON.parse(parsed);

		Doors.update({_id: obj._id, "users_with_access.email": obj.user_info_for_door.email}, {$set: {"users_with_access.$.integrations": obj.user_info_for_door.integrations}});

		this.response.setHeader("Content-Type", "application/json");
		this.response.setHeader("Access-Control-Allow-Origin", "*");
		this.response.end(JSON.stringify({'message': 'Test'}));
	});

Router
	.route('/api/add-pending-user-to-door', {where: 'server'})
	.post(function ()
	{
		var doorId = this.request.body._id;
		var userEmail = this.request.body.user_email;
		addPendingUserToDoor(doorId, userEmail, this);
	});

Router
	.route('/api/notify-owner-on-door-unlock', {where: 'server'})
	.post(function ()
	{
		var doorId = this.request.body._id;
		var emailOfPersonUnlockingDoor = this.request.body.unlock_email;

		var door = Doors.findOne({_id: doorId});
		var personToNotify = door.owner_email;

		// Pushwoosh? Notification over DDP? Ionic Push?
	});


Router
	.route('/api/register-deviceid', {where: 'server'})
	.post(function ()
	{
		var req = this.request.body;
		console.log(req);
	});

/*Router
 .route('/api/check-beaconid-against-door', {where: 'server'})
 .get(function ()
 {
 var beaconId = this.request.body.beacon_id;
 var doorId = this.request.body.door_id;

 });*/


/*
 * Functions for APIs
 */
function openDoor(doorId, emailAskingForAccess)
{

}

function getDoorsUserCanAccess(param, context)
{
	if (typeof param !== "undefined")
	{
		var doors;
		var doorsModified = [];

		// Param is email
		if (param.indexOf('@') > -1)
		{
			//var doorOwner = Meteor.users.findOne({"emails.address": param});
			doors = Doors.find({"users_with_access.email": param}, {fields: {GCM_tokens: 0}}).fetch();

			console.log('Doors', doors);

			for (var i = 0; i < doors.length; i++)
			{
				var door = doors[i];
				console.log('Door', door);
				for (var j = 0; j < door.users_with_access.length; j++)
				{
					var isDoorOwner = false;

					var user = door.users_with_access[j];

					if (user.email === param)
					{
						if (user.door_owner)
						{
							isDoorOwner = true;
							console.log('Mid-for loop isDoorOwner', isDoorOwner);
						}
						var doorInfo = {
							_id: doors[j]._id,
							location: doors[j].location,
							custom_name: doors[j].custom_name,
							is_door_owner: isDoorOwner,
							user_info_for_door: user
						};
						doorsModified.push(doorInfo);
					}
				}
			}

		}

		/*		// Param is userId
		 else
		 {
		 doors = Doors.find({owner_id: param}, {fields: {GCM_tokens: 0, users_with_access: 0}}).fetch();
		 }*/


		if (doorsModified.length != 0)
		{
			context.response.setHeader('Content-Type', 'application/json');
			context.response.setHeader('access-control-allow-origin', '*');
			context.response.end(JSON.stringify({'available_doors': doorsModified}));
		}
		else
		{
			context.response.setHeader('Content-Type', 'application/json');
			context.response.setHeader('access-control-allow-origin', '*');
			context.response.end(JSON.stringify({'message': 'No doors with this email/user exist.'}));
		}
	}
	else
	{
		context.response.setHeader('Content-Type', 'application/json');
		context.response.setHeader('access-control-allow-origin', '*');
		context.response.end(JSON.stringify({'message': 'API not used properly, missing email in URL query.'}));
	}
}

function addPendingUserToDoor(doorId, userEmail, context)
{
	var door = Doors.findOne({_id: doorId});

	if (door.length != 0)
	{
		var res = Doors.update({
			"_id": doorId
		}, {
			$push: {
				"users_with_access": {
					"email": userEmail,
					"got_access": false,
					"pending_access": true
				}
			}
		});

		context.response.setHeader('Content-Type', 'application/json');
		context.response.setHeader('access-control-allow-origin', '*');
		context.response.end(JSON.stringify({'message': JSON.stringify(res)}));
	}
	else
	{
		context.response.setHeader('Content-Type', 'application/json');
		context.response.setHeader('access-control-allow-origin', '*');
		context.response.end(JSON.stringify({'message': 'No door with this email/user exist.'}));
	}
}