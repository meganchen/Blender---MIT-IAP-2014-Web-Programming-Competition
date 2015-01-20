
if(Meteor.isClient){


Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

// 

Template.view_meal.events({
'click #submit_message': function(){
	Meals.insert({
	meal_id: Session.get('meal_id'),
	type: 'message',
	message: $("#message_input").val(),
	author: Meteor.users.findOne({_id: Meteor.userId()}).username,
	});
	Session.set('message',null);
},

'click #cancel_message': function(){
	Session.set('message',null)
},
});

//These click functions are modifications of the ones below,
//designed to work on view_meal.

Template.view_meal.events({
'click .delete_meal': function(){

	//Checks if you meant to do this
	check=prompt('Are you sure you want to delete this meal? (yes or no)')
	if(check==='y' || check==='Y' || check==='yes' || check==='Yes' || check==='YES'){
	
	//Calls to the server to delete the multiple documents involved,
	//since the client is allowed to delete only one at a time.
	Meteor.call('delete_meal',Session.get('meal_id'));

	//Cleans up the Session
	Session.set('meal_status',null);
	Session.set('meal_id',null);
	}
},

'click .unjoin_meal': function(){
	var mealid=Session.get('meal_id');
// Removes the cook who decided to leave
	Meals.remove(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})._id);
// Increases the count of cooks again
	Meals.update(mealid, {$inc: {cooks_needed: 1}});

	alert('You are no longer signed up for this meal.')
},

'click .edit_meal': function(){

	//Sets the Session so that the editing page knows which meal to edit
	var mealid=Session.get('meal_id');
	Session.set('meal_status','submitted');
	Session.set('meal_type', Meals.findOne({_id: mealid}).meal_type);
},


'click .join_viewed_meal': function(){
	var mealid=Session.get('meal_id');

	//Decreases by 1 the number of places left
	Meals.update({_id: mealid}, {$inc: {cooks_needed: -1}});

	//Inserts a document that records the new cook
	Meals.insert({
		type: 'cook',
		meal_id: mealid,
		cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username,
		date_order: Meals.findOne(mealid).date_order,
		chef: false,
	});

	alert('Congratulations! You are now signed up for this meal.')

},

});


//If a new cook wants to join a meal
Template.main_layout.events({
'click .join_meal': function(){
	var mealid=this._id;

	//Decreases by 1 the number of places left
	Meals.update({_id: mealid}, {$inc: {cooks_needed: -1}});

	//Inserts a document that records the new cook
	Meals.insert({
		type: 'cook',
		meal_id: mealid,
		cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username,
		date_order: Meals.findOne(mealid).date_order,
		chef: false,
	});

	alert('Congratulations! You are now signed up for this meal.')

},

//Sets the Session to enable a full view of the meal
'click .view_meal': function(){
	Session.set("meal_id", this._id)
},

//Same thing, but works in my_meals
'click .view_my_meal': function(){
	Session.set("meal_id", Meals.findOne({_id: this.meal_id})._id)
},

//Enables a message input window to open when the "message" button is pressed
'click .make_message': function(){
	Session.set("message", "editing")
},
})


//Sets the session to the appropriate meal type

Template.plan_breakfast.rendered = function(){
	Session.set('meal_type','breakfast')
};

Template.plan_lunch.rendered = function(){
	Session.set('meal_type','lunch')
};

Template.plan_dinner.rendered = function(){
	Session.set('meal_type','dinner')
};

Template.plan_dessert.rendered = function(){
	Session.set('meal_type','dessert')
};

Template.plan_other.rendered = function(){
	Session.set('meal_type','other')
};


//Resets the Session so you don't enter an existing meal

Template.breakfast.rendered = function(){
	Session.set('meal_id','pending'),
	Session.set('meal_status','pending')
};

Template.lunch.rendered = function(){
	Session.set('meal_id','pending'),
	Session.set('meal_status','pending')
};

Template.dinner.rendered = function(){
	Session.set('meal_id','pending'),
	Session.set('meal_status','pending')
};

Template.dessert.rendered = function(){
	Session.set('meal_id','pending'),
	Session.set('meal_status','pending')
};

Template.other.rendered = function(){
	Session.set('meal_id','pending'),
	Session.set('meal_status','pending')
};




