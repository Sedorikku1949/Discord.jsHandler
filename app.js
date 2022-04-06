const MainHandler = require("./_managers/Client");

const client = new MainHandler({
	intents: 79743,
	partials: ["CHANNEL"],
	fetchAllMembers: true,
	allowedMentions: { repliedUser: false },
	retryLimit: 5,
	invalidRequestWarningInterval: 10,
	inAppEval: true
});

client.start();