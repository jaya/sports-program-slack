# 🏃‍♂️ Sports Program — Jaya Academy

A Slack-based application designed to encourage physical activity, consistency, and healthy habits within the Jaya community.

## 📌 Purpose
This project serves as the designated Slack App for the Sports Program. It is designed to be installed in the Slack workspace (and eventually the Marketplace) to allow users to seamlessy interact with the Sports Program backend.

This project is part of an internal learning initiative where developers collaborate, practice English, and gain hands-on experience with modern development tools.

## 🧰 Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Slack Bolt](https://img.shields.io/badge/Slack_Bolt-4A154B?style=for-the-badge&logo=slack&logoColor=white)

## 🚀 Running locally

### 1. Setup environment variables

```zsh
# Replace with your bot and app token
export SLACK_BOT_TOKEN=<your-bot-token> # from the OAuth section
export SLACK_APP_TOKEN=<your-app-level-token> # from the Basic Info App Token Section
```

### 2. Setup your local project

```zsh
# Clone this project onto your machine
git clone https://github.com/jaya/sports-program-slack.git

# Change into the project
cd sports-program-slack/

# Install the dependencies
npm install
```

### 3. Start the app

#### Option A: Using NPM (Standard)

```zsh
npm start
```

#### Option B: Using Slack CLI

The Slack CLI is a quick way to run your app locally.

1. Install the [Slack CLI](https://api.slack.com/automation/cli/install).
2. Authorize the CLI with your workspace: `slack login`
3. Start the local development server:

```zsh
slack run
```

### 4. Test

Go to the installed workspace and type "hello" in a DM to your new bot. You can also type "hello" in a channel where the bot is present.

## Contributing

### Issues and questions

Found a bug or have a question about this project? We'd love to hear from you!

1. Browse to [slackapi/bolt-js/issues][4]
1. Create a new issue
1. Select the `[x] examples` category

See you there and thanks for helping to improve Bolt for everyone!

[1]: https://tools.slack.dev/bolt-js/getting-started
[2]: https://tools.slack.dev/bolt-js/
[3]: https://tools.slack.dev/bolt-js/getting-started/#setting-up-events
[4]: https://github.com/slackapi/bolt-js/issues/new/choose
