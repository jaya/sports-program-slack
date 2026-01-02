import { listPrograms, createActivity } from "../../api.js";

const appMentionedCallback = async ({ event, client, say }) => {
  try {
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
};

export default appMentionedCallback