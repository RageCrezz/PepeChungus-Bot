// commands/utility/user.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction) {
    // Retrieve the member who invoked the command
    const member = interaction.member;
    const user = interaction.user;

    // Create an embed with the specified properties
    const embed = new EmbedBuilder()
      .setColor("#57F287") // Pepe frog's green color hexcode
      .setTitle(member.nickname ? member.nickname : user.username) // Executor's Nickname or Username
      .setDescription(`**Username:** ${user.username}`)
      .addFields({
        name: "Info",
        value: `Joined Discord on ${user.createdAt.toDateString()}\nJoined the server on ${member.joinedAt.toDateString()}`,
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setTimestamp()
      .setFooter({
        text: `Requested by ${user.tag}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      });

    // Reply with the embed
    await interaction.reply({ embeds: [embed] });
  },
};
