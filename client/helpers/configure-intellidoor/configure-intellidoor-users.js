Template.ConfigureIntellidoorUsers.rendered = function ()
{
    $('.modal-trigger').leanModal();
};

Template.ConfigureIntellidoorUsers.helpers({
    door_info: function () {
        return Doors.findOne({_id: this.door_id});
    }
});

Template.ConfigureIntellidoorUsers.events({
    'click .user-has-access': function (e, tmpl) {
        console.log($(e.target).is(':checked').val());
    },
    'click #btn-add-user': function (e) {
        e.preventDefault();

        var email = $('#new-user-email').val();

        console.log("door_id", this.door_id);
        console.log("email", email);

        Meteor.call('AddUserToDoor', this.door_id, email, function (err, data)
        {
            console.log("Err: ", err);
            if (!err)
            {
                Materialize.toast('User added added: ' + userData.email, 2500);
            }
        });
    }
});