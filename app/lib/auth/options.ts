import type { NextAuthOptions } from 'next-auth'
import { OpenAIOAuthProvider, AnthropicOAuthProvider, GeminiOAuthProvider } from './providers'

export const authOptions: NextAuthOptions = {
  providers: [OpenAIOAuthProvider, AnthropicOAuthProvider, GeminiOAuthProvider],
  secret: process.env.NEXTAUTH_SECRET ?? 'inner-dev-secret',
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : undefined
      }
      return token
    },
    async session({ session, token }) {
      session.provider = token.provider
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.expiresAt = token.expiresAt
      return session
    }
  }
}
