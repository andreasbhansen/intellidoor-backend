Meteor.methods({
	CreateNewDoorForUser: function (doorData)
	{
		return Doors.insert(doorData);
	},
	AddUserToDoor: function (doorId, userEmail, userUUID)
	{
		return Doors.update({
			"_id": doorId
		}, {
			$push: {
				"users_with_access": {
					"email": userEmail,
					"got_access": true,
					"pending_access": false,
					"is_home": true,
					"UUID": userUUID,
					"integrations": []
				}
			}
		});
	},
	ModifyUserAccessForDoor: function (doorId, userEmail, gotAccess)
	{
		/*		return Doors.update({
		 "_id": doorId,
		 "users_with_access.email": userEmail
		 }, {
		 $set: {
		 "users_with_access.$": {
		 "email": userEmail,
		 "got_access": gotAccess,
		 "pending_access": false
		 }
		 }
		 });*/

		return Doors.update({
			"_id": doorId,
			"users_with_access.email": userEmail
		}, {
			$set: {
				"users_with_access.$.email": userEmail,
				"users_with_access.$.got_access": gotAccess,
				"users_with_access.$.pending_access": false

			}
		});
	},
	SetUserIsHome: function (doorId, userEmail, gotAccess, isHome)
	{
		return Doors.update({
			"_id": doorId,
			"users_with_access.email": userEmail
		}, {
			$set: {
				//"users_with_access.$": {
				"users_with_access.$.email": userEmail,
				"users_with_access.$.got_access": gotAccess,
				"users_with_access.$.pending_access": false,
				"users_with_access.$.is_home": isHome
				//}
			}
		});
	},
	RemoveUserFromDoor: function (doorId, userEmail)
	{
		return Doors.update({
			"_id": doorId
		}, {
			$pull: {
				"users_with_access": {
					"email": userEmail
				}
			}
		});
	},
	AddGCMTokenToDoor: function (doorId, token)
	{
		return Doors.update({
			"_id": doorId
		}, {
			$push: {
				"GCM_tokens": token
			}
		});
	},
	SetUUIDToUser: function (UUID)
	{
		return UUIDs.update({email: Meteor.user().emails[0].address}, {$set: {"UUID": UUID}});
	},
	FindUserUUID: function (userEmail)
	{
		console.log(UUIDs.find({email: userEmail}).fetch());
		return UUIDs.find({email: userEmail}).fetch();
	}
});