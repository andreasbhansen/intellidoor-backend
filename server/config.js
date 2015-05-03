Restivus.configure({
	useAuth: true
});

Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
	extended: false
}));