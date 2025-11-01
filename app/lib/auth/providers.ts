import type { OAuthConfig } from 'next-auth/providers/oauth'

const scopes = {
  openai: ['models.read', 'responses.read', 'responses.write'],
  anthropic: ['messages.read', 'messages.write'],
  gemini: ['https://www.googleapis.com/auth/cloud-platform']
}

export const OpenAIOAuthProvider: OAuthConfig<any> = {
  id: 'openai',
  name: 'OpenAI',
  type: 'oauth',
  clientId: process.env.OPENAI_CLIENT_ID ?? '',
  clientSecret: process.env.OPENAI_CLIENT_SECRET ?? '',
  authorization: {
    url: 'https://auth.openai.com/authorize',
    params: { scope: scopes.openai.join(' ') }
  },
  token: 'https://auth.openai.com/oauth/token',
  userinfo: 'https://api.openai.com/v1/me',
  async profile(profile) {
    return {
      id: profile.id,
      name: profile.name ?? profile.email ?? 'OpenAI user'
    }
  }
}

export const AnthropicOAuthProvider: OAuthConfig<any> = {
  id: 'anthropic',
  name: 'Anthropic',
  type: 'oauth',
  clientId: process.env.ANTHROPIC_CLIENT_ID ?? '',
  clientSecret: process.env.ANTHROPIC_CLIENT_SECRET ?? '',
  authorization: {
    url: 'https://console.anthropic.com/oauth/authorize',
    params: { scope: scopes.anthropic.join(' ') }
  },
  token: 'https://console.anthropic.com/oauth/token',
  userinfo: 'https://api.anthropic.com/v1/me',
  async profile(profile) {
    return {
      id: profile.id,
      name: profile.name ?? 'Anthropic user'
    }
  }
}

export const GeminiOAuthProvider: OAuthConfig<any> = {
  id: 'gemini',
  name: 'Gemini',
  type: 'oauth',
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  authorization: {
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
    params: {
      scope: scopes.gemini.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    }
  },
  token: 'https://oauth2.googleapis.com/token',
  userinfo: {
    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name ?? profile.email ?? 'Gemini user'
    }
  }
}
