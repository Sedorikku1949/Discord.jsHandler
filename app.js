const Client = require("./_managers/Client");

const client = new Client({
	intents: 79743,
	partials: ["CHANNEL"],
	fetchAllMembers: true,
	allowedMentions: { repliedUser: false },
	retryLimit: 5,
	invalidRequestWarningInterval: 10,
	inAppEval: true
});

client.start();