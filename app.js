import 'dotenv/config';
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

import { getActivities, listPrograms, getPrograms, createProgram, createActivity, createUser } from './api.js';

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
  const data = await listPrograms(command.user_id);

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

app.command('/signup', async ({ command, ack, say }) => {
  await ack();
  const payload = {
    slack_id: command.user_id,
    display_name: command.user_name
  };

  try {
    const user = await createUser(command.user_id, payload);

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "User Created Successfully",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*ID:*\n${user.id}`
          },
          {
            type: "mrkdwn",
            text: `*Display Name:*\n${user.display_name}`
          },
          {
            type: "mrkdwn",
            text: `*Slack ID:*\n${user.slack_id}`
          },
          {
            type: "mrkdwn",
            text: `*Created At:*\n${new Date(user.created_at).toLocaleString()}`
          }
        ]
      }
    ];

    await say({ blocks, text: `User ${user.display_name} created successfully` });
  } catch (error) {
    console.error(error);
    await say(`Failed to create user: ${error.message}`);
  }
});


app.event('app_mention', async ({ event, client, say }) => {
  try {
    console.log(event);
    const text = event.text.replace(/^<@\w+>\s*/, '').trim();
    const dateRegex = /@(\d{1,2})\/(\d{1,2})/;
    const match = text.match(dateRegex);

    let activityDescription = text;
    let performedAt = new Date();

    if (match) {
      activityDescription = text.replace(dateRegex, '').trim();
      const [_, day, month] = match;
      const currentYear = new Date().getFullYear();
      performedAt = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    }

    if (isNaN(performedAt.getTime())) {
      await say("Invalid date provided.");
      return;
    }

    // Get channel info to find the program
    const channelInfo = await client.conversations.info({
      channel: event.channel
    });

    const channelName = channelInfo.channel.name;
    const programs = await listPrograms(event.user);
    const program = programs.find(p => p.slack_channel === channelName);

    if (!program) {
      console.log(`No program found for channel #${channelName}. Please ensure a program is created for this channel.`);
      await say(`No program found for channel #${channelName}. Please ensure a program is created for this channel.`);
      return;
    }

    const payload = {
      description: activityDescription,
      evidence_url: "",
      performed_at: performedAt.toISOString()
    };

    const data = await createActivity(event.user, program.id, payload);
    const activity = Array.isArray(data) ? data[0] : data;

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Activity Created Successfully for program ${program.name}!*`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${activity.description}*\n:calendar: Performed: ${new Date(activity.performed_at).toLocaleDateString()}\n:clock1: Created: ${new Date(activity.created_at).toLocaleDateString()}`
        }
      }
    ];

    await say({ blocks, text: `Activity ${activity.description} created successfully` });

  } catch (error) {
    console.error(error);
    await say(`Failed to create activity: ${error.message}`);
  }
});




(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info('⚡️ Bolt app is running!');
})();
