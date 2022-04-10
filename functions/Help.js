const Command = require("../_managers/structures/Command");

function classByCategories(commands, categories, sommaire = true) {
	const [ctg, cmd] = [{}, [...commands].map(([_, v]) => v)];
	categories.map(({ code }) => ctg[code] = cmd.filter(({config}) => config.category === code));
	if (!sommaire) return ctg;
	else return { __sommaire: categories.map(({ code }) => code), ...ctg };
}

/**
 *
 * @param ctg
 * @param actualCategory
 * @returns {String}
 */
function generateCategoryStringList(ctg, actualCategory) {
	if (!Array.isArray(ctg) || ctg.some(({ name }) => typeof name !== "string"))  throw new Error("Invalid categories was provided, cannot generate category string list");
	if (isNaN(actualCategory))  throw new Error("Invalid actual category was provided, cannot generate category string list");
	const goto = Number(actualCategory) + 1;
	return ctg
			.map((t, i, arr) =>
					(goto === 1 && i === 2 ? false : i > goto) ||
					(goto === arr.length && i === arr.length - 3 ? false : i < goto - 2)
							? (goto === arr.length ? i === goto - 4 : i === goto - 3)
									? `(+${i + 1})`
									: (goto === 1 ? i === goto + 2 : i === goto + 1)
											? `(+${arr.length - i})`
											: false
							: i + 1 === goto
									? `**__${t["name"]}__**`
									: `\`${t["name"]}\``
			)
			.filter(Boolean)
			.join(" - ");
}

function generateSommaire(categories, interactionClass, guild, author){
	const msg = interactionClass.translate(
			guild.getLang(), "commands['help'].assets.pattern",
			interactionClass.translate(guild.getLang(), "misc.colors.primary"),
			interactionClass.translate(guild.getLang(), "commands['help'].misc.patternAuthorName.sommaire"),
			guild.iconURL({ size: 512, format: "png" }),
			generateCategoryStringList(categories, 0),
			categories.map(({ name }, index) => `${index+1}. ${name}`).join("\n"),
			client.user.tag, client.user.displayAvatarURL({ size: 512, format: "png" }),
	);
	msg.components = generateComponents(categories, ({ name: "Sommaire", code: "sommaire" }), 0, interactionClass, guild, author, false);
	return msg;
}

function generateComponents(categories, actualCtg, ctgIndex, interactionClass, guild, author, search){
	const select = interactionClass.translate(guild.getLang(), "commands['help'].misc.selectMenu", ctgIndex, author.id);
	categories.filter(({ code }) => code !== actualCtg["code"])
			.forEach(({ code, name }) => select.components[0].options.push(interactionClass.translate(guild.getLang(), "commands['help'].misc.selectMenuOptions", name, code)));
	const buttons = interactionClass.translate(guild.getLang(), "commands['help'].misc.buttons", ctgIndex, author.id, database.emojis.undo?.id || '⬅️', database.emojis.redo?.id || "➡️", database.emojis.search?.id || "🔎", database.emojis.trash?.id || "🗑️");
	const index = buttons.components.findIndex(({ customId }) => (/^HELP_SEARCH/).test(customId));
	if (!search && index >= 0) buttons.components[index].disabled = true;
	if (search && index >= 0) buttons.components[index].disabled = false;
	return [ select, buttons ];
}

function generateMessage(commands, categories, ctgIndex, guild, author, interactionClass){
	const actualCtg = categories[ctgIndex];
	if (!actualCtg || !actualCtg["code"] || !actualCtg["name"]) return ({ content: "> :x: **An error occurred, i can't fetch the categories.**", ephemeral: true });
	const cmd = commands.filter(({ config }) => config.category === actualCtg["code"]).map((c, index) => `${index+1}. ${c?.config?.name || "ERROR"}`)
	const msg = interactionClass.translate(
			guild.getLang(), "commands['help'].assets.pattern",
			interactionClass.translate(guild.getLang(), "misc.colors.primary"),
			(actualCtg["code"] === "sommaire" ? interactionClass.translate(guild.getLang(), "commands['help'].misc.patternAuthorName.sommaire") : interactionClass.translate(guild.getLang(), "commands['help'].misc.patternAuthorName.commands")),
			guild.iconURL({ size: 512, format: "png" }),
			generateCategoryStringList(categories, ctgIndex),
			cmd.length > 0 ? cmd.join("\n") : interactionClass.translate(guild.getLang(), "commands['help'].misc.noCommand"),
			client.user.tag, client.user.displayAvatarURL({ size: 512, format: "png" }),
	);
	msg.components = generateComponents(categories, actualCtg, ctgIndex, interactionClass, guild, author, true);
	return msg;
}

function generateSpecificCommandPage(commandName, interactionClass, author, guild){
	const command = database.interactions.cmd.get(commandName);
	const categories = interactionClass.translate("fr", "misc.categories");
	if (!command || !(command instanceof Command)) return interactionClass.translate(guild.getLang(), "commands['help'].misc.commandNotFound");
	else return interactionClass.translate(
			guild.getLang(), "commands['help'].assets.specificCommand",
			interactionClass.translate(guild.getLang(), "misc.colors.primary"),
			client.user.tag, client.user.displayAvatarURL({ size: 512, format: "png" }),
			(command.config.name || commandName),
			command.config.aliases.length > 0 ? command.config.aliases.join(" / ") : interactionClass.translate(guild.getLang(), "commands['help'].misc.noAliase"),
			(categories.find(({ code }) => code === command.config.category)?.name || interactionClass.translate(guild.getLang(), "commands['help'].misc.noCategory")),
			(interactionClass.translate(guild.getLang(), `commands['${command.config.name}'].description`) || interactionClass.translate(guild.getLang(), "commands['help'].misc.noDescription")),
			(interactionClass.translate(guild.getLang(), `commands['${command.config.name}'].use`, guild.getPrefix()) || interactionClass.translate(guild.getLang(), "commands['help'].misc.noUse")),
	)
}

module.exports = {
  classByCategories,
  generateMessage,
  generateSommaire,
	generateCategoryStringList,
	generateSpecificCommandPage
};
