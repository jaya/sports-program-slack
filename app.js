import 'dotenv/config';
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

import { getActivities, getPrograms, createProgram } from './api.js';

app.command('/list-activities', async ({ command, ack, say }) => {
  await ack();
  try {
    const data = await getActivities(command.user_id);
    const activities = Array.isArray(data) ? data : [data];

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Activities List",
          emoji: true
        }
      },
      {
        type: "divider"
      }
    ];

    activities.forEach(activity => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${activity.description}*\n:link: <${activity.evidence_url}|Evidence>\n:calendar: Performed: ${new Date(activity.performed_at).toLocaleDateString()}\n:clock1: Created: ${new Date(activity.created_at).toLocaleDateString()}`
        }
      });
      blocks.push({
        type: "divider"
      });
    });

    await say({ blocks, text: "Activities List" });
  } catch (error) {
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Error",
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:warning: ${error.message}`
        }
      }
    ];
    await say({ blocks, text: "Error fetching activities" });
  }
});

app.command('/list-programs', async ({ command, ack, say }) => {
  await ack();
  const data = await getPrograms(command.user_id);

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
    const data = await createProgram(userId, payload);
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
