const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cat",
    author: "Christus",
    category: "image",
    version: "1.0",
    role: 0,
    shortDescription: { fr: "🐱 Envoie une image aléatoire de chat" },
    longDescription: { fr: "Récupère une image de chat aléatoire depuis l'API." },
    guide: { fr: "{p}{n} — Affiche une image aléatoire de chat" }
  },

  onStart: async function({ api, event }) {
    try {
      const apiUrl = "https://xsaim8x-xxx-api.onrender.com/api/cat"; // API des chats

      // Récupération de l'image depuis l'API
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      // Sauvegarde temporaire de l'image
      const tempPath = path.join(__dirname, "cat_temp.jpg");
      fs.writeFileSync(tempPath, buffer);

      // Envoi de l'image dans le chat
      await api.sendMessage(
        {
          body: "🐱 Voici un chat aléatoire rien que pour toi !",
          attachment: fs.createReadStream(tempPath)
        },
        event.threadID,
        () => {
          // Suppression du fichier temporaire après envoi
          fs.unlinkSync(tempPath);
        },
        event.messageID
      );

    } catch (err) {
      console.error(err);
      api.sendMessage(
        `❌ Impossible de récupérer l'image du chat.\nErreur : ${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
