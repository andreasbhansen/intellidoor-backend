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

Router.route('/profile', function ()
{
    this.render('Profile');
});

Router.route('/configure-intellidoor', {
    waitOn: function ()
    {
        return Meteor.subscribe('DoorsForUser', Meteor.userId());
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
        return Meteor.subscribe('DoorsForUser', Meteor.userId());
    },
    data: function () {
        return {door_id: this.params.door_id}
    },
    action: function ()
    {
        if (this.ready())
        {
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
    .route('/api/check-id-for-door', {where: 'server'})
    .get(function ()
    {

        // Do on client as well!
        /*
         var door_id = this.request.body.door_id;
         var phone_id = this.request.body.phone_id;

         var door = Doors.findOne({_id: door_id});
         for (var i = 0; i < door.allowed_phones.length; i++)
         {
         if (door.allowed_phones[i].number === phone_id) {

         }

         }
         */
    });

Router
    .route('/api/open-door', {where: 'server'})
    .post(function ()
    {
        // Send notification to main door owner if it opens?


    });