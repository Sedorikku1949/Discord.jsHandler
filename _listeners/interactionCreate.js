const { Modal } = require("discord-modals")

module.exports = async function interactionCreate(interaction){
	if (interaction.isCommand()) return database.managers.commands.execute(interaction, ({ name: interaction.commandName, authorId: interaction.user.id }));
	else if (interaction.isButton()) return database.managers.buttons.execute(interaction);
	else if (interaction.isSelectMenu()) return void 0;
	else if (interaction instanceof Modal) return void 0;
}