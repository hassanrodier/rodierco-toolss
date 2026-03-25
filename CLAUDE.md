# CLAUDE.md — RodierCo Content Studio

Documentation de référence pour le développement du tableau de bord de gestion de contenu RodierCo.

---

## Pile technologique

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 14.2.5 | Framework React (App Router) |
| **React** | 18 | UI |
| **TypeScript** | 5 | Typage statique |
| **Tailwind CSS** | 3.4.1 | Styles utilitaires |
| **shadcn/ui** | — | Bibliothèque de composants (Radix UI + CVA) |
| **Lucide React** | 0.400+ | Icônes |
| **class-variance-authority** | 0.7 | Variantes de composants |
| **clsx + tailwind-merge** | — | Fusion de classes CSS |

---

## Structure des dossiers

```
rodierco-toolss/
├── app/                          # App Router Next.js
│   ├── layout.tsx                # Layout racine — sidebar + thème sombre
│   ├── page.tsx                  # Dashboard principal
│   ├── globals.css               # Variables CSS + thème sombre global
│   ├── instagram/
│   │   └── page.tsx              # Gestionnaire Instagram
│   ├── analyse/
│   │   └── page.tsx              # Analyse & métriques
│   ├── calendrier/
│   │   └── page.tsx              # Calendrier de contenu
│   ├── concurrents/
│   │   └── page.tsx              # Traqueur de concurrents
│   └── stockage/
│       └── page.tsx              # Stockage vidéos/carrousels/stories
│
├── components/
│   ├── sidebar.tsx               # Navigation latérale partagée
│   ├── page-header.tsx           # En-tête de page réutilisable
│   ├── stat-card.tsx             # Carte de statistique réutilisable
│   ├── placeholder-section.tsx   # Section "en développement"
│   └── ui/                       # Composants shadcn/ui
│       ├── button.tsx
│       ├── badge.tsx
│       └── separator.tsx
│
├── lib/
│   └── utils.ts                  # Utilitaire cn() (clsx + twMerge)
│
├── tailwind.config.ts            # Config Tailwind avec tokens CSS
├── tsconfig.json                 # Config TypeScript avec alias @/*
├── next.config.mjs               # Config Next.js
├── postcss.config.mjs            # Config PostCSS
└── package.json
```

---

## Thème sombre

Le thème sombre est **global et permanent** — il n'y a pas de mode clair.

- `<html>` reçoit la classe `dark` dans `app/layout.tsx`
- Toutes les couleurs sont définies via des variables CSS dans `app/globals.css`
- Palette principale :
  - **Background** : `hsl(222 47% 6%)` — bleu-gris très foncé
  - **Card** : `hsl(222 47% 9%)` — légèrement plus clair
  - **Sidebar** : `hsl(222 47% 7%)` — intermédiaire
  - **Primary** : `hsl(262 83% 58%)` — violet vibrant
  - **Muted** : `hsl(222 47% 12%)` — éléments discrets

---

## Normes de composants

### Règles générales

1. **Tous les composants sont en TypeScript** avec interfaces explicites pour les props
2. **`"use client"`** uniquement si nécessaire (hooks, événements navigateur) — les composants serveur sont favorisés
3. **Alias `@/`** pour tous les imports internes (ex : `@/components/sidebar`)
4. **`cn()`** pour toutes les concaténations de classes Tailwind (évite les conflits)

### Composants utilitaires disponibles

| Composant | Usage |
|---|---|
| `<PageHeader>` | En-tête standardisé avec icône, titre, description et slot d'actions |
| `<StatCard>` | Carte KPI avec valeur, tendance et icône |
| `<PlaceholderSection>` | Section "en développement" avec liste de fonctionnalités à venir |
| `<Sidebar>` | Navigation latérale — s'active automatiquement sur la route courante |

### Convention de nommage

- **Fichiers** : `kebab-case.tsx` pour les composants, `kebab-case.ts` pour les utilitaires
- **Composants** : `PascalCase`
- **Props interfaces** : suffixe `Props` (ex : `StatCardProps`)
- **Fonctions utilitaires** : `camelCase`

### Couleurs sémantiques par section

Chaque section a une couleur d'accentuation cohérente :

| Section | Couleur | Classe Tailwind |
|---|---|---|
| Instagram | Rose | `text-pink-400` / `bg-pink-400/10` |
| Analyse | Bleu | `text-blue-400` / `bg-blue-400/10` |
| Calendrier | Violet | `text-violet-400` / `bg-violet-400/10` |
| Concurrents | Ambre | `text-amber-400` / `bg-amber-400/10` |
| Stockage | Émeraude | `text-emerald-400` / `bg-emerald-400/10` |

---

## Décisions d'architecture

### App Router (Next.js 14)
Choix de l'App Router plutôt que Pages Router pour :
- Meilleure gestion des layouts imbriqués (sidebar partagée via `layout.tsx`)
- Support natif des Server Components
- Meilleure performance avec le streaming

### shadcn/ui vs bibliothèque complète
shadcn/ui a été choisi car il fournit du code source modifiable directement dans le projet (non une dépendance opaque). Seuls les composants nécessaires sont inclus — pas d'installation d'une librairie entière.

### Sidebar dans le layout racine
La `<Sidebar>` est placée dans `app/layout.tsx` pour être partagée entre toutes les routes sans duplication. Elle utilise `usePathname()` pour détecter la route active (`"use client"` requis uniquement pour ce composant).

### Données fictives (mock data)
Toutes les données affichées sont fictives et codées en dur dans les pages. Lors de l'intégration d'une API (Instagram Graph API, etc.), elles devront être remplacées par des fetch côté serveur ou des hooks côté client.

### Pas de state management global pour l'instant
Aucun Redux / Zustand / Context global n'est configuré. L'état sera ajouté localement par page à mesure que les fonctionnalités réelles seront développées.

---

## Routes de l'application

| Route | Page |
|---|---|
| `/` | Dashboard principal |
| `/instagram` | Gestionnaire Instagram |
| `/analyse` | Analyse & métriques |
| `/calendrier` | Calendrier de contenu |
| `/concurrents` | Traqueur de concurrents |
| `/stockage` | Stockage vidéos/carrousels/stories |

---

## Lancer le projet

```bash
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build   # Build de production
npm run lint    # Linter ESLint
```

---

## Prochaines étapes suggérées

- [ ] Intégration Instagram Graph API (publications, métriques)
- [ ] Backend API Routes Next.js ou service externe (Supabase, PlanetScale)
- [ ] Authentification (NextAuth.js)
- [ ] Graphiques réels (Recharts ou Chart.js)
- [ ] Upload de fichiers (stockage cloud — S3, Cloudflare R2)
- [ ] Notifications temps réel (WebSockets ou SSE)
- [ ] Vue mensuelle du calendrier (drag & drop)
