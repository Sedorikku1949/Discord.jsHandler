
# Discord.js Handler
Un handler pour les bots Discord

## Pourquoi ? Il y en a plein
> Depuis les dernières mises à jours de discord.js, il est devenu extrèmement compliqué de créer un bot Discord avec les mêmes fonctionnalitées que avant
> Le plus dommage est que nous n'avons jamais vu quiconque créer un handler pour les nouvelles interactions !

## Qu'a-il de différent ?
> Pour ne citer que quelques différences :
> - Démarrage et restart sécurisé
> - Une structure optimisée et concu pour être manipulée facilement
> - Des handlers pour chaque type d'interaction avec le bot. ( boutons, commandes, select-menu, modals etc... )
> - Compatibilité avec les commandes classiques, commandes slashs et commandes utilisateurs
> - Une base de donnée rapide et conçu pour les bots petits et moyens
> - Une syntaxe améliorée
> - Un système de gestion des permissions amélioré et novateur
> - Une gestion des erreurs
> - Et encore plus...

## Est-ce que je peux l'utiliser ?
> Vous pouvez déjà l'utiliser, mais il n'est pas terminée et de nombreux problèmes peuvent survenir.
> Cependant, on accepterais avec joie votre aide dans la création de ce handler 😉

## Quels sont les objectifs ?
> - Pouvoir utiliser toutes les nouveautés de discord.js V13 tout en gardant les bonnes vieilles commandes
> - Avoir un handler sécurisé et optimisé.
> - Pouvoir offrir aux développeurs un handler personnalisable et avec une grande maniabilité et une large palette de possibilités
> - Amélioré la gestion des interactions telles que les boutons et select-menus, souvent mis au second plan.
> - Proposé un système de permissions innovant et fiable 

## Quels langages utilisés ?
> Nous utilisons le JavaScript, cependant, l'utilisation du C ou Rust est en réflexion pour pouvoir avoir une meilleure gestion des crashs.
> L'utilisation de ces deux languages permettrait entre autre de créer un auto redémarrage en cas d'erreur et un gestionnaire de ressources, qui serais la bienvenue.




# Comment l'installer ?
> Téléchargé le fichier .zip et dézipper le dans votre dossier.
> Ouvrer un terminal/shell et aller au dossier ( `cd` pour naviguer dans les dossiers, `pwd` pour avoir le dossier actuel )
> Une fois dans le terminal, suivés bien ces étapes :
```bash
// windows
// Vous devez installer les windows build tools, cependant, dans les dernières versions de Node ils sont déjà installés. On vous invite à vous renseigner dessus
npm i -g --add-python-to-path --vs2015 --production windows-build-tools
npm i -g node-gyp@latest

// Puis installé les modules utilisés
npm i 
//    /!\  Si des erreurs apparaissent, supprimer le dossier node_modules et installés manuellement chaque module.

// linux
// Vous devez installer les build tools, cependant, dans les dernières versions de Node ils sont déjà installés. On vous invite à vous renseigner dessus
sudo apt-get install build-essential

// Puis installé les modules utilisés
npm i 
//    /!\  Si des erreurs apparaissent, supprimer le dossier node_modules et installés manuellement chaque module.
```
> Une fois ceci fait, créés un fichier `config.json` dans la racine du projet, puis copiés ce code :
```json
{
  "evalAccess": ["votre id"],
  "prefix": "&",
  "token": "votre token ici"
}
```
> Remplissés les champs requis, donc `token` et `evalAccess`, le token est évidemment obligatoire, `evalAccess` permet de gérer les personnes qui ont accès à la commande eval ( executer du code via une commande, très dangereux sans sécurité ).

> Vous pouvez également personnaliser le préfix.

> L'installation est terminée, il vous suffit désormais de taper `node starter.js dev` dans la console pour démarrer le handler en mode "in progress" ou `node starter` pour le démarrer tout court.
