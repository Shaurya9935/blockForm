import { Router, Request, Response } from 'express';
import { getGitHubAuthUrl, exchangeCodeForToken, getGitHubUserProfile } from '@repo/services/clients/github-oauth';
import UserService from '@repo/services/user';

const userService = new UserService();

export const githubOAuthRouter = Router();

// The URL to redirect users back to on the frontend after successful OAuth
const FRONTEND_CALLBACK_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

// Sign out — clears the auth cookie (no auth required; harmless if already expired)
githubOAuthRouter.get('/signout', (_req: Request, res: Response) => {
  res.clearCookie('authentication-token', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
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

    // Set the authentication cookie (lax sameSite so the redirect from
    // this domain to the frontend domain carries the cookie)
    const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
    res.cookie('authentication-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_YEAR,
    });

    // Redirect the browser back to the frontend dashboard
    return res.redirect(`${FRONTEND_CALLBACK_URL}/dashboard`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error('[GitHub OAuth] Error during callback:', message);
    return res.redirect(`${FRONTEND_CALLBACK_URL}/signin?error=github_oauth_failed`);
  }
});
