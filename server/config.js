Accounts.config({
	//restrictCreationByEmailDomain: 'mit.edu',
	restrictCreationByEmailDomain: function(email) {
	    var domain = email.slice(email.lastIndexOf("@")+1); // or regex
	    var allowed = ["mit.edu", "wellesley.edu"];
	    return _.contains(allowed, domain);
	  }
});

/*

Accounts.sendVerificationEmail(userID, [Email]);
Accounts.emailTemplates.siteName = "CookWithMe";
Accounts.emailTemplates.from = "CookWithMe Admin <accounts@cookwithme.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to CookWithMe, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};
*/