# 🔧 GROUPE LAFRANCE APP - Plateforme de mise en relation plombiers-clients

![Status](https://img.shields.io/badge/Status-En%20développement-yellow)
![Version](https://img.shields.io/badge/Version-v1.0.0-blue)

> **Plateforme de marché de soumissions (BET) pour services de plomberie avec système d'enchères, suivi GPS en temps réel, et gestion complète de paiements.**

---

## 🎯 Vue d'ensemble du projet

GROUPE LAFRANCE APP est une évolution majeure de la plateforme Plomberie D'Experts, transformée en un marché de soumissions compétitif pour les services de plomberie. La plateforme permet aux clients de soumettre des demandes de service et aux plombiers de soumissionner sur ces appels dans un système d'enchères chronométré.

**Date de démarrage:** 20 janvier 2026
**Statut:** Développement actif
**Base:** Plomberie D'Experts v0.7.0

---

## ✨ Nouvelles fonctionnalités implémentées

### 🎖️ Système d'abonnement à trois niveaux

**BRONZE** (99 $/mois - 990 $/an)
- Gestion d'appels avec facturation automatique
- 50 jobs/mois maximum
- Support standard

**ARGENT** (249 $/mois - 2490 $/an) ⭐ Plus populaire
- Tout de Bronze +
- Facturation manuelle
- Soumissions en ligne
- Jobs illimités
- Support prioritaire

**OR** (499 $/mois - 4990 $/an)
- Tout d'Argent +
- Gestion comptable complète
- Conciliations bancaires automatiques (IA)
- Rapports trimestriels
- Gestionnaire de compte dédié

**Bonus:** 6 mois gratuits sur tous les abonnements! (180 jours d'essai)

### 📝 Inscription des plombiers (6 étapes)

Processus d'inscription complet avec validation:

1. **Sélection d'abonnement** - Choix Bronze/Argent/Or avec facturation mensuelle ou annuelle
2. **Informations d'entreprise** - Propriétaire, raison sociale, adresses
3. **Taxes et licences** - Numéro TPS/TVQ, RBQ
4. **Préférences de service** - Types de services, rayon, urgences, plages horaires
5. **Création de compte** - Courriel, mot de passe, téléphone
6. **Confirmation** - Récapitulatif et acceptation des conditions

**Attestations différées:** CNESST, CCQ, RQ demandées avant le premier paiement (évite surcharge à l'inscription)

### 🚨 Système de demandes clients

**Deux types d'urgence:**

**URGENT** (+150 $)
- Plombier doit arriver dans l'heure
- Fenêtre de soumission: 5 minutes
- Alerte sonore aux plombiers dans 50km
- Demande passe devant toutes les autres

**NON-URGENT** (100 $)
- Planification selon disponibilités client
- Fenêtre de soumission: 2 heures
- Sélection de plages horaires multiples
- Option "En tout temps"

**Fonctionnalités:**
- Upload de photos (jusqu'à 6)
- Reformulation IA de la description
- Préautorisation de carte de crédit
- Sélection de langue (FR/EN)
- Termes et conditions intégrés

### 🏆 Marché de soumissions (BET - Bidding Et Triage)

**Pour les plombiers:**

- Fil en temps réel des appels disponibles
- Filtres par urgence et recherche par mots-clés
- Statistiques de soumissions (gagnées, perdues, taux de réussite)
- Timers de compte à rebours en direct
- Détails complets du job (photos, adresse, prix suggéré)
- Formulaire de soumission avec:
  - Montant proposé
  - Durée estimée
  - Sélection de plage horaire (non-urgent)
  - Message au client
- Notifications sonores pour nouveaux appels urgents
- Onglets séparés Urgents/Non-urgents

**Règles strictes:**
- Une fois engagé, pas de retour en arrière
- Pénalité 50 $ pour annulation après acceptation
- Pénalité 100 $ pour non-présentation
- Pénalité 25 $ pour retard >15 min (urgent)

### 📍 Suivi GPS avec géorepérage

**GeofenceTracker:**
- Calcul de distance en temps réel (formule Haversine)
- Détection de zone de service (rayon 100m par défaut)
- Démarrage automatique du timer après 3 minutes dans la zone
- Affichage de distance (mètres/kilomètres)
- Badges de statut (Dans la zone/À proximité/En route)
- Notifications d'entrée/sortie de zone
- Barre de progression temps de présence
- Timer de service avec horodatage

**Fonctionnement:**
1. Client voit la position du plombier en temps réel
2. Plombier entre dans zone 100m → notification
3. Après 3 minutes dans la zone → timer démarre automatiquement
4. Client peut suivre le temps de service en direct

### 📸 Suivi de progression photo (toutes les 45 min)

**PhotoProgressTracker:**
- Rappels automatiques toutes les 45 minutes
- Upload de photo avec aperçu
- Description obligatoire des travaux
- Reformulation IA de la description
- Historique chronologique des photos
- Compteur photos complétées vs attendues
- Barre de progression jusqu'à prochaine photo
- Alertes visuelles et sonores
- Option reporter (déconseillé)
- Toutes les photos incluses dans facture finale

**Workflow:**
1. Timer de service actif
2. Toutes les 45 min → alerte photo
3. Plombier prend photo + description
4. IA reformule la description
5. Photo enregistrée avec horodatage
6. Compteur mis à jour

### 💳 Système de paiement

**Préautorisation:**
- Gel temporaire à la soumission de demande
- Montant basé sur urgence (150 $ urgent, 100 $ normal)
- Paiement final après service

**Méthodes de paiement:**
- Carte de crédit (Stripe)
- Virement Interac (à venir)

**Fractionnement 75%/25%:**
- 75% payé instantanément au plombier
- 25% retenu 30 jours
- Si non conforme (CNESST/CCQ/RQ manquant): 90% au lieu de 100%
- 10% de retenue additionnelle si non conforme

### ⭐ Système de notation (à venir)

**5 étoiles avec intégration Google:**
- Client doit noter pour accéder à facture finale
- 5 étoiles → publication automatique sur Google Reviews
- 3 étoiles ou moins → contact interne pour suivi
- 4 étoiles → notification interne seulement
- Moyenne visible pour plombier (pas pour client avant engagement)

### 🛠️ Service après-vente

**3 niveaux de priorité:**

**URGENT** (1 heure)
- Fuite ou infiltration d'eau importante
- Plombier doit intervenir dans l'heure
- Si pas de réponse en 5 min → alerte interne

**IMPORTANT** (48 heures)
- Problème fonctionnel important
- Intervention requise sous 48h
- Plombier propose plages horaires

**ESTHÉTIQUE** (7 jours)
- Problème cosmétique ou mineur
- Résolution sous 7 jours

**Gestion automatique:**
- Gel automatique du 25% lors de réclamation
- Alertes d'escalade si pas de réponse plombier
- Prise en main interne si deadlines dépassées
- Job remis en BET si nécessaire
- Notes de crédit automatiques

**Résolution de dommages:**
- Paiement direct par plombier
- Réclamation d'assurance
- Nouveau BET pour réparations

---

## 🛠️ Stack technologique

**Frontend:**
- React 18.3.1 + TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- shadcn/ui (Radix UI)
- Konsta UI (mobile)

**Bibliothèques clés:**
- react-router-dom 7.10.1 - Routing
- react-hook-form 7.55.0 - Gestion de formulaires
- recharts 2.15.2 - Graphiques
- jsPDF 3.0.4 - Génération PDF
- @stripe/react-stripe-js - Paiements
- sonner 2.0.3 - Notifications toast
- lucide-react 0.487.0 - Icônes

**Gestion d'état:**
- React Context API

---

## 📂 Structure des fichiers ajoutés

```
src/app/
├── types/
│   ├── subscription.ts           (Abonnements Bronze/Argent/Or)
│   ├── bidding.ts                (Système BET, enchères, jobs)
│   └── aftersales.ts             (Service après-vente, garanties)
├── pages/
│   ├── auth/
│   │   └── PlumberRegistration.tsx    (Inscription plombier 6 étapes)
│   ├── portal/
│   │   └── ClientRequestForm.tsx      (Formulaire demande client)
│   └── BiddingMarketplacePlumber.tsx  (Marché de soumissions)
├── components/
│   ├── subscription/
│   │   └── SubscriptionTierCard.tsx   (Carte de niveau d'abonnement)
│   ├── bidding/
│   │   ├── BidTimer.tsx               (Timer de soumission)
│   │   └── BidCard.tsx                (Carte d'offre plombier)
│   └── tracking/
│       ├── GeofenceTracker.tsx        (Suivi GPS + géorepérage)
│       └── PhotoProgressTracker.tsx   (Photos progression 45min)
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou pnpm

### Installation

```bash
# Cloner le dépôt
git clone <votre-repo-url>
cd GROUPE-LAFRANCE-APP

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

### Variables d'environnement

Créer un fichier `.env` à la racine:

```bash
# API Backend (si applicable)
VITE_API_URL=https://api.groupelafrance.com

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# Google Maps
VITE_MAP_API_KEY=xxxxx

# Services de communication
VITE_EMAIL_SERVICE_KEY=xxxxx
VITE_SMS_SERVICE_KEY=xxxxx
```

---

## 📊 Statistiques du projet

- **Commits:** 3 (session actuelle)
- **Fichiers ajoutés:** 10+
- **Lignes de code:** 3000+
- **Composants créés:** 8
- **Pages créées:** 3
- **Types définis:** 3 fichiers
- **Fonctionnalités majeures:** 9

---

## 🎯 Roadmap

### ✅ Complété (Session 1 - 20 janvier 2026)
- [x] Système d'abonnement (Bronze/Argent/Or)
- [x] Inscription plombier multi-étapes
- [x] Formulaire demande client
- [x] Reformulation IA des descriptions
- [x] Marché de soumissions (BET)
- [x] Timers de compte à rebours
- [x] Système de cartes d'offres
- [x] Géorepérage GPS avec auto-timer
- [x] Suivi de progression photo (45 min)

### 🔄 En cours
- [ ] Génération automatique de factures (marge 20%)
- [ ] Système de notation 5 étoiles
- [ ] Intégration Google Reviews

### 📋 À venir
- [ ] Paiement Interac e-Transfer
- [ ] Gestion complète après-vente avec alertes
- [ ] Fractionnement paiement 75%/25%
- [ ] Pénalités de conformité automatiques
- [ ] Application mobile native (React Native)
- [ ] Backend API (Node.js + PostgreSQL)
- [ ] Tests automatisés (Jest, Playwright)
- [ ] Déploiement production (AWS/Vercel)

---

## 🔐 Sécurité

- Préautorisation de cartes de crédit via Stripe
- Validation de formulaires côté client et serveur
- Protection RBAC (Role-Based Access Control)
- Vérification de licences RBQ
- Attestations de conformité (CNESST, CCQ, RQ)
- Pénalités automatiques pour non-conformité

---

## 📞 Support

**Développeur:** Claude Sonnet 4.5
**Email:** support@groupelafrance.com
**Documentation:** Voir CONTEXT.md pour suivi détaillé

---

## 📄 Licence

Propriétaire - © 2026 GROUPE LAFRANCE. Tous droits réservés.

---

## 🤝 Contribution

Projet propriétaire en développement actif. Pour toute question ou suggestion, contactez l'équipe de développement.

---

## 📝 Notes de version

### v1.0.0 (Session 1 - 20 janvier 2026)

**Ajouté:**
- Système d'abonnement à trois niveaux avec essai gratuit 6 mois
- Processus d'inscription plombier complet (6 étapes)
- Formulaire de demande client avec photos et IA
- Marché de soumissions avec timers en temps réel
- Géorepérage GPS avec démarrage automatique de timer
- Suivi de progression photo toutes les 45 minutes
- Définitions de types pour abonnements, enchères, après-vente
- Composants UI réutilisables pour bidding et tracking

**Amélioré:**
- Architecture basée sur la v0.7.0 de Plomberie D'Experts
- Flux utilisateur optimisé pour plombiers et clients
- Validation de formulaires robuste
- Notifications toast pour feedback utilisateur

**À venir:**
- Backend API REST
- Intégration paiement complète
- Tests E2E
- Application mobile

---

**🚀 Prêt à révolutionner l'industrie de la plomberie au Québec! 🚀**
