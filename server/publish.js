if(Meteor.isServer){

Meteor.publish('meals', function() {
  return Meals.find();
});

}