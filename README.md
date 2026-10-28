# Matin D4 — editable personal website

Astro + Tailwind CSS + Supabase, ready for Vercel deployment once the external Supabase project is configured.

## What the private control room manages

Open `/d4-control` on the deployed website and sign in with an approved admin account. The panel supports:

- Site logo, accent/background/panel colors, English and Persian fonts, and corner radius
- Profile name, role, biography, skills, interests, favorite artists, availability, and social links
- Homepage hero copy, calls to action, code-card visibility, page copy, SEO title/description/keywords, Open Graph image
- Project cards, descriptions, status, tags, screenshots, project/repository links, and homepage featured selection
- Playlist metadata, public audio URLs, and cover art
- Blog drafts, published posts, slugs, dates, cover images, excerpts and body text
- Contact inbox: read messages, mark messages read, and delete messages

The public pages read the saved CMS content on the server. The admin interface is not linked from the public navigation/footer. The URL is not the security boundary: Supabase authentication and row/storage policies are.

## 1. Create a Supabase project

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor**, paste the full contents of `supabase/schema.sql`, and run it.
3. In **Project Settings → API**, copy the Project URL and the publishable/anon key.
4. In **Authentication → Providers**, keep Email enabled. Disable public sign-ups; create your own user manually in **Authentication → Users** with a strong unique password.
5. Copy that user's UUID. Back in SQL Editor, run:

   ```sql
   insert into public.admin_users (user_id)
   values ('PASTE-YOUR-AUTH-USER-UUID-HERE');
   ```

   This approval row is required before the account can access the control room. Do not give this account to anyone else.

6. In **Authentication → URL Configuration**, add your deployed domain to the allowed redirect URLs if you later use email-based auth flows. Password login in this version does not depend on email redirects.

## 2. Configure local development

Copy `.env.example` to `.env` and fill in:

```env
PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Then run:

```bash
npm install
npm run dev
```

Open the local address printed by Astro. Visit `/d4-control`, sign in, and save the initial content once. After saving, the public site will use the database content instead of the fallback content.

## 3. Deploy to Vercel

1. Push the project folder to a GitHub repository.
2. Import that repository into Vercel. The project uses the Astro Vercel adapter and server output; Vercel should detect Astro automatically.
3. In **Vercel → Project → Settings → Environment Variables**, add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` for Production, Preview, and Development as needed.
4. Redeploy after adding environment variables.
5. Visit `/d4-control`, log in with the approved user, and save content.

Never add `SUPABASE_SERVICE_ROLE_KEY` or any other service-role/secret key to `PUBLIC_*` variables or client-side code. This project intentionally uses the public anon/publishable key and relies on RLS for access control.

## Font and theme notes

Recommended default pairing: **Inter** for English and **Vazirmatn** for Persian. Other choices are available in the control room. Fonts are loaded from Google Fonts, so visitors need internet access to fetch them. The current content is mostly English; the Persian font is available for any Persian text and for RTL sections added later.

## Media and music

- Image uploads accept PNG, JPG, WebP, AVIF, or GIF up to 8 MB and go to the public `site-assets` bucket. Only approved admin users can upload or delete objects under the configured storage policies.
- Playlist tracks use public audio URLs. The panel does not upload audio files in this version. Add only audio that you own or are licensed to share.
- The contact form writes messages to Supabase. Public insert access is intentionally limited by field length checks, but a public form can still attract spam. Before a high-traffic launch, add CAPTCHA/Turnstile and server-side rate limiting.

## Security model and limitations

- `/d4-control` is intentionally not linked publicly, but hiding a URL is not security. Authentication plus the `admin_users` table and RLS policies protect writes, inbox access, and media uploads.
- The panel has no public registration form. Disable Supabase sign-ups and create admin accounts manually.
- Do not share the admin password. If you need another administrator, create a separate Supabase user and explicitly add their UUID to `admin_users`.
- Content is stored in one JSON document (`site_content`) for easy management. Supabase backups and access controls should be configured in the Supabase dashboard for long-term use.
- This code has not been deployed to your Vercel account from this workspace. You still need to create/configure Supabase, push to GitHub, add environment variables, and deploy. Run `npm run check` and `npm run build` before launch.
