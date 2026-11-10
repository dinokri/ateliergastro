# Environment Variables & External Credentials

This document describes all required and optional configurations for production deployment.

## Environment Variables

| Variable | Description | Default / Source |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform API Key for interactive map and marker rendering. | Auto-provisioned in AI Studio or configured via Cloud Console. |
| `GEMINI_API_KEY` | Optional server-side API key for intelligent menu parsing. | Injected by AI Studio Secrets panel. |
| `PORT` | Local runtime server port. | `3000` |

## Firebase Credentials

Firebase configurations are automatically bootstrapped in `firebase-applet-config.json`:
- `projectId`: Google Cloud / Firebase project ID (`elated-abacus-4wpgt`).
- `firestoreDatabaseId`: Firestore Database identifier (`ai-studio-4902d46e-f8bd-45c5-a61b-52ed56285025`).
- `apiKey`: Web API Key.
- `authDomain`: Authentication domain for Google sign-in.

## Optional External Merchant Integrations

- **Monri BiH Payment Gateway**:
  - Merchant ID (Authenticity Token)
  - Monri API Secret Key (Keep strictly server-side)
  - Webhook callback URL: `https://your-domain.com/api/payment/monri/callback`
  - *Note*: Cash on delivery, cash on pickup, and pay at restaurant are active out-of-the-box without requiring 3rd-party merchant credentials.