//PLAN MEAL

//Lets the "plan_meal" template determine whether to show
//the editing or submitted page
Template.plan_meal.helpers({
	meal_status: function(){
	return Session.get('meal_status')
},
});

//If you want to delete a meal right after creating it
Template.plan_meal.events({
'click #delete_meal': function(){

	//Checks if you meant to do this
	check=prompt('Are you sure you want to delete this recipe? (yes or no)')
	if(check==='y' || check==='Y' || check==='yes' || check==='Yes' || check==='YES'){
	
	//If so, deletes meal
	Meteor.call('delete_meal',Session.get('meal_id'));
	}
},

'click #plan_new': function(){
	Session.set('meal_id',null);
	Session.set('meal_status',null);
},

'click #edit_meal': function(){
	//Sets the Session to "editing" so we know not to create a new meal
	Session.set('meal_status','editing');
},

'click .edit_recipe': function(){
	//Sets the Session to the _id of the recipe so we know which one to edit
	Session.set('editing_recipe',this._id);

	//Fills the form with the previously entered data
	$("#recipe_name").val(Meals.findOne(Session.get('editing_recipe')).recipe_name);
	$("#recipe_url").val(Meals.findOne(Session.get('editing_recipe')).recipe_url);
	$("#recipe_notes").val(Meals.findOne(Session.get('editing_recipe')).recipe_notes);
}
});


Template.meal_input.events({
'click #submit_meal': function(){
	//Checks if you have picked a date before the present moment

	if($.now()-86400000>Date.parse($("#datepicker").val())){
		alert("You've picked a date that is in the past!")
	}


	else{
	
	//Conditional to make sure you have entered date and location
	if($("#datepicker").val()!='' && $("#meal_locator").val()!='' && $("#meeting_locator").val()!='' && $("#meeting_time").val()!=''){

	//In the case that this is a new meal (not an edit)
	if(Session.get('meal_status')!=='editing'){

	//Sets the number of cooks who are still needed (max at 100)
	if($("#num_cooks").val()==='none'){
	var needed=100
	}
	else{
	var needed=parseInt($("#num_cooks").val())-1
	};

	//Sets the session to the id of the meal you just submitted.
	Session.set('meal_id',
	Meals.insert({

	//Transfers data from the form to the Meteor Collection "Meals"
	meal_type: Session.get('meal_type'),
	num_cooks: $("#num_cooks").val(),
	meal_locator: $("#meal_locator").val(),
	meeting_time: $("#meeting_time").val(),
	meeting_locator: $("#meeting_locator").val(),
	comments: $("#comments").val(),
	date: $("#datepicker").val(),
	time: $("#timepicker").val(),
	date_order: Date.parse($("#datepicker").val()),
	cooks_needed: needed,
	type: "main",
	no_diet: $("#no_diet").is(':checked'),
	vegetarian: $("#vegetarian").is(':checked'),
	vegan: $("#vegan").is(':checked'),
	kosher: $("#kosher").is(':checked'),
	halal: $("#halal").is(':checked'),
	gluten_free: $("#gluten_free").is(':checked'),
	lactose_free: $("#lactose_free").is(':checked'),
	other_diet: $("#other_diet").is(':checked'),
	username: Meteor.users.findOne({_id: Meteor.userId()}).username,
}));

	//Inserts a document that records the first cook (namely, the meal-planner)
	Meals.insert({
	type: "cook",
	meal_id: Session.get('meal_id'),
	cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username,
	date_order: Date.parse($("#datepicker").val()),
	chef: true,
	});

	//Sets the Session to indicate the submission is done
	Session.set('meal_status','submitted');

	}

	// If this is an edited meal
	else{

	//Checks that num_cooks isn't made lower than the existing number of cooks
	if($("#num_cooks").val()=='none' || $("#num_cooks").val()>=Meals.find({meal_id: Session.get('meal_id'), type: 'cook'}).count())
	{

	//Sets the number of cooks who are still needed (max at 100)
	if($("#num_cooks").val()==='none'){
	var needed=100
	}
	else{
	var needed=parseInt($("#num_cooks").val())-Meals.find({meal_id: Session.get('meal_id'), type: 'cook'}).count()
	};

	//Transfers edited data from the form to the Meteor Collection
	Meals.update(Session.get('meal_id')
	,
	{
	_id: Session.get('meal_id'),
	meal_type: Session.get('meal_type'),
	num_cooks: $("#num_cooks").val(),
	meal_locator: $("#meal_locator").val(),
	meeting_time: $("#meeting_time").val(),
	meeting_locator: $("#meeting_locator").val(),
	comments: $("#comments").val(),
	date: $("#datepicker").val(),
	time: $("#timepicker").val(),
	date_order: Date.parse($("#datepicker").val()),
	cooks_needed: needed,
	type: "main",
	no_diet: $("#no_diet").is(':checked'),
	vegetarian: $("#vegetarian").is(':checked'),
	vegan: $("#vegan").is(':checked'),
	kosher: $("#kosher").is(':checked'),
	halal: $("#halal").is(':checked'),
	gluten_free: $("#gluten_free").is(':checked'),
	lactose_free: $("#lactose_free").is(':checked'),
	other_diet: $("#other_diet").is(':checked'),
	username: Meteor.users.findOne({_id: Meteor.userId()}).username,
	});

	//Updates the date_order stamps on all cooks associated with the meal
	Meteor.call('update_date_order',Session.get('meal_id'));

	//Sets the Session to indicate the editing is done
	Session.set('meal_status','submitted');
	}

	//If you decreased the number of cooks too much
	else{
	alert("You already have more cooks than that! Please pick a larger maximum number of cooks.")
	}
	}
	}

	//More conditionals to make sure you have entered all fields
	else{alert("One or more required fields is empty")}
}
}
});


