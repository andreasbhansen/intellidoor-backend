//Session.set('UsersDoors', []);

Template.ConfigureIntellidoor.rendered = function ()
{
    $('.modal-trigger').leanModal();
};

Template.ConfigureIntellidoor.helpers({
    doors: function ()
    {
        return Doors.find();
    },
    usersWithAccess: function (users_with_access)
    {
        return users_with_access.length;
    }
});

Template.ConfigureIntellidoor.events({
    'click #btn-add-row': function (e)
    {
        e.preventDefault();

        var doorData = {
            "owner_id": Meteor.userId(),
            "location": $('#door-location').val(),
            "custom_name": $('#door-name').val(),
            "users_with_access": []
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