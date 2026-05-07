# Clothes App — TP Programmation mobile multiplateforme

## Membres de l’équipe
- Djenabou Diallo
- Ajouter les autres membres ici

---

# Description du projet

Clothes App est une application mobile développée avec NativeScript connectée à une API RESTful Express.js et MySQL.

Le projet permet :
- l’inscription d’un utilisateur
- la connexion
- la gestion d’authentification JWT
- l’affichage d’un profil utilisateur
- la déconnexion
- une page Home avec des vêtements

---

# Technologies utilisées

## Backend API
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- dotenv
- cors

## Mobile
- NativeScript JavaScript
- Android Emulator

---

# Structure du projet

```text
project/
│
├── api/
│
├── mobile/
│   └── clothes-mobile-app/
```
---

# Fonctionnalités de l’application mobile

## Register
- Création d’un compte utilisateur
- Validation des champs
- Messages d’erreur

## Login
- Connexion utilisateur
- JWT sauvegardé
- Navigation vers Home

## Home
- Affichage de vêtements :
  - T-Shirts
  - Hoodies
  - Jeans
  - Sneakers

## Profile
- Affichage du nom
- Affichage de l’email

## Logout
- Suppression du token JWT
- Retour vers Login

---

# Sécurité

- Mots de passe hashés avec bcrypt
- JWT utilisé pour l’authentification
- Secrets protégés avec .env
- Aucune donnée sensible commitée

---

# Collection Postman

La collection Postman inclut :
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /users/me

---

# Captures d’écran

Ajouter ici :
- Register
- Login
- Home
- Profile
- Logout


# Améliorations futures

- Ajout d’une vraie boutique dynamique
- Ajout des produits depuis MySQL
- Ajout d’images réelles
- Ajout d’un panier
- Ajout d’une recherche

---

# Conclusion

Ce projet nous a permis de développer une application mobile NativeScript connectée à une API Express.js avec authentification JWT et base de données MySQL.
