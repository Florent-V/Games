# Documentation Technique du Jeu Snake

Bienvenue dans cette documentation technique du jeu Snake ! L'objectif ici est de vous présenter de manière claire et détaillée la structure du jeu, les choix techniques effectués et le fonctionnement de chaque partie du code.

## 1. Philosophie d'Architecture : Séparer pour Mieux Régner

Avant d'explorer le code, il est essentiel de comprendre le concept de **séparation des responsabilités**. Chaque fichier de notre projet a un **rôle précis et unique**.

Pourquoi cette approche ?

- **Clarté** : On sait immédiatement où modifier un comportement spécifique.
- **Maintenance** : Modifier une partie du code (ex : l'affichage) n'affectera pas la logique du jeu.
- **Débogage** : Identifier et corriger un bug devient plus rapide.

On peut comparer notre code à une petite entreprise avec différents services :

- **`state/` (Le Cerveau)** : Contient la logique pure et les règles du jeu. Ne sait rien de l'affichage ou de Vue.js.
- **`composables/` (Le Système Nerveux)** : Fait le pont entre le "cerveau" et l'interface utilisateur. Gère la boucle de jeu et la réactivité.
- **`components/` (Les Yeux et les Mains)** : S'occupe uniquement de l'affichage (dessiner le jeu) et de la présentation.
- **`views/` (La Scène)** : Assemble tous les éléments pour créer l'expérience de jeu finale.
- **`constants.ts` et `types/` (Le Dictionnaire Commun)** : Partagent des informations et des définitions communes à tous les départements.

---

## 2. Plongée dans le Code

### Le Cerveau (`src/games/snake/state/`)

Ici se trouve la logique essentielle du jeu, écrite en TypeScript.

#### `Snake.ts` : La Classe du Serpent

Ce fichier définit le serpent et gère uniquement son état.

```typescript
class Snake {
  body: Coordinates[];
  direction: Direction;
  private directionQueue: Direction[] = [];
  private growthPending: number = 0;
}
```

- **`constructor()`** : À sa création, on initialise son corps avec 3 segments au centre du plateau.
- **`move()`** : C'est la méthode la plus importante. À chaque "tick" de la boucle de jeu, elle :
  1. Prend la prochaine direction dans `directionQueue` si présente.
  2. Calcule les coordonnées de la **nouvelle tête** du serpent.
  3. Ajoute cette tête au début du tableau `body`.
  4. Vérifie `growthPending`. Si ce compteur est supérieur à 0, cela signifie que le serpent a mangé récemment.
On laisse donc la queue à sa place (le serpent grandit d'un segment) et on décrémente le compteur. Si le compteur est à 0,
on supprime le dernier segment de la queue pour simuler le déplacement.
- **`grow()`** : Cette méthode est appelée quand le serpent mange. Elle ne fait **pas** grandir le serpent directement.
Elle se contente d'incrémenter `growthPending`. C'est une manière élégante de gérer une croissance différée.

#### `GameEngine.ts` : Le Maître du Jeu

Ce fichier applique les règles du jeu.

- **`update()`** : C'est la fonction appelée en boucle par notre "système nerveux".
    1. `this.snake.move()` : Ordonne au serpent de bouger.
    2. `this.snake.checkWallCollision()` / `checkSelfCollision()` : Vérifie si le serpent est entré en collision. Si oui, la partie est terminée (`isGameOver = true`).
    3. **Collision avec la nourriture** : Vérifie si la tête du serpent est sur la même case que la nourriture. Si oui :
        - `this.snake.grow()` : On dit au serpent qu'il doit grandir.
        - `this.score++` : On augmente le score.
        - `this.food = this.createFood()` : On génère une nouvelle nourriture à un autre endroit.

### Le Système Nerveux (`src/games/snake/composables/`)

#### `useSnakeGame.ts` : La Connexion à Vue.js

Un composable dans Vue 3 permet de gérer et partager de la logique réactive.

1.  **La Boucle de Jeu** : `setInterval(update, ...)` est le "métronome" du jeu. Toutes les 100 millisecondes, il exécute la fonction `update`.
2.  **La fonction `update()`** : C'est le chef d'orchestre du tick.
    - Elle appelle `gameEngine.update()` pour faire avancer la logique pure du jeu.
    - Elle appelle `syncState()` pour mettre à jour l'interface.
3.  **La fonction `syncState()`** : C'est un concept crucial. Le `gameEngine` n'est pas "réactif". Vue.js ne sait pas quand ses données changent. Cette fonction copie manuellement les données importantes du moteur (`snake.body`, `food`, `score`...) dans des variables réactives de Vue (`ref`). C'est cette copie qui dit à Vue : "Attention, les données ont changé, il faut mettre à jour l'affichage !".

### Focus sur le `<canvas>`

Cette section est importante, car le `<canvas>` fonctionne différemment des autres balises HTML.
C'est cette section qui permet de dessiner le serpent et la nourriture.

#### DOM vs Canvas : Deux Approches

- **Le DOM** : C'est comme construction en LEGO. Chaque élément (`<div>`, `<p>`, `<img>`) est une brique individuelle.
On peut la sélectionner, changer sa couleur, sa taille, la déplacer... Chaque brique existe en tant qu'objet.
C'est parfait pour des documents et des interfaces, mais si on veut animer des milliers de briques en même temps
(comme les milliers cases de la grille du jeu), cela serait trop gourmand en ressources.

- **Le Canvas** : Le canvas est une surface de dessin plate et vierge sous forme d'une grille de pixels.
On peut dessiner des formes, des images, du texte en coloriant des pixels... mais il n'y a pas d'objets individuels.
Si on veut "déplacer" une fome, on ne peut pas, on doit :
    1. **Effacer** la zone où se trouvait l'ancienne forme (en repeignant le fond par-dessus).
    2. **Dessiner** une nouvelle forme à la nouvelle position.

C'est un mode de rendu dit **"immédiat"**. C'est moins pratique pour des interfaces statiques,
mais beaucoup plus rapide pour des animations complexes, des jeux ou tout ce qui nécessite de dessiner un grand nombre d'éléments.

#### Concepts Clés

1.  **L'Élément HTML** : La balise elle-même est très simple. C'est juste un conteneur vide qui définit une zone de dessin.
    ```html
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    ```
2.  **Le Contexte de Rendu (`getContext('2d')`)** : Pour dessiner, il faut des outils. Le JavaScript les fournit via la méthode `getContext('2d')`.
C'est comme le fait de demander à la toile : "Donne-moi tes pinceaux, ta palette de couleurs et tes crayons pour dessiner en 2D".
Cet objet, que l'on nomme souvent `ctx`, contient toutes les fonctions de dessin.

3.  **Le Système de Coordonnées** : Le canvas est une grille. Le point `(0, 0)` se trouve dans le **coin supérieur gauche**.
L'axe des `x` augmente vers la droite, et l'axe des `y` augmente vers le **bas**.

4.  **Dessiner des Formes** : Le contexte `ctx` offre de nombreuses fonctions pour dessiner.
    - `ctx.fillStyle = 'red'` : Choisit la couleur de remplissage.
    - `ctx.strokeStyle = 'blue'` : Choisit la couleur du contour.
    - `ctx.fillRect(x, y, width, height)` : Dessine un rectangle **plein**.
    - `ctx.strokeRect(x, y, width, height)` : Dessine le **contour** d'un rectangle.
    - Il en existe beaucoup d'autres pour les lignes, les cercles (`arc`), le texte, etc.

5.  **L'Animation : La Boucle de Rendu**
L'animation est une illusion. On ne déplace pas vraiment des objets, on dessine une série d'images fixes légèrement différentes très rapidement.
Chaque image est une "frame". Le cycle pour chaque frame est toujours le même :

    **Effacer -> Mettre à jour les positions -> Dessiner**

Dans ce jeu, cette boucle est gérée par `setInterval` dans `useSnakeGame.ts`, qui appelle la fonction `update()`.
Cette fonction met à jour la logique, puis déclenche un redessin du canvas.

#### Application dans `GameBoard.vue`

Ces concepts sont appliqués dans le code de cette manière :

- **`onMounted()`** : Quand le composant est prêt, on prépare notre toile.
    - **La gestion des couleurs** : C'est ici qu'on utilise l'astuce du `div` invisible pour lire les couleurs du thème DaisyUI et les stocker dans des variables que le `ctx` peut comprendre.
    - **La gestion de la résolution (DPR)** : Les écrans modernes (Retina, etc.) ont plus de pixels physiques que de pixels logiques. Les lignes `dpr = window.devicePixelRatio` et `ctx.scale(dpr, dpr)` permettent de s'assurer que le dessin est net et non flou sur ces écrans haute résolution.

- **`draw()`** : C'est la fonction "artiste" qui exécute le cycle de rendu.
    1.  **Effacer** : `ctx.fillStyle = colors.value.base300; ctx.fillRect(0, 0, canvas.width, canvas.height);` On recouvre tout le canvas avec la couleur de fond.
    2.  **Mettre à jour et Dessiner** : On parcourt les tableaux `snakeBody` et `food` (qui contiennent les positions logiques à jour) et on dessine un rectangle pour chaque élément avec `ctx.fillRect()`.
On utilise le `scale` pour convertir les coordonnées logiques (ex: 25, 40) en coordonnées de pixels.

- **`watch()`** : C'est le lien avec le système de réactivité de Vue. On lui dit : "Dès que les données `snakeBody` ou `food` changent, exécute à nouveau la fonction `draw()`". C'est ce qui garantit que notre dessin est toujours synchronisé avec l'état du jeu.

### La Scène (`src/games/snake/views/SnakeView.vue`)

Ce composant est le plus simple. C'est un simple assembleur :
- Il appelle le composable `useSnakeGame()` pour démarrer le jeu et récupérer les données réactives.
- Il affiche le score et le message "Game Over".
- Il place le composant `GameBoard` et lui transmet les données (`snakeBody`, `food`) à dessiner.

---

## 3. Résumé du Flux de Données

Le cycle de vie d'une action de jeu est le suivant :

1.  **Input** : Le joueur appuie sur une touche (`ArrowUp`).
2.  **Handler** : `useInputHandler` capture l'événement.
3.  **Logique** : Il appelle `snake.changeDirection('Up')`.
4.  **Boucle de Jeu** : Au prochain tick, `gameEngine.update()` appelle `snake.move()`.
5.  **Mise à jour de l'état** : Le corps du serpent est mis à jour dans le `gameEngine`.
6.  **Synchronisation** : `syncState()` copie le nouveau `snake.body` dans la variable réactive de `useSnakeGame`.
7.  **Déclenchement du Rendu** : Le `watch` dans `GameBoard.vue` détecte le changement et appelle `draw()`.
8.  **Affichage** : Le canvas est effacé et redessiné avec la nouvelle position du serpent.

Ce cycle se répète 10 fois par seconde, créant l'illusion du mouvement.
