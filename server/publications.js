Meteor.publish('DoorsForUser', function (userId)
{
    console.log(userId);
    return Doors.find({
        owner_id: userId
    });
});