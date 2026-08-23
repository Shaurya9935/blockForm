import { Router, Request, Response } from 'express';
import { getGitHubAuthUrl, exchangeCodeForToken, getGitHubUserProfile } from '@repo/services/clients/github-oauth';
import UserService from '@repo/services/user';

const userService = new UserService();

export const githubOAuthRouter = Router();

// The URL to redirect users back to on the frontend after successful OAuth
const FRONTEND_CALLBACK_URL = (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null) ?? 'http://localhost:3000';

function getAuthCookieOptions() {
  const nodeEnv = process.env.NODE_ENV as string | undefined;
  const isProduction =
    nodeEnv === 'production' ||
    nodeEnv === 'prod' ||
    Boolean(process.env.RENDER) ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('https://'));

  return {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000,
  };
}

// Sign out — clears the auth cookie (no auth required; harmless if already expired)
githubOAuthRouter.get('/signout', (_req: Request, res: Response) => {
  const cookieOpts = getAuthCookieOptions();
  res.clearCookie('authentication-token', {
    path: cookieOpts.path,
    httpOnly: cookieOpts.httpOnly,
    secure: cookieOpts.secure,
    sameSite: cookieOpts.sameSite,
  });
  return res.json({ success: true });
});

// Step 1: Redirect user to GitHub's authorization page
githubOAuthRouter.get('/github', (_req: Request, res: Response) => {
  const authUrl = getGitHubAuthUrl();
  res.redirect(authUrl);
});

// Step 2: GitHub redirects back here with ?code=...
githubOAuthRouter.get('/github/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.redirect(`${FRONTEND_CALLBACK_URL}/signin?error=github_missing_code`);
  }

  try {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);

    // Fetch the GitHub user's profile
    const githubUser = await getGitHubUserProfile(accessToken);

    // Upsert user in our database and get a JWT
    const { id, token } = await userService.signInWithOAuth({
      provider: 'github',
      providerAccountId: String(githubUser.id),
      email: githubUser.email,
      fullName: githubUser.name,
      profileImageUrl: githubUser.avatar_url,
    });

    // Set the authentication cookie with cross-site support
    res.cookie('authentication-token', token, getAuthCookieOptions());

    // Redirect the browser back to the frontend dashboard
    return res.redirect(`${FRONTEND_CALLBACK_URL}/dashboard`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error('[GitHub OAuth] Error during callback:', message);
    return res.redirect(`${FRONTEND_CALLBACK_URL}/signin?error=github_oauth_failed`);
  }
});
