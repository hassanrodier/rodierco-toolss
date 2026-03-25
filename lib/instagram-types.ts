export type PostType = "Réel" | "Carrousel" | "Story" | "Photo";
export type PostStatus = "backlog" | "brouillon" | "programme" | "publie";

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  type: PostType;
  status: PostStatus;
  date?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export const POST_TYPES: PostType[] = ["Réel", "Carrousel", "Story", "Photo"];

export const POST_TYPE_CONFIG: Record<
  PostType,
  { color: string; bg: string; badge: string; dot: string }
> = {
  Réel: {
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    badge: "bg-pink-400/10 text-pink-400 border-pink-400/20",
    dot: "bg-pink-400",
  },
  Carrousel: {
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    badge: "bg-violet-400/10 text-violet-400 border-violet-400/20",
    dot: "bg-violet-400",
  },
  Story: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    dot: "bg-blue-400",
  },
  Photo: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
};

export const POST_STATUS_CONFIG: Record<
  PostStatus,
  { label: string; color: string; bg: string; border: string; headerBg: string; dot: string }
> = {
  backlog: {
    label: "Backlog d'idées",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    headerBg: "bg-amber-400/5",
    dot: "bg-amber-400",
  },
  brouillon: {
    label: "Brouillons",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    headerBg: "bg-blue-400/5",
    dot: "bg-blue-400",
  },
  programme: {
    label: "Programmés",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    headerBg: "bg-violet-400/5",
    dot: "bg-violet-400",
  },
  publie: {
    label: "Publiés",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    headerBg: "bg-emerald-400/5",
    dot: "bg-emerald-400",
  },
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    title: "Unboxing collection printemps 2026",
    subtitle: "Découvrez les nouvelles pièces de notre collection avec une mise en scène lumineuse et élégante",
    type: "Réel",
    status: "programme",
    date: "2026-03-27",
    notes: "Filmer en lumière naturelle, format 9:16",
    tags: ["Produit", "Unboxing"],
    createdAt: "2026-03-15",
  },
  {
    id: "2",
    title: "5 erreurs à éviter quand on achète des bijoux",
    subtitle: "Guide pratique pour aider votre audience à faire le bon choix",
    type: "Carrousel",
    status: "programme",
    date: "2026-03-26",
    tags: ["Éducatif", "Conseils"],
    createdAt: "2026-03-10",
  },
  {
    id: "3",
    title: "Séquence promo — Soldes printemps",
    subtitle: "5 stories animées pour annoncer les soldes avec codes promo",
    type: "Story",
    status: "publie",
    date: "2026-03-24",
    tags: ["Promo"],
    createdAt: "2026-03-08",
  },
  {
    id: "4",
    title: "Pendentif or blanc 18 carats",
    subtitle: "Photo produit sur fond minimaliste noir, mise en valeur du détail",
    type: "Photo",
    status: "publie",
    date: "2026-03-22",
    tags: ["Produit"],
    createdAt: "2026-03-05",
  },
  {
    id: "5",
    title: "GRWM — Look bijoux soirée",
    subtitle: "Get Ready With Me avec notre nouvelle collection soirée",
    type: "Réel",
    status: "brouillon",
    date: "2026-04-01",
    notes: "Attendre la livraison de la collection soirée",
    tags: ["Lifestyle", "Réel"],
    createdAt: "2026-03-18",
  },
  {
    id: "6",
    title: "Guide entretien des bijoux en or",
    subtitle: "Comment nettoyer et conserver vos bijoux pour les garder comme neufs",
    type: "Carrousel",
    status: "brouillon",
    tags: ["Éducatif"],
    createdAt: "2026-03-19",
  },
  {
    id: "7",
    title: "Idée : collab avec influenceuse bijoux",
    subtitle: "Partenariat créatif avec @bijoux_by_lea — showcase de la collection",
    type: "Réel",
    status: "backlog",
    tags: ["Collab"],
    createdAt: "2026-03-20",
  },
  {
    id: "8",
    title: "Tutoriel : comment superposer les colliers",
    subtitle: "Tendance layering — 3 looks avec nos colliers bestsellers",
    type: "Carrousel",
    status: "backlog",
    tags: ["Tendance", "Éducatif"],
    createdAt: "2026-03-21",
  },
  {
    id: "9",
    title: "Behind the scenes — Shooting photo",
    subtitle: "Coulisses de notre dernier shooting pour la nouvelle collection",
    type: "Story",
    status: "backlog",
    tags: ["BTS"],
    createdAt: "2026-03-22",
  },
];
