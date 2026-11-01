# UniBuddy — The campus edition

A complete, separate React app that carries the homepage experiment’s ivory, forest-green, lime, Manrope, and photography direction through the whole UniBuddy experience. It includes a matching dark theme, controlled by the moon/sun button at the top right of both navbars.

Everything in this app lives inside `experiment-app/`. It does not import source files from the original app or change the original app’s browser storage.

## Run it

From the Unibuddy project directory:

```sh
cd experiment-app
npm run dev
```

Open **http://127.0.0.1:5174/**. The original project can run separately on its usual port.

The existing parent installation supplies the dependencies in this workspace. If you copy this directory elsewhere, install its own dependencies first with `npm ci` (Node 18 or later).

```sh
npm run check     # Lint, logic tests, and a production build
npm run build     # Creates this app's dist/ directory
npm run preview   # Production preview on http://127.0.0.1:4174/
```

## Explore both roles

Choose **Get started** or **Log in**, then **Junior pass** or **Senior pass** in the demo section. The junior demo is Rahul Verma; the senior demo is Aarav Mehta. Their existing connection and sample conversation make it possible to explore both sides of messaging. You can also create your own local pass using your name, email, college, year, and interests.

| Route | Experience |
| --- | --- |
| `/` | The original experimental homepage, with matching light and dark themes. |
| `/dashboard` | Junior campus dashboard, personal pass, recommended seniors, campus previews, and recent conversations. |
| `/mentors` | Search, topic/skill/college/year/availability filters, sorting, senior profiles, and connection requests. |
| `/connections` | Connected students, incoming requests, sent requests, discovery, and connection management for both roles. |
| `/messages` | Inbox, conversation search, new conversations, and incoming requests. |
| `/messages/:peerId` | Connected chat with multiline messages, emoji, and sent/seen states. |
| `/map` | The college-based OpenStreetMap map, category filters, sample places, reviews, sorting, and recentering. |
| `/stories` | The **original Instants-style swipe deck**, with its original layout, gestures, double-tap likes, video sound, comments/share/more sheets, and centered upload button. |
| `/senior` | Mentor workspace, availability, incoming requests, profile summary, and conversations. |
| `/profile` | Editable profile and live campus-pass preview for either role. |
| `/senior/profile` | The senior profile entry point. |

The Stories component and its original CSS are retained. Its only component addition is importing `StoriesTheme.css`; light and dark appearance changes are kept in theme stylesheets.

## Theme and local data

Light mode is the default. The navbar toggle applies to the homepage, every app screen, dialogs, the map, and the swipe deck. The selected mode survives navigation and refreshes.

This is an interactive frontend prototype, matching the original app’s scope. Passes, profiles, connections, and chat messages are local to this browser. There is no shared authentication service, live multi-device messaging, payment processing, or paid booking backend. Local pass login uses an email without collecting a password.

The new app uses its own storage names:

- `unibuddy_campus_theme`
- `unibuddy_campus_user`
- `unibuddy_campus_accounts_v1`
- `unibuddy_campus_network_v1`
- IndexedDB database `unibuddy_campus_stories_v1`

Uploaded photos/videos (up to 20 MB) are saved in IndexedDB and scoped to the selected college. Story likes and comments retain the original page’s in-memory behavior. Its share and more sheets also retain the original controls; report/mute feedback remains prototype behavior.

The map uses the same 25-college coordinate catalog and OpenStreetMap tile service. Places, walking times, and reviews are sample data. Internet access is needed for map tiles, custom-college lookups, and the original Stories page’s sample media. Portraits, homepage photos, and Manrope are served locally.

## Structure

- `src/components/` — shared navigation, theme toggle, profiles, dialogs, and connection controls.
- `src/context/` — independent authentication, network, theme, and toast state.
- `src/pages/` — all complete app screens.
- `src/styles/` — the shared campus theme and dark-mode palette.
- `src/lib/` and `src/data/` — local storage, connection/message rules, filters, and sample catalogs.
- `public/experiment/` — the experiment’s original local photos, font files, and font license.
- `tests/` — regression tests for connections, messaging permissions, campus lookup, registration, route restoration, and directory filters.

Asset credits are in [ASSETS.md](ASSETS.md).
