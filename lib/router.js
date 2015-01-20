Router.configure({ layoutTemplate: 'main_layout'
});

Router.map(function() { this.route('about_us', {path: '/about-us'})
});

Router.map(function() { this.route('my_meals', {path: '/my-meals'})
});

Router.map(function() { this.route('resources', {path: '/resources'})
});

Router.map(function() { this.route('view_meal', {path: '/view-meal',
	yieldTemplates: {'message_input': {to: 'message_input'},
}});
});

Router.map(function() { this.route('main', {path: '/'})
});

Router.map(function() { this.route('breakfast', {path: '/breakfast'})
});

Router.map(function() { this.route('plan_breakfast', {path: '/plan-breakfast',
	yieldTemplates: {'plan_meal': {to: 'plan_meal'},
'meal_input': {to: 'meal_input'},
'meal_output': {to: 'meal_output'},
'recipe_input': {to: 'recipe_input'},
'recipe_list': {to: 'recipe_list'},
}});
});
Router.map(function() { this.route('lunch', {path: '/lunch'});
});
Router.map(function() { this.route('plan_lunch', {path: '/plan-lunch',
	yieldTemplates: {'plan_meal': {to: 'plan_meal'},
'meal_input': {to: 'meal_input'},
'meal_output': {to: 'meal_output'},
'recipe_input': {to: 'recipe_input'},
'recipe_list': {to: 'recipe_list'},
}});
});
Router.map(function() { this.route('dinner', {path: '/dinner'});
});
Router.map(function() { this.route('plan_dinner', {path: '/plan-dinner',
	yieldTemplates: {'plan_meal': {to: 'plan_meal'},
'meal_input': {to: 'meal_input'},
'meal_output': {to: 'meal_output'},
'recipe_input': {to: 'recipe_input'},
'recipe_list': {to: 'recipe_list'},
}});
});
Router.map(function() { this.route('dessert', {path: '/dessert'});
});
Router.map(function() { this.route('plan_dessert', {path: '/plan-dessert',
	yieldTemplates: {'plan_meal': {to: 'plan_meal'},
'meal_input': {to: 'meal_input'},
'meal_output': {to: 'meal_output'},
'recipe_input': {to: 'recipe_input'},
'recipe_list': {to: 'recipe_list'},
}});
});
Router.map(function() { this.route('other', {path: '/other'});
});
Router.map(function() { this.route('plan_other', {path: '/plan-other',
	yieldTemplates: {'plan_meal': {to: 'plan_meal'},
'meal_input': {to: 'meal_input'},
'meal_output': {to: 'meal_output'},
'recipe_input': {to: 'recipe_input'},
'recipe_list': {to: 'recipe_list'},
}});
});