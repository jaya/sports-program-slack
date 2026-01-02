import { createProgram, listPrograms } from "../../api.js";

export const listProgramsCallback = async ({ command, ack, respond }) => {
  await ack();
  
  try {
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

    await respond({ blocks, text: "List of created programs" });
  } catch (error) {
    console.error(error);
    await respond({ 
      text: `Error: ${error.message}`,
      response_type: "ephemeral" 
    });
  }
};

export const createProgramCallback = async ({ command, ack, respond }) => {
  await ack();
  const programName = command.text;
  const userId = command.user_id;

  if (!programName) {
    await respond({
      text: "Please provide a program name. Usage: `/create-program <name>`",
      response_type: "ephemeral"
    });
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

    await respond({ blocks, text: `Program ${programs[0].name} created successfully` });
  } catch (error) {
    console.error(error);

    await respond({
      text: `Failed to create program: ${error.message}`,
      response_type: "ephemeral"
    });
  }
};
