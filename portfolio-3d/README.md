# Portfolio 3D Interactif - Virgile Allix

Un portfolio immersif en 3D avec des graphismes époustouflants, créé avec Three.js. Explorez un univers virtuel pour découvrir mes projets et compétences de manière interactive.

## Caractéristiques

- **Environnement 3D immersif** : Explorez un monde 3D avec des contrôles à la première personne
- **Affichages de projets interactifs** : Chaque projet est représenté par un kiosque 3D lumineux avec des effets visuels
- **Effets visuels avancés** :
  - Éclairage dynamique avec point lights colorés
  - Système de particules flottantes
  - Ombres en temps réel
  - Effets de glow et de pulsation
  - Anneaux rotatifs autour des projets
  - Brouillard atmosphérique
- **Interface utilisateur élégante** : Panneaux d'information avec effet glassmorphism
- **Contrôles intuitifs** : Navigation fluide inspirée des jeux vidéo

## Technologies utilisées

- **Three.js** : Moteur de rendu 3D WebGL
- **PointerLockControls** : Contrôles de caméra à la première personne
- **HTML5/CSS3** : Interface utilisateur moderne
- **JavaScript (ES6+)** : Logique de l'application

## Comment utiliser

### Contrôles

- **Z/Q/S/D** ou **W/A/S/D** : Se déplacer
- **SOURIS** : Regarder autour de vous
- **ESPACE** : Sauter
- **E** : Interagir avec les projets (quand vous êtes proche)
- **CLIC GAUCHE** : Activer les contrôles

### Navigation

1. Ouvrez `index.html` dans un navigateur web moderne (Chrome, Firefox, Edge)
2. Cliquez n'importe où sur l'écran pour activer les contrôles
3. Explorez l'environnement en vous déplaçant vers les kiosques lumineux
4. Approchez-vous d'un projet (dans un rayon de 5 unités)
5. Appuyez sur **E** pour afficher les détails du projet
6. Fermez la fenêtre modale en cliquant sur le **X**

## Projets présentés

### 1. MT-Congés
**Type** : Application Java
- Gestion des congés pour MTB111
- Technologies : Java, Spring Boot, MySQL, JavaFX, Hibernate
- Position : Kiosque cyan à droite

### 2. Portfolio Personnel
**Type** : Développement Web
- Site web responsive avec mini-jeux
- Technologies : HTML, CSS, JavaScript, Three.js
- Position : Kiosque rouge à gauche

### 3. Assets de Jeu
**Type** : Modélisation 3D
- Création d'objets 3D pour jeux
- Technologies : Blender, 3D Modeling, UV Mapping
- Position : Kiosque turquoise devant

### 4. Système d'ouverture de caisse
**Type** : Application Web PHP
- Gestion des caisses et transactions
- Technologies : PHP, MySQL, HTML, CSS, JavaScript
- Position : Kiosque jaune derrière

### 5. Application Desktop
**Type** : Application Java
- Interface utilisateur JavaFX
- Technologies : Java, JavaFX
- Position : Kiosque vert à droite

## Installation et déploiement

### Déploiement local

1. Clonez ou téléchargez ce dossier
2. Ouvrez `index.html` dans votre navigateur

**Note** : Aucun serveur web n'est requis pour le développement local, mais certains navigateurs peuvent bloquer le chargement des modules ES6 en mode `file://`. Dans ce cas, utilisez un serveur local.

### Serveur local (optionnel)

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

### Déploiement sur GitHub Pages

1. Créez un nouveau repository sur GitHub
2. Ajoutez les fichiers du portfolio
3. Allez dans Settings > Pages
4. Sélectionnez la branche principale comme source
5. Votre portfolio sera accessible à `https://username.github.io/repository-name/`

## Structure du projet

```
portfolio-3d/
├── index.html          # Page principale avec l'UI
├── main.js             # Logique Three.js et contrôles
└── README.md           # Documentation
```

## Configuration requise

- Navigateur moderne avec support WebGL 2.0
- Carte graphique compatible avec WebGL
- JavaScript activé

### Navigateurs recommandés

- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

## Personnalisation

### Ajouter un nouveau projet

Dans `main.js`, ajoutez un nouvel objet au tableau `projects` :

```javascript
{
    id: 'mon-projet',
    name: 'Mon Nouveau Projet',
    category: 'Catégorie',
    description: 'Description du projet...',
    tech: ['Tech1', 'Tech2', 'Tech3'],
    position: { x: 0, y: 1, z: 15 },
    color: 0xff00ff
}
```

### Modifier les couleurs

Les couleurs sont définies en hexadécimal dans le code :
- `0x00d4ff` : Cyan
- `0xff6b6b` : Rouge
- `0x4ecdc4` : Turquoise
- `0xffe66d` : Jaune
- `0xa8e6cf` : Vert

### Ajuster la vitesse de déplacement

Dans la fonction `animate()`, modifiez les valeurs :
```javascript
if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta; // Vitesse avant/arrière
if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta; // Vitesse gauche/droite
```

## Performances

### Optimisations incluses

- Shadow mapping optimisé (2048x2048)
- Anti-aliasing activé
- Fog pour masquer le far clipping
- Géométries réutilisables
- Matériaux optimisés

### Conseils pour de meilleures performances

- Réduisez le nombre de particules si nécessaire
- Ajustez la résolution des ombres
- Diminuez la distance du fog

## Compatibilité mobile

Le portfolio est optimisé pour desktop. Pour une version mobile :
- Ajoutez des contrôles tactiles (joystick virtuel)
- Réduisez la complexité graphique
- Adaptez l'interface utilisateur

## Informations personnelles

**Virgile Allix**
- Âge : 18 ans
- Formation : BTS SIO SLAM (1ère année)
- Entreprise : MTB111
- Passions : Développement d'applications, cybersécurité, Java, web, modélisation 3D

## Licence

Ce projet est un portfolio personnel. Vous êtes libre de vous en inspirer pour votre propre portfolio.

## Support

Pour toute question ou suggestion, n'hésitez pas à me contacter via :
- LinkedIn : [Virgile Allix](https://linkedin.com/in/virgile-allix)
- GitHub : [@virgileallix](https://github.com/virgileallix)

---

**Créé avec passion par Virgile Allix** - Construction bloc par bloc, comme dans Minecraft !
