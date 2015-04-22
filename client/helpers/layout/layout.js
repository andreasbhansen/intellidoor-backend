Template.Layout.events({
    'click #logout': function (e) {
        e.preventDefault();
        Meteor.logout(function () {
            Materialize.toast('You\'re logged out!', 4000); // 4000 is the duration of the toast
            console.log('Logged out');
            Router.go('/');
        });
    }
});