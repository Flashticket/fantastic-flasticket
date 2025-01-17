# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# Third party dependencies
- Github for the repo
- Vercel
- Wordpress
- Sendgrid
- Apple PassKit (look into https://developer.apple.com/documentation/walletpasses/building_a_pass for instructions)
- Urlbox

# Operations for deployment
* Configure Sendgrid api key
* Configure Urlbox api key
* Send all files from wordress-changes into wordpress
* Configure de .env file properly on vercel
* Deploy the app into vercel
* When there is a new event defined, all the relevant files on static/events/<event id> need to be set up:

./passkit/icon@2x.jpeg

./passkit/background.png

./passkit/logo.png

./passkit/pass.json

./passkit/logo@2x.png

./passkit/thumbnail@2x.jpeg

./passkit/icon.jpeg

./passkit/background@2x.png

./passkit/thumbnail.jpeg

./eTickets/background.jpg

./printableTickets/logo.jpg