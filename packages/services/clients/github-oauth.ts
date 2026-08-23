import { env } from '../env';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

/**
 * Returns the GitHub OAuth authorization URL to redirect the user to.
 */
export function getGitHubAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID ?? '',
    redirect_uri: env.GITHUB_CALLBACK_URL ?? '',
    scope: 'read:user user:email',
  });
  if (state) {
    params.set('state', state);
  }
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}

/**
 * Exchanges a GitHub OAuth `code` for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID ?? '',
    client_secret: env.GITHUB_CLIENT_SECRET ?? '',
    code,
    redirect_uri: env.GITHUB_CALLBACK_URL ?? '',
  });

  const response = await fetch(`${GITHUB_TOKEN_URL}?${params.toString()}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.statusText}`);
  }

  const data = await response.json() as { access_token?: string; error?: string; error_description?: string };

  if (data.error || !data.access_token) {
    throw new Error(`GitHub token error: ${data.error_description ?? data.error ?? 'unknown'}`);
  }

  return data.access_token;
}

/**
 * Fetches the GitHub user's profile and primary email using the access token.
 */
export async function getGitHubUserProfile(accessToken: string): Promise<GitHubUserProfile> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Fetch user profile
  const userRes = await fetch(GITHUB_USER_URL, { headers });
  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user profile: ${userRes.statusText}`);
  }
  const user = await userRes.json() as GitHubUserProfile;

  // If the profile doesn't have a public email, look up verified emails
  if (!user.email) {
    const emailsRes = await fetch(GITHUB_EMAILS_URL, { headers });
    if (emailsRes.ok) {
      const emails = await emailsRes.json() as GitHubEmail[];
      const primary = emails.find((e) => e.primary && e.verified);
      if (primary) {
        user.email = primary.email;
      }
    }
  }

  return user;
}
