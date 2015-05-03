Meteor.startup(function () {

    if (Doors.find().count() === 0) {
        Doors.insert({
            "owner_id": "iT4b88v3QJeQzwjD4",
            "owner_email": "test@test.com",
            "location": "Auli",
            "custom_name": "Ytterdør",
            "users_with_access": [
/*                {
                    "email": "",
                    "got_access": true,
                    "pending_access_approval": true
                }*/
            ]
        });
    }
});