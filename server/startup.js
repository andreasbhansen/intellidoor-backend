Meteor.startup(function () {

    if (Doors.find().count() === 0) {
        Doors.insert({
            "owner_id": "iT4b88v3QJeQzwjD4",
            "location": "Auli",
            "custom_name": "Ytterdør",
            "users_with_access": [
                {
                    "user_id": "",
                    "user_name": "",
                    "has_access": true
                }
            ]
        });
    }
});