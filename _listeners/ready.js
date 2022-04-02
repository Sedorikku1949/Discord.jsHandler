module.exports = async function(client){
	console.log(client.utils.colorized(`[$bClient$0] $m${client.user.tag}$0 is ready for work`));
	if (client.InAppEval) client.InAppEval(client);
}