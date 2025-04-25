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

Create and interact with Crossmint wallets in Solana using Crossmint Auth to handle user authentication.

**Learn how to:**

- Create a wallet
- View its balance for SOL and SPL tokens
- Send a transaction
- Add delegated signers to allow third parties to sign transactions on behalf of your wallet

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
4. Set up your Crossmint API key:
   
   a. Generate a Crossmint API key from [here](https://docs.crossmint.com/introduction/platform/api-keys/client-side).
   
   b. To authenticate requests from your app, whitelist the app domain by selecting "Mobile" under "App type" and entering your iOS bundle ID and Android package name from `app.json` (by default this quickstart uses "com.crossmint.solana.wallets").

5. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key
```

6. Run the development server:

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

## Using in production

1. Create a [production API key](https://docs.crossmint.com/introduction/platform/api-keys/client-side).
2. Update the `NEXT_PUBLIC_RPC_URL` to a mainnet RPC URL, you can use the public RPC URL `https://api.mainnet-beta.solana.com`.
3. Update the `NEXT_PUBLIC_USDC_TOKEN_MINT` to the mainnet USDC token mint address `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`.

## Errors when running in iOS simulator

If you encounter errors trying to run the expo app on iOS, try running:

```bash
npx expo install --fix
```