Template.meal_input.rendered = function(){
	
	//Makes the datepicker happy
	$("#datepicker").datepicker({
		showOn: "focus",
    	buttonImageOnly: true,
		changeMonth: true,
		changeYear: true,
		dateFormat: 'mm-dd-yy',
		showButtonPanel:true,
		showAnim: "slideDown"
	});

	//Fills fields with prior inputs if editing
	if(Session.get('meal_status')==='editing'){
	var thismeal=Meals.findOne({_id: Session.get('meal_id')});
	$("#num_cooks").val(thismeal.num_cooks);
	$("#meal_locator").val(thismeal.meal_locator);
	$("#meeting_time").val(thismeal.meeting_time);
	$("#meeting_locator").val(thismeal.meeting_locator);
	$("#comments").val(thismeal.comments);
	$("#datepicker").val(thismeal.date);

	//Checkboxes require a conditional
	if(thismeal.no_diet)
	{$("#no_diet").attr('checked',true)}
	else{$("#no_diet").attr('checked',false)};

	if(thismeal.vegetarian)
	{$("#vegetarian").attr('checked',true)}
	else{$("#vegetarian").attr('checked',false)};

	if(thismeal.vegan)
	{$("#vegan").attr('checked',true)}
	else{$("#vegan").attr('checked',false)};

	if(thismeal.kosher)
	{$("#kosher").attr('checked',true)}
	else{$("#kosher").attr('checked',false)};

	if(thismeal.halal)
	{$("#halal").attr('checked',true)}
	else{$("#halal").attr('checked',false)};

	if(thismeal.gluten_free)
	{$("#gluten_free").attr('checked',true)}
	else{$("#gluten_free").attr('checked',false)};

	if(thismeal.lactose_free)
	{$("#lactose_free").attr('checked',true)}
	else{$("#lactose_free").attr('checked',false)};

	if(thismeal.other_diet)
	{$("#other_diet").attr('checked',true)}
	else{$("#other_diet").attr('checked',false)};
	}
	
}


//Enables us to add a recipe to a meal already created
Template.recipe_input.events({
'click #add_recipe': function(){

	//Checks that a recipe name has been given
	if ($("#recipe_name").val()){

	//If this recipe is an edit
	if(Session.get('editing_recipe')){

	Meals.update({_id: Session.get('editing_recipe')},{
	$set:
	{
	recipe_name: $("#recipe_name").val(),
	recipe_url: $("#recipe_url").val(),
	recipe_notes: $("#recipe_notes").val(),	
	}
	})

	//Sets the Session back to the unediting state
	Session.set('editing_recipe', null);
	}

	//If this recipe is new
	else{

	//Passes data from the form to a new document in the Collection
	Meals.insert({
	type: "recipe",
	meal_id: Session.get('meal_id'),
	recipe_name: $("#recipe_name").val(),
	recipe_url: $("#recipe_url").val(),
	recipe_notes: $("#recipe_notes").val()})

	//Resets the form so the fields show blank
	$("#recipe_name").val('');
	$("#recipe_url").val('');
	$("#recipe_notes").val('');
}

}

	//If you forgot to put in a recipe name
	else{alert("Remember to enter a recipe name!")}
}});

