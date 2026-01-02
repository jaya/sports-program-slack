import { getActivities } from "../../api.js";

const listActivitiesCallback = async ({ command, ack, respond }) => {
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

    await respond({ blocks, text: "Activities List" });
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
    await respond({ blocks, text: "Error fetching activities" });
  }
};

export default listActivitiesCallback