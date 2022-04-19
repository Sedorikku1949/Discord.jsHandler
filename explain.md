## Certains demandent des explications plus poussées, et en voici une belle !
*attention, ca va être long*

## La structure en générale
Dans de nombreux bots, le handler se résume à un dossier qui contient les events, et un dossier avec le commandes.
Le problème est que, les boutons et select-menu sont souvent relayés au second plan !

> Voici un exemple des possibilités :

https://user-images.githubusercontent.com/73949405/164056025-6488cf49-627e-4337-86db-dc0f5fc105c6.mp4

Beaucoup diront que les boutons et select menu c'est long et chiant, et ils diront tous que une commande est simple !
Pourtant comme le prouve la vidéo au dessus, et ben, les possibilités de menu sont immenses ! Sans compter le fait que ce handler repose sur un système de langage.

> Maintenant, posons-nous une question :
> **Pourquoi il n'y a pas plusieurs sous-handlers ?**

Fou ? Non car on fait déjà ca pour les commandes ! 
Rien ne nous empèche de faire un handler pour les boutons et select menu ainsi que le reste, ca facilite la chose et les rends aussi atrayants que une bonne vieille commande !

> Voilà pourquoi ce handler est si particulier, car il est séparé en plusieurs parties:
- Les interactions: Commandes ( slash et classique ), Boutons, Select Menu
- Les évènements du client
- Les "managers" qui contiennent la structure même, le système de langue, les bases de données, les configurations etc...
- Le stockage - nommé "\_storage" dans ce handler - contient les données des Bases de Données, les configurations, les langues et tout ce qui peut être stocké
- Un dossier "rust_comp" que seul ceux qui connaissent le Rust auront l'utilité d'y toucher :joy:
- Le reste c'est soit des dossiers par défaut de Node, soit des fichiers pour tout lancer

# Comment le handler fonctionne ?

Bon on va commencer à la source !
Le premier fichier est `starter.js`, il va simplement executer `app.js`.

`app.js` est un peu comme le coeur du handler, il va créer le client à partir des éléments de `_managers/Client.js` et va le démarrer.

> Quand on s'intéresse à `_managers/Client.js`, on se rend compte que c'est une bête class !
> Au début, beaucoup de choses vont être importés, notamment d'autres class, des types de Discord.js, une pincée de fs et pour finir un soupcon de variables comme le token et le préfix ;)

Cette class est rattachée à la vrai class `Client` discord.js, et si vous ne connaissez pas, vous pouvez allés lire  la doc ici: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/extends

Donc, je ne vais pas ton expliqué car sinon Github ne va plus avoir d'espace sur ses serveurs, mais pour simplifier, il y a de nombreuses méthodes rajoutés qui permettent de charger les events, commandes et le reste.
On retrouve au début `prefix`, `utils` et `database` qui sont très importants, sachant que `database` contient en réalité TOUT !
Puis après, on va charger les events, puis les interactions ( commandes, boutons, select menus ) et pour finir les langues, après, on va ajouter au global le client et database ( https://nodejs.org/api/globals.html#global-objects ) et mettre à jour les managers  des boutons et select menu

*J'ai parlé de managers ? on revient dessus après !*

Pour finir, on va parler de l'arborescence de `_managers` et `_interactions`

> `_interactions` contient TOUTES les interactions, ce sont les bras et jambes du handler !
> On retrouve dedans les dossiers `cmd` ( contient les commandes ), `buttons` ( contient les boutons ) et `select_menu` ( les select menu simplement ).
> L'avantage est que, dans ce handler, il en a rien à faire des dossiers ! Tu peux avoir une commande dans 50 dossiers, le handler trouveras ta commande. ( mais on va éviter car c'est inutile )
> L'Object de configuration des interactions varie, mais ils possèdent tous la propriété `exec` qui contient l'executable !

Exemple de commande:
```js
Command {
  __translateArgs: [Array],
  lang: "commands['ping']",
  exec: [AsyncFunction (anonymous)],
  config: [Object],
  path: '_interactions/cmd/info/ping.js',
  __resolvedPath: 'Z:\\code\\kady\\KadyV2\\_interactions\\cmd\\info\\ping.js'
}
```
*la structure reste la même, les clés ne varient pas, mais leur contenu si !*
Exemple de configuration d'un bouton:
```js
{
  id: 'GUILD_ICON',
  name: 'GUILD_ICON',
  defer: false,
  permissions: [],
  path: 'Z:\\code\\kady\\KadyV2\\_interactions\\buttons\\server',
  lang: "buttons['GUILD_ICON']"
}
```
*il est plus gros sur les commandes*