Template.recipe_list.helpers({

	//Creates a list of recipes to display on the meal-planning page
	list: function(){

	//Checks that there is at least one recipe
	if(Meals.findOne({_id: Session.get('meal_id')})){

	//Searches for recipes
	return Meals.find({meal_id: Session.get('meal_id'), type: "recipe"})}
},

	//In the event that there are no recipes to find
	no_recipes: function(){
    if(Meals.findOne({_id: Session.get('meal_id')})&& !Meals.findOne({meal_id: Session.get('meal_id'), type: "recipe"})){
    return 'no recipes yet'
}
}
});


Template.recipe_list.events({
	//Allows you to delete a recipe
	'click .delete_recipe': function(){

	//Checks if you meant to do this
	check=prompt('Are you sure you want to delete this recipe? (yes or no)')
	if(check==='y' || check==='Y' || check==='yes' || check==='Yes' || check==='YES'){
	
	//If so, deletes the recipe
	Meals.remove(this._id)
	}
},

});





// MY MEALS

Template.my_meals.helpers({

	my_active_meals: function(){
	var now_corrected=$.now()-86400000;
	if (Meteor.userId()){
		return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, date_order: {$gt: now_corrected}}, {sort: {date_order: 1}})
		}
	},

	count_active_meals: function(){
	var now_corrected=$.now()-86400000;
	if (Meteor.userId()){
		return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, date_order: {$gt: now_corrected}}).count()
		}
	},

	my_past_meals: function(){
	var now_corrected=$.now()-86400000;
	if (Meteor.userId()){
		return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, date_order: {$lt: now_corrected}}, {sort: {date_order: 1}})
		}
	},

	count_past_meals: function(){
	var now_corrected=$.now()-86400000;
	if (Meteor.userId()){
		return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, date_order: {$lt: now_corrected}}).count()
		}
	},

	my_recipe_names: function(){
	var mealid=this.meal_id;
	return Meals.find({meal_id: mealid, type: "recipe"});
	},

	no_my_recipes: function(){
	var mealid=this.meal_id;
	if(Meals.findOne({meal_id: mealid, type: "recipe"}))
	{return false}
	else{return true}
	},

	my_cook_names: function(){
	var mealid=this.meal_id;
	return Meals.find({meal_id: mealid, type: "cook"});
	},
	
	'plan_my_meal_type': function(){
	var mealid=this.meal_id;
	return "plan_"+Meals.findOne({_id: mealid}).meal_type;
	},

	});


Template.my_meals.events({
'click .delete_meal': function(){

	//Checks if you meant to do this
	check=prompt('Are you sure you want to delete this meal? (yes or no)')
	if(check==='y' || check==='Y' || check==='yes' || check==='Yes' || check==='YES'){
	
	//If so, starts the process of deletion
	var mealid=this.meal_id;

	//Sets the Session to enable a call to the server
	Session.set('meal_id', Meals.findOne({_id: mealid})._id);

	//Calls to the server to delete the multiple documents involved,
	//since the client is allowed to delete only one at a time.
	Meteor.call('delete_meal',Session.get('meal_id'));

	//Cleans up the Session
	Session.set('meal_status',null);
	Session.set('meal_id',null);
	}
},

'click .unjoin_meal': function(){
// Removes the cook who decided to leave
	Meals.remove(this._id);
// Increases the count of cooks again
	Meals.update(this.meal_id, {$inc: {cooks_needed: 1}});
	alert('You are no longer signed up for this meal.')
},

'click .edit_meal': function(){

	//Sets the Session so that the editing page knows which meal to edit
	var mealid=this.meal_id;
	Session.set('meal_id', mealid);
	Session.set('meal_status','submitted');
	Session.set('meal_type', Meals.findOne({_id: mealid}).meal_type);
},
});






