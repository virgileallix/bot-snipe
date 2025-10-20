# Roblox Item Sniper

Un site web pour monitorer et suivre les items limited Roblox en temps réel, avec filtres avancés et liens directs vers les pages d'achat.

## Fonctionnalités

- Affichage des items Limited et Limited U
- Filtres par type, prix et RAP (Recent Average Price)
- Tri par prix, RAP ou date
- Boutons de redirection vers les pages d'achat Roblox
- Interface moderne avec thème sombre
- Rafraîchissement automatique toutes les 5 minutes
- Statistiques en temps réel

## Installation

### Méthode 1: Ouvrir directement le fichier HTML

1. Clonez ce dépôt:
   ```bash
   git clone https://github.com/votre-username/bot-snipe.git
   cd bot-snipe
   ```

2. Ouvrez `index.html` dans votre navigateur web

### Méthode 2: Serveur local (recommandé)

1. Avec Python:
   ```bash
   python -m http.server 8000
   ```
   Puis ouvrez http://localhost:8000

2. Avec Node.js (npx):
   ```bash
   npx http-server
   ```

3. Avec PHP:
   ```bash
   php -S localhost:8000
   ```

## Utilisation

1. **Filtres disponibles:**
   - Type d'item (Tous, Limited, Limited U)
   - Prix minimum et maximum
   - RAP minimum et maximum
   - Options de tri (récents, prix, RAP)

2. **Acheter un item:**
   - Cliquez sur le bouton "Acheter sur Roblox"
   - Vous serez redirigé vers la page officielle de l'item sur Roblox
   - Connectez-vous à votre compte Roblox si nécessaire
   - Procédez à l'achat manuellement sur le site Roblox

3. **Rafraîchir les données:**
   - Cliquez sur le bouton "Rafraîchir"
   - Ou attendez le rafraîchissement automatique (toutes les 5 minutes)

## Structure du projet

```
bot-snipe/
├── index.html      # Page principale
├── styles.css      # Styles CSS
├── script.js       # Logique JavaScript et appels API
└── README.md       # Documentation
```

## API Roblox utilisées

- `catalog.roblox.com/v1/search/items` - Recherche d'items dans le catalogue
- `thumbnails.roblox.com` - Images des items

## Notes importantes

- Ce site utilise l'API publique de Roblox
- Les données RAP sont estimées (l'API Roblox ne fournit pas de RAP sans authentification)
- Les achats se font uniquement sur le site officiel Roblox
- Aucune automatisation des achats n'est effectuée
- Ce site n'est pas affilié à Roblox Corporation

## Limitations

- L'API Roblox peut avoir des limites de taux (rate limiting)
- Certaines données nécessitent une authentification Roblox (non implémentée)
- Les prix et disponibilités peuvent changer rapidement

## Améliorations futures possibles

- Système de notifications pour nouveaux items
- Historique des prix
- Graphiques de tendances
- Favoris et listes de surveillance
- Support de plus de catégories d'items

## Licence

MIT

## Disclaimer

Ce projet est à des fins éducatives uniquement. Respectez les conditions d'utilisation de Roblox lors de l'utilisation de ce site.