<div align="center">
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/8b617791-cd37-4a5a-8695-a7c9018b7c70" />
<br>
<br>
<h1>Fintech Quickstart</h1>

<div align="center">
<a href="https://docs.crossmint.com/introduction/platform/wallets">Docs</a> | <a href="https://github.com/crossmint">See all quickstarts</a>
</div>

<br>
<br>
<img src="https://github.com/user-attachments/assets/80eda581-6a21-46d4-88de-04dacb8eb39b" alt="Image" width="full">
</div>

## Introduction

Create your own remittance app with Crossmint Wallets.

**Learn how to:**

- Create a wallet
- Hold and send USDC
- Earn yield on your USDC with [Lulo](https://lulo.fi/)
- See your transaction history with [Helius](https://helius.dev/)

## Setup

1. Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/crossmint/fintech-solana-wallets-expo-quickstart.git && cd fintech-solana-wallets-expo-quickstart
```

2. Install all dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up the environment variables:

```bash
cp .env.template .env
```
4. Set up your Crossmint API key. This quickstart needs to use a production API key:
   
   a. Generate a Crossmint API key from [here](https://docs.crossmint.com/introduction/platform/api-keys/client-side).
   
   b. To authenticate requests from your app, whitelist the app domain by selecting "Mobile" under "App type" and entering your iOS bundle ID and Android package name from `app.json` (by default this quickstart uses "com.crossmint.fintech.solana.wallets").

5. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key
```

6. Sign up for a [Helius](https://helius.dev/) account and get an API key.

7. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_HELIUS_API_KEY="000000000-0000-0000-0000-000000000000"
```

8. Sign up for a [Lulo](https://dev.lulo.fi/) account, create a project and get an API key.

9. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_LULO_API_KEY="000000000-0000-0000-0000-000000000000"
```

10. Run the app locally:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

Note: When running an iOS development build, make sure you're running the latest version on the simulator (>iOS 18).

## Necessary polyfills

Check out [polyfills.ts](lib/polyfills.ts) and [metro.config.js](metro.config.js) for the necessary polyfills to send Solana transactions. Make sure to keep these in your Expo app.

## Errors when running in iOS simulator

If you encounter errors trying to run the expo app on iOS, try running:

```bash
npx expo install --fix
```
