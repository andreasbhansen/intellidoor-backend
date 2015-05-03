Meteor.publish('DoorsForUser', function (userEmail)
{
	console.log(userEmail);
	return Doors.find({
		"users_with_access.email": userEmail
	});
});


/*
 * For DDP integrations
 */

Meteor.publish('DoorOpenIntegration', function (doorId)
{

});

Meteor.publish('DoorInfoForDoorId', function (doorId, apikey)
{
	return Doors.find({
		_id: doorId
	}/*, {
	 // Excluding fields from being published to client
	 fields: {
	 location: 0
	 }
	 }*/);
});

Meteor.publish('UUIDs', function ()
{
	return UUIDs.find();
});

Meteor.publish('UserUUID', function (email)
{
	return UUIDs.find({email: email});
});

/*
 Meteor.publish('userData', function ()
 {
 if (!this.userId)
 {
 return null;
 }
 return Meteor.users.find(this.userId, {
 fields: {
 UUID: 1
 }
 });
 });
 */
