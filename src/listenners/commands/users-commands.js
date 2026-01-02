import { createUser } from "../../api.js";

export const createUserCallback = async ({ command, ack, respond }) => {
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

    await respond({ blocks, text: `User ${user.display_name} created successfully` });
  } catch (error) {
    console.error(error);
    await respond({
      text: `Failed to create user: ${error.message}`,
      response_type: "ephemeral"
    });
  }
};