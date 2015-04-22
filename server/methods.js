Meteor.methods({
    CreateNewDoorForUser: function (doorData)
    {
        return Doors.insert(doorData);
    },
    AddUserToDoor: function (doorId, userEmail)
    {

        return Doors.update({
            _id: doorId
        }, {
            $push: {
                users_with_access: {
                    email: userEmail,
                    got_access: true
                }
            }
        });
    }
});