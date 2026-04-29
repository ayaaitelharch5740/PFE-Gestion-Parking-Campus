# 🅿️ ParkCampus — Système de Gestion de Parking

> **Projet de Fin de Module (PFM) — ENS Marrakech, Département Informatique**  
> Module : Mobile 2 — Applications Multi-Plateformes Orientées Services

<img width="1887" height="882" alt="image" src="https://github.com/user-attachments/assets/bca39b1e-5235-4380-986a-d830bfffd359" />

---

## 📋 Table des Matières

1. [Présentation du Projet](#-présentation-du-projet)
2. [Architecture Globale](#-architecture-globale)
3. [Technologies Utilisées](#-technologies-utilisées)
4. [Structure du Projet](#-structure-du-projet)
5. [Base de Données](#-base-de-données)
6. [API Backend (Node.js / Express)](#-api-backend-nodejs--express)
7. [Interface Web React (Admin)](#-interface-web-react-admin)
8. [Application Mobile (React Native)](#-application-mobile-react-native)
9. [Installation & Lancement](#-installation--lancement)
10. [Variables d'Environnement](#-variables-denvironnement)
11. [Démonstration](#-démonstration)
12. [Sécurité](#-sécurité)
13. [Auteurs](#-auteurs)

---

## 🎯 Présentation du Projet

**ParkCampus** est un système complet de gestion et de réservation de places de parking au sein du campus universitaire. Il permet aux étudiants et enseignants de consulter les disponibilités, réserver des créneaux, et gérer leurs véhicules — le tout depuis une application mobile ou via une interface web d'administration.

### Acteurs du système

| Rôle | Description |
|------|-------------|
| **Utilisateur** (étudiant / enseignant) | Gère ses véhicules, réserve et annule des places |
| **Agent parking** | Supervise les réservations et l'occupation en temps réel |
| **Administrateur** | Gestion complète : places, utilisateurs, statistiques |

---

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTS                                 │
│                                                             │
│   📱 React Native App          🌐 React Web Admin           │
│   (iOS / Android)              (Dashboard + CRUD)           │
└──────────────────┬──────────────────────┬───────────────────┘
                   │    HTTPS / REST       │
                   ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│               🖥️  Backend — Node.js / Express               │
│                                                             │
│   Auth JWT │ Controllers │ Services │ Routes │ Middlewares  │
│                      + Nodemailer                           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  🗄️  MySQL Database                         │
│   users │ vehicles │ parking_slots │ parking_reservations   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technologies Utilisées

### Backend
| Technologie | Rôle |
|-------------|------|
| **Node.js** | Environnement d'exécution |
| **Express.js** | Framework API REST |
| **MySQL2** | Base de données relationnelle |
| **JWT** (jsonwebtoken) | Authentification stateless |
| **Bcrypt** | Hashage des mots de passe |
| **Nodemailer** | Envoi d'emails (confirmations, alertes) |
| **Dotenv** | Gestion des variables d'environnement |
| **CORS** | Sécurité cross-origin |

### Frontend Web (Admin)
| Technologie | Rôle |
|-------------|------|
| **React** + **Vite** | Interface web SPA |
| **Axios** | Appels HTTP vers l'API |
| **React Router** | Navigation |
| **Recharts** | Graphiques et statistiques |
| **TailwindCSS** | Stylisation |

### Application Mobile
| Technologie | Rôle |
|-------------|------|
| **React Native** | Framework mobile cross-platform |
| **React Navigation** | Navigation entre écrans |
| **AsyncStorage** | Persistance locale (JWT) |
| **Axios** | Communication avec l'API |

---

## 📁 Structure du Projet

```
parkcampus/
│
├── backend/                        # Serveur Node.js / Express
│   ├── config/
│   │   └── db.js                   # Connexion MySQL
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── slotController.js
│   │   └── reservationController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js       # Vérification JWT
│   │   └── roleMiddleware.js       # Contrôle des rôles
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── slotRoutes.js
│   │   └── reservationRoutes.js
│   ├── services/
│   │   ├── mailService.js          # Nodemailer
│   │   └── reservationService.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend-web/                   # React Admin Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Slots.jsx
│   │   │   ├── Reservations.jsx
│   │   │   └── Users.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── mobile/                         # Application React Native
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.jsx
    │   │   ├── RegisterScreen.jsx
    │   │   ├── HomeScreen.jsx
    │   │   ├── VehiclesScreen.jsx
    │   │   ├── SlotsScreen.jsx
    │   │   ├── ReservationScreen.jsx
    │   │   └── MyReservationsScreen.jsx
    │   ├── navigation/
    │   │   └── AppNavigator.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── utils/
    │       └── storage.js
    ├── package.json
    └── App.jsx
```

---

## 🗄️ Base de Données

### Schéma (4 tables)

```sql
-- 1. Utilisateurs
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)        NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255)        NOT NULL,   -- bcrypt
  role        ENUM('user','agent','admin') DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Véhicules
CREATE TABLE vehicles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  plate       VARCHAR(20) UNIQUE NOT NULL,
  type        ENUM('car','motorcycle','truck') DEFAULT 'car',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Places de parking
CREATE TABLE parking_slots (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slot_number  VARCHAR(10) UNIQUE NOT NULL,
  zone         ENUM('A','B','C')  NOT NULL,
  type         ENUM('student','staff','visitor') DEFAULT 'student',
  is_available BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Réservations
CREATE TABLE parking_reservations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT      NOT NULL,
  vehicle_id INT      NOT NULL,
  slot_id    INT      NOT NULL,
  start_time DATETIME NOT NULL,
  end_time   DATETIME NOT NULL,
  status     ENUM('active','cancelled','completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (slot_id)    REFERENCES parking_slots(id),
  -- Empêche les double-réservations sur le même créneau
  UNIQUE KEY no_double_booking (slot_id, start_time, end_time)
);
```

---

## 🔌 API Backend (Node.js / Express)

### Endpoints disponibles

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| `POST` | `/api/auth/register` | Non | — | Inscription |
| `POST` | `/api/auth/login` | Non | — | Connexion + JWT |
| `GET` | `/api/vehicles` | Oui | user | Mes véhicules |
| `POST` | `/api/vehicles` | Oui | user | Ajouter un véhicule |
| `PUT` | `/api/vehicles/:id` | Oui | user | Modifier un véhicule |
| `DELETE` | `/api/vehicles/:id` | Oui | user | Supprimer un véhicule |
| `GET` | `/api/slots` | Oui | tous | Liste des places (filtrable par zone) |
| `POST` | `/api/slots` | Oui | admin | Créer une place |
| `PUT` | `/api/slots/:id` | Oui | admin | Modifier / maintenance |
| `DELETE` | `/api/slots/:id` | Oui | admin | Supprimer une place |
| `POST` | `/api/reservations` | Oui | user | Créer une réservation |
| `GET` | `/api/reservations/my` | Oui | user | Mes réservations |
| `PATCH` | `/api/reservations/:id/cancel` | Oui | user | Annuler une réservation |
| `GET` | `/api/reservations` | Oui | admin/agent | Toutes les réservations |
| `GET` | `/api/reservations/stats` | Oui | admin | Statistiques du tableau de bord |

### Règles métier appliquées côté serveur
- ❌ Une place ne peut pas être réservée deux fois sur le même créneau
- ❌ Un véhicule doit appartenir à l'utilisateur connecté
- ❌ Une place en maintenance n'est pas réservable
- ✅ Email de confirmation envoyé automatiquement via **Nodemailer**

---

## 🌐 Interface Web React (Admin)

### Fonctionnalités

**Dashboard**
- Taux d'occupation en temps réel (graphique Recharts)
- Nombre de réservations du jour
- Places les plus utilisées

**Gestion des Places**
- Tableau CRUD filtrable par zone (A / B / C)
- Toggle maintenance (activer / désactiver une place)
- Ajout / suppression de places

**Gestion des Réservations**
- Liste complète avec recherche par plaque, utilisateur ou date
- Export CSV
- Statuts colorés (active / annulée / terminée)

**Gestion des Utilisateurs**
- Liste avec rôles
- Modification de rôle (admin / agent / user)

---

## 📱 Application Mobile (React Native)

### Écrans et fonctionnalités

| Écran | Fonctionnalité |
|-------|----------------|
| **Login / Register** | Authentification → stockage JWT via AsyncStorage |
| **Accueil** | Résumé des réservations actives |
| **Mes Véhicules** | CRUD : ajouter / modifier plaque & type |
| **Places Disponibles** | Grille filtrée par zone — couleurs libres/occupées |
| **Réserver** | Sélection créneau → confirmation → email auto |
| **Mes Réservations** | Historique actif / passé + annulation |

---

## ⚙️ Installation & Lancement

### Prérequis
- Node.js ≥ 18
- MySQL ≥ 8
- npm ou yarn
- React Native CLI + Android Studio (pour le mobile)

---

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/parkcampus.git
cd parkcampus
```

---

### 2. Backend

```bash
cd backend
npm install
```

Créer la base de données :

```bash
mysql -u root -p < database/schema.sql
```

Configurer le `.env` (voir section suivante), puis :

```bash
npm run dev
# Serveur sur http://localhost:5000
```

---

### 3. Frontend Web (Admin)

```bash
cd frontend-web
npm install
npm run dev
# Interface sur http://localhost:5173
```

---

### 4. Application Mobile

```bash
cd mobile
npm install

# Android
npx react-native run-android

# iOS (macOS uniquement)
npx react-native run-ios
```

> ⚠️ Vérifier que l'adresse IP de l'API dans `mobile/src/services/api.js` correspond à votre machine locale (ex: `http://192.168.1.x:5000`).

---

## 🔐 Variables d'Environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
# Serveur
PORT=5000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=parkcampus

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRES_IN=7d

# Nodemailer (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre.email@gmail.com
MAIL_PASS=votre_mot_de_passe_application
MAIL_FROM="ParkCampus <votre.email@gmail.com>"
```

> 💡 Pour Gmail, activer la **validation en deux étapes** puis générer un **mot de passe d'application** dans les paramètres de sécurité Google.

---

## 🎬 Démonstration

### Flux utilisateur (Mobile)

https://github.com/user-attachments/assets/aed4c628-520a-4d96-8b8f-e546f0f04b56

```
1. Inscription / Connexion
       ↓
2. Ajout d'un véhicule (plaque + type)
       ↓
3. Consultation des places disponibles (filtre zone A/B/C)
       ↓
4. Sélection d'une place → choix du créneau
       ↓
5. Confirmation → Email automatique envoyé
       ↓
6. Consultation / Annulation dans "Mes Réservations"
```

### Flux administrateur (Web)


https://github.com/user-attachments/assets/feaafb21-cfae-4380-8dc4-b3115db6e5ad



```
1. Login admin
       ↓
2. Dashboard → taux d'occupation + stats du jour
       ↓
3. Gestion des places → ajout / maintenance / suppression
       ↓
4. Suivi des réservations → recherche / export
       ↓
5. Gestion des utilisateurs → attribution de rôles
```

### Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@campus.ma` | `Admin123!` | Administrateur |
| `agent@campus.ma` | `Agent123!` | Agent parking |
| `user@campus.ma` | `User123!` | Utilisateur |

---

## 🔒 Sécurité

| Mesure | Implémentation |
|--------|----------------|
| **Hashage mots de passe** | bcrypt (salt rounds: 12) |
| **Authentification** | JWT (access token, expiration configurable) |
| **Requêtes SQL** | Requêtes préparées via MySQL2 (anti-injection) |
| **CORS** | Configuré pour les origines autorisées uniquement |
| **Validation serveur** | Contrôle de toutes les entrées avant traitement |
| **Contrôle des rôles** | Middleware `roleMiddleware` sur chaque route sensible |

---

## 👥 Auteurs

| Nom | Rôle |
|-----|------|
| **AYA AIT EL HARCH** | Développement Full-Stack (Backend + Mobile + Web) |

**Encadrant :** MOHAMED LACHGAR  
**Établissement :** École Normale Supérieure de Marrakech — Département Informatique  
**Année universitaire :** 2025–2026

---

## 📄 Licence

Ce projet est réalisé dans le cadre d'un Projet de Fin de Module à l'ENS Marrakech.  
Usage académique uniquement.

---

*ParkCampus — Gérez votre parking, simplifiez votre campus.*