//HANDLEBARS


// Defines the lists of meals that occur after the present time,
//have spaces for cooks (though they may already include the present user)
Handlebars.registerHelper('open_breakfast_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "breakfast", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});
Handlebars.registerHelper('open_lunch_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "lunch", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});
Handlebars.registerHelper('open_dinner_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "dinner", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});
Handlebars.registerHelper('open_dessert_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "dessert", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});
Handlebars.registerHelper('open_other_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "other", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});
Handlebars.registerHelper('open_meal_list', function(){return Meals.find({type: "main", cooks_needed: {$gt: 0}, date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}});});

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_breakfast_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "breakfast", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_lunch_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "lunch", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_dinner_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "dinner", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_dessert_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "dessert", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_other_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, meal_type: "other", date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

//Determines the number of open meals
//(meals from the above lists that do not include the present user)
Handlebars.registerHelper('open_meal_test', function(){
	var counter=0;
	Meals.find({type: "main", cooks_needed: {$gt: 0}, date_order: {$gt: $.now()-86400000}}, {sort: {date_order: 1}}).forEach(function(myDoc)
	{
	var mealid=myDoc._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})==null)
	{counter+=1;}
	})
	return counter}
	);

Handlebars.registerHelper('test', function(){
	alert($("div.test_div").text())
}
);

Handlebars.registerHelper('plan_meal_type', function(){
	Session.set('meal_status','submitted');
	Session.set('meal_id',this._id);
	Session.set('meal_type',this.meal_type);
	return "plan_"+this.meal_type;
});

Handlebars.registerHelper('recipe_names', function(){
	var meal=this._id;
	return Meals.find({meal_id: meal, type: "recipe"});
});

//
Handlebars.registerHelper('cook_names', function(){
	var meal=this._id;
	return Meals.find({meal_id: meal, type: "cook"});
});
Handlebars.registerHelper('me', function(){
	return Meteor.users.findOne({_id: Meteor.userId()}).username
});
Handlebars.registerHelper('mecook', function(){
	var mealid=this._id;
	if(Meals.findOne({meal_id: mealid, cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username})){
		return true
	}
	else{return false}
});
Handlebars.registerHelper('mymeal', function(){
	var mealid=this.meal_id;
	return Meals.findOne({_id: mealid})
});

Handlebars.registerHelper('stat_started', function(){
	return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, chef: true}).count()
});

Handlebars.registerHelper('stat_total', function(){
	return Meals.find({cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username}).count()
});
Handlebars.registerHelper('username', function(){
	return Meteor.users.findOne({_id: Meteor.userId()}).username
});
Handlebars.registerHelper('output', function(){
    return Meals.findOne({_id: Session.get('meal_id')})
});
Handlebars.registerHelper('output_recipes', function(){
    return Meals.find({meal_id: Session.get('meal_id'), type: 'recipe'})
});
Handlebars.registerHelper('output_recipes_any', function(){
    return Meals.findOne({meal_id: Session.get('meal_id'), type: 'recipe'})
});
Handlebars.registerHelper('output_cooks', function(){
    return Meals.find({meal_id: Session.get('meal_id'), type: 'cook'})
});
Handlebars.registerHelper('output_messages', function(){
    return Meals.find({meal_id: Session.get('meal_id'), type: 'message'})
});
Handlebars.registerHelper('output_messages_any', function(){
    return Meals.findOne({meal_id: Session.get('meal_id'), type: 'message'})
});
Handlebars.registerHelper('cook_status', function(){
    if(Meals.findOne({meal_id: Session.get('meal_id'), cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, chef: true}))
    {return 'chef'}
    if(Meals.findOne({meal_id: Session.get('meal_id'), cook_name: Meteor.users.findOne({_id: Meteor.userId()}).username, chef: false}))
    {return 'cook'}
    else{return 'none'}
});

Handlebars.registerHelper('plan_output_meal_type', function(){
    var mealid=Session.get('meal_id');
	return "plan_"+Meals.findOne({_id: mealid}).meal_type;
});

Handlebars.registerHelper('message_editing', function(){
    return Session.get('message');
});

Handlebars.registerHelper('fetch_meal_type', function(){
    return Session.get('meal_type');
});

}