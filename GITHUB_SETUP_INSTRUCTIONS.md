# Instructions pour pousser vers GitHub

## Étape 1: Créer le dépôt sur GitHub

1. Allez sur https://github.com/new
2. Nom du dépôt: `GROUPE-LAFRANCE-APP`
3. Description: `Plateforme de marché de soumissions pour services de plomberie`
4. Choisir: **Private** (recommandé) ou Public
5. NE PAS initialiser avec README, .gitignore ou licence
6. Cliquer sur "Create repository"

## Étape 2: Connecter votre dépôt local au dépôt GitHub

Dans votre terminal, exécutez ces commandes:

```bash
# Assurez-vous d'être dans le bon répertoire
cd /Users/justinleanca/GROUPE-LAFRANCE-APP

# Ajouter le remote GitHub (remplacer USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/GROUPE-LAFRANCE-APP.git

# Vérifier que le remote a été ajouté
git remote -v

# Pousser le code vers GitHub
git push -u origin main
```

## Étape 3: Vérifier sur GitHub

1. Rafraîchir votre page GitHub
2. Vous devriez voir tous vos fichiers
3. Vérifier que les 4 commits sont présents

## Alternative: Utiliser SSH au lieu de HTTPS

Si vous avez configuré SSH avec GitHub:

```bash
# Ajouter le remote avec SSH
git remote add origin git@github.com:USERNAME/GROUPE-LAFRANCE-APP.git

# Pousser le code
git push -u origin main
```

## Commits actuellement dans le dépôt local:

1. ✅ `feat: Initialize GROUPE LAFRANCE APP platform`
2. ✅ `feat: Implement subscription tier system and plumber registration`
3. ✅ `feat: Implement client request system and bidding marketplace`
4. ✅ `feat: Implement GPS geofencing and photo progression tracking`

## Prochaines étapes après le push:

1. Configurer les GitHub Actions (CI/CD) - optionnel
2. Ajouter des collaborateurs si nécessaire
3. Configurer la protection de la branche main
4. Créer un fichier .env.example pour les variables d'environnement
5. Mettre à jour le README avec l'URL du dépôt

## Dépannage

### Si vous obtenez "error: remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/GROUPE-LAFRANCE-APP.git
```

### Si vous obtenez une erreur d'authentification

1. Assurez-vous d'être connecté à GitHub
2. Utilisez un Personal Access Token au lieu du mot de passe
3. Ou configurez SSH (recommandé)

### Pour configurer SSH:

```bash
# Générer une nouvelle clé SSH
ssh-keygen -t ed25519 -C "votre@email.com"

# Ajouter la clé à ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# Puis l'ajouter sur GitHub:
# Settings → SSH and GPG keys → New SSH key
```

---

**Note:** Remplacez `USERNAME` par votre nom d'utilisateur GitHub réel.
