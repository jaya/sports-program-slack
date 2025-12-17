import 'dotenv/config';
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

const urlApi = process.env.API_URL;

app.command('/list-activities', async ({ body, ack, say }) => {
  await ack();
  fetch(`${urlApi}/program/1/activity`, {
    method: 'GET',
    headers: {
      'x-slack-user-id': '12345',
    },
  })
    .then(response => response.json())
    .then(data => {
      say(`Data: ${JSON.stringify(data)}`);
    });
});

app.command('/list-programs', async ({ command, ack, say }) => {
  await ack();
  fetch(`${urlApi}/programs`, {
    method: 'GET',
    headers: {
      'x-slack-user-id': command.user_id,
    },
  })
    .then(response => response.json())
    .then(data => {
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Created Programs",
            emoji: true
          }
        },
        {
          type: "divider"
        }
      ];

      data.forEach(program => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${program.name}*\n:hash: Channel: <#${program.slack_channel}>\n:calendar: Start: ${new Date(program.start_date).toLocaleDateString()}\n:checkered_flag: End: ${new Date(program.end_date).toLocaleDateString()}`
          }
        });
        blocks.push({
          type: "divider"
        });
      });

      say({ blocks, text: "List of created programs" });
    });
});

app.command('/create-program', async ({ command, ack, say }) => {
  await ack();
  const programName = command.text;
  const userId = command.user_id;

  if (!programName) {
    await say("Please provide a program name. Usage: `/create-program <name>`");
    return;
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 30);

  const payload = {
    name: programName,
    slack_channel: command.channel_name,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  };

  try {
    const response = await fetch(`${urlApi}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-slack-user-id': userId,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorData = JSON.parse(errorBody);
      await say(`Error creating program - ${errorData.detail}`);
      return;
    }

    const data = await response.json();
    const programs = Array.isArray(data) ? data : [data];

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Program Created Successfully",
          emoji: true
        }
      },
      {
        type: "divider"
      }
    ];

    programs.forEach(program => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${program.name}*\n:hash: Channel: <#${program.slack_channel}>\n:calendar: Start: ${new Date(program.start_date).toLocaleDateString()}\n:checkered_flag: End: ${new Date(program.end_date).toLocaleDateString()}`
        }
      });
    });

    await say({ blocks, text: `Program ${programs[0].name} created successfully` });
  } catch (error) {
    console.error(error);
    await say(`Failed to create program: ${error.message}`);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();
