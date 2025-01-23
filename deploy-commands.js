// deploy-commands.js

// Import necessary modules
import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { CLIENT_ID, TOKEN, SERVER } = process.env;

if (!CLIENT_ID || !TOKEN || !SERVER) {
  console.error("Missing CLIENT_ID, TOKEN, or SERVER in .env file.");
  process.exit(1);
}

const commands = [];

const commandsPath = join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = join(commandsPath, folder);

  if (!fs.lstatSync(folderPath).isDirectory()) continue;

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = join(folderPath, file);

    try {
      const commandModule = await import(`file://${filePath}`);
      const command = commandModule.default || commandModule;

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        console.log(`Loaded command: ${command.data.name}`);
      } else {
        console.warn(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    } catch (error) {
      console.error(`[ERROR] Failed to load command at ${filePath}:`, error);
    }
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, SERVER),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("Failed to deploy commands:", error);
  }
})();
