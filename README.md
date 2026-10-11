# Talkie (iOS app)

The React Native / Expo client for **Talkie**, an app for leaving and reading
comments tied to an exact moment in a movie or TV episode.

Instead of a review or one long discussion thread, every comment is anchored to
a timestamp: "at 1:12:40, *that* line." You scrub to where you are in the movie,
and only the comments from that moment show up, so you never see spoilers from
later on.

- **Website:** [gettalkie.app](https://gettalkie.app)
- **Backend API (Go):** [talkie-backend](https://github.com/anagarcia3174/talkie-backend)

---

## Features

- **Timestamp scrubber.** A draggable timeline sized to the movie's or episode's
  runtime, with play/pause and 0.5×–2× speed so it can follow along while you
  watch. Existing comments show as marks on the track, and dragging near a mark
  snaps to it.
- **Spoiler-free comment feed.** Only comments from the last 10 seconds before
  your current position are shown. Tapping a comment jumps the scrubber to its
  timestamp.
- **Post at the current moment.** The composer stamps your comment with the
  scrubber position (280-character limit).
- **Movies and TV.** One page per title. TV shows get a season/episode picker
  on that same page, and comments are kept per episode.
- **Search and trending,** powered by [TMDB](https://www.themoviedb.org/).
- **Sign in with Apple or Google** through Supabase Auth, then pick a username
  and accept the Terms before posting.
- **Safety tools required for App Store user-generated content:** report a
  comment, block users (and manage blocked users in Settings), and delete your
  account in the app.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 57, React Native 0.86, React 19 (React Compiler enabled) |
| Language | TypeScript |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, typed routes) |
| Server state | [TanStack Query](https://tanstack.com/query) |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) with native Apple and Google sign-in |
| Session storage | AES-encrypted session in AsyncStorage; the encryption key lives in the iOS Keychain via `expo-secure-store` |
| Gestures | `react-native-gesture-handler` (scrubber) |
| Crash reporting | [Sentry](https://sentry.io) (no PII, disabled in development) |
| Builds and release | [EAS Build / Submit](https://docs.expo.dev/eas/) |

## How it fits together

```
 Talkie app (this repo)
   │  Supabase Auth: Apple / Google sign-in → JWT
   │
   │  HTTPS + Bearer JWT
   ▼
 talkie-backend (Go API on Fly.io)
   ├── Supabase Postgres: profiles, comments, reports, blocks (RLS enabled)
   └── TMDB: movie, show, episode, and search data
```

The app never talks to the database directly. Supabase is used for sign-in
only, and every data request goes through the Go API in `src/lib/api.ts`, which
attaches the current session's access token. The API verifies the token,
enforces moderation (content filter, rate limits, bans, auto-hiding reported
comments), and proxies TMDB so the TMDB key never ships in the app.

## Project structure

```
src/
├── app/                 # Expo Router screens
│   ├── (tabs)/          # Home (trending), Search, Profile
│   ├── movie/[tmdbId]   # Movie page: details, scrubber, comments
│   ├── tv/[tmdbId]      # Show page with season/episode picker
│   ├── onboarding.tsx
│   └── settings.tsx     # Blocked users, legal links, delete account
├── components/          # Scrubber, Comments, CommentComposer, ReportSheet, skeletons, …
├── hooks/
│   ├── use-auth.tsx           # Auth context: session, sign-in/out, profile
│   └── use-media-scrubber.ts  # Position, play/pause, and speed state
├── lib/                 # API client, Supabase client, typed endpoint helpers
└── theme/tokens.ts      # Colors, fonts, spacing
```

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

Copyright © 2026 Ana Garcia. All rights reserved.

This repository is public for portfolio purposes only. No license is granted to
use, copy, modify, or distribute this code. See [LICENSE](LICENSE).
