# Àmì by Kòkò — Design System (steering)

This is a UI/visual redesign. NEVER change business logic, Supabase schema, RLS, auth flows, Paystack, or API routes unless a prompt explicitly says so. Keep all existing routes working. Redesign = components, layout, styling, copy polish only.

## Brand
- Wordmark: "Àmì" in coral (#F25C54) + "Kòkò" in green (#1FA463), friendly rounded display font. "by" is small and lighter. In child/parent areas the wordmark reads "Àmì & Kòkò"; in school admin it reads "Àmì by Kòkò".
- Mascots: Àmì (girl with afro puffs, Ankara-print top) and Kòkò (green parrot with red crest). Use them in hero banners, empty states, success screens, onboarding, and splash. They are image assets in /public/brand — never redraw them in SVG.
- Tone: warm, playful, safe, African-rooted, joyful but clean. Never cluttered.

## Design tokens (Tailwind v4 @theme in globals.css)
- Background: warm cream #FFFBEF, with soft yellow-to-white gradients on hero areas
- Primary (action green): #1FA463, hover #178A52, soft tint #E6F7EE
- Accent yellow (main CTA on child/parent side): #FFC93C, hover #F5B800, text on it: navy
- Coral: #F25C54, soft tint #FFE9E6
- Sky blue: #3B82F6, soft tint #E6F0FF
- Purple: #8B5CF6, soft tint #F0E9FF
- Orange: #FF8A3D, soft tint #FFEEDD
- Pink: #EC4899, soft tint #FFE6F1
- Navy (headings/text): #1B2A5B, body text #475074, muted #8A90AD
- Borders: #EFE8D8 (warm), cards white
- Radius: cards 20px, buttons pill (9999px), inputs 14px, icon tiles 16px
- Shadows: very soft, warm — 0 6px 24px rgba(27,42,91,0.06)
- Pastel category tiles: each category gets its own tint + matching icon colour (Learn=orange, Watch=blue, Games=green, Create=pink, Stories=purple, African Culture=yellow)
- Progress bars: rounded, 8px tall, colour matches subject
- Status pills: Active=green tint, Completed=green, In Progress=amber, Scheduled=green outline, Upcoming=yellow, Planned=purple

## Typography
- Display/headings: a rounded friendly font (Baloo 2 or Fredoka) via next/font
- Body/UI: Nunito
- MUST verify Yoruba diacritics render correctly (À, Ì, Ò, ṣ, ẹ, ọ, Àgbàdo) in both fonts before committing. If a glyph falls back, choose a different font.

## Components rules
- Build shared primitives in /components/ui: Button (primary green, yellow, outline, soft), Card, StatTile, CategoryTile, ProgressBar, ProgressRing, StatusPill, Avatar, Badge, Toggle, Tabs (pill style), SidebarNav, TopBar, EmptyState, Modal.
- Icons: lucide-react, rounded stroke, inside soft tinted rounded squares.
- Every interactive element: min 44px touch target, visible focus ring (green), AA contrast.
- Mobile-first. Breakpoints: mobile <768, tablet 768–1199, desktop ≥1200.
- Children's screens: bigger type, bigger tiles, minimal text, no dense tables.
- Respect prefers-reduced-motion. Animations are gentle (hover lift, progress fill, badge pop).
- Use real data from Supabase wherever it exists. Mock/demo numbers in the images are placeholders only — never hardcode them.