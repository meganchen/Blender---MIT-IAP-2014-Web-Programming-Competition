if(Meteor.isServer){

Meteor.methods({
	delete_meal: function(mealid){
		Meals.remove({meal_id: mealid});
		Meals.remove({_id: mealid})
	},

	update_date_order: function(mealid){
		Meals.update({
			meal_id: mealid,
			type: 'cook',
		},
		{$set: 
			{date_order: Meals.findOne(mealid).date_order}
		})
	}
})
}