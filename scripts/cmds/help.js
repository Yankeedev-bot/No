const { commands, aliases } = global.GoatBot;

// --- Fonction pour transformer un texte en style 𝑨𝒁 ---
function toAZStyle(text) {
  const azMap = {
    A:'𝑨', B:'𝑩', C:'𝑪', D:'𝑫', E:'𝑬', F:'𝑭', G:'𝑮', H:'𝑯', I:'𝑰', J:'𝑱',
    K:'𝑲', L:'𝑳', M:'𝑴', N:'𝑵', O:'𝑶', P:'𝑷', Q:'𝑸', R:'𝑹', S:'𝑺', T:'𝑻',
    U:'𝑼', V:'𝑽', W:'𝑾', X:'𝑿', Y:'𝒀', Z:'𝒁',
    a:'𝒂', b:'𝒃', c:'𝒄', d:'𝒅', e:'𝒆', f:'𝒇', g:'𝒈', h:'𝒉', i:'𝒊', j:'𝒋',
    k:'𝒌', l:'𝒍', m:'𝒎', n:'𝒏', o:'𝒐', p:'𝒑', q:'𝒒', r:'𝒓', s:'𝒔', t:'𝒕',
    u:'𝒖', v:'𝒗', w:'𝒘', x:'𝒙', y:'𝒚', z:'𝒛',
    '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    ' ':' '
  };
  return text.split('').map(c => azMap[c] || c).join('');
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "hud", "interface"],
    version: "6.1",
    author: "TRØN ARËS",
    countDown: 2,
    role: 0,
    shortDescription: { en: "𝐸𝑥𝑝𝑙𝑜𝑟𝑒 𝑇𝑅Ø𝑁 𝐴𝑅Ë𝑆 𝑐𝑦𝑏𝑒𝑟𝑛𝑒𝑡𝑖𝑐 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠" },
    category: "⚡ system",
    guide: { en: "help <command> — 𝑔𝑒𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑛𝑓𝑜, -ai 𝑓𝑜𝑟 𝑛𝑒𝑢𝑟𝑎𝑙 𝑠𝑢𝑔𝑔𝑒𝑠𝑡𝑖𝑜𝑛𝑠" },
  },

  onStart: async function ({ message, args, event, usersData }) {
    try {
      const uid = event.senderID;
      let avatar = await usersData.getAvatarUrl(uid).catch(() => null);
      if (!avatar) avatar = "https://i.imgur.com/TPHk4Qu.png";

      // --- AI Suggestion ---
      if(args[0]?.toLowerCase() === "-ai") {
        const keyword = args[1]?.toLowerCase() || "";
        const allCmds = Array.from(commands.keys());
        const suggestions = allCmds
          .map(cmd => ({ cmd, match: Math.max(40, 100 - Math.abs(cmd.length - keyword.length) * 10) }))
          .filter(c => c.cmd.includes(keyword))
          .sort((a,b)=>b.match - a.match)
          .slice(0,10);

        if(!suggestions.length) {
          return message.reply({ 
            body: "╭═══✨✨✨═══╮\n│ ❌ 𝑵𝑬𝑼𝑹𝑨𝑳 𝑺𝑼𝑮𝑮𝑬𝑺𝑻𝑰𝑶𝑵𝑺 ❌\n│ 𝑵𝒐 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒎𝒂𝒕𝒄𝒉𝒊𝒏𝒈: '" + keyword + "'\n│ 𝑻𝒓𝒚 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒌𝒆𝒚𝒘𝒐𝒓𝒅𝒔\n╰═══✨✨✨✨═══╯",
            attachment: await global.utils.getStreamFromURL(avatar)
          });
        }

        const body = "╭═══✨✨✨═══╮\n│ ⚡ 𝑵𝑬𝑼𝑹𝑨𝑳 𝑺𝑼𝑮𝑮𝑬𝑺𝑻𝑰𝑶𝑵𝑺 ⚡\n│ 𝑲𝒆𝒚𝒘𝒐𝒓𝒅: '" + keyword + "'\n" +
                    suggestions.map(s=>`│ 🎁 ${toAZStyle(s.cmd)} (${s.match}% 𝒎𝒂𝒕𝒄𝒉)`).join("\n") + "\n╰═══✨✨✨✨═══╯";

        return message.reply({ body, attachment: await global.utils.getStreamFromURL(avatar) });
      }

      // --- Command List ---
      if(!args || args.length === 0) {
        const notificationHeader = "📢 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗳𝗿𝗼𝗺 𝗮𝗱𝗺𝗶𝗻 𝗯𝗼𝘁 𝘁𝗼 𝗮𝗹𝗹 𝗰𝗵𝗮𝘁 𝗴𝗿𝗼𝘂𝗽𝘀 (𝗱𝗼 𝗻𝗼𝘁 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲)\n────────────────\n𝗛𝗲𝗹𝗹𝗼\n\n";
        
        // En-tête personnalisé
        let body = notificationHeader + 
                  "╭═══✨✨✨═══╮\n" +
                  "│ 🎄💮 *TRØN ARËS MENU* 💮🎄\n" +
                  "│ Usuario: " + toAZStyle(event.senderID) + "\n" +
                  "│ Bot: *TRØN ARËS BØT*\n" +
                  "│ Creador: *TRØN ARËS SYSTEM*\n" +
                  "╰═══✨✨✨✨═══╯\n\n";
        
        const categories = {};
        const categoryOrder = [
          'admin', 'ai', 'ai-generated', 'ai-image', 'ai image-edit',
          'anime', 'box chat', 'chat', 'config', 'contacts admin',
          'custom', 'developer', 'discussion de groupe', 'economy',
          'fun', 'game', 'groupe', 'générateur d\'image', 'générateur d\'image 2',
          'générateur d\'images', 'ia', 'image', 'info', 'information',
          'jeu', 'logiciel', 'love', 'media', 'média', 'nsfw',
          'owner', 'propriétaire', 'rank', 'ranking', 'system',
          'système', 'tools', 'utilitaire', 'utility', 'wiki',
          'market', 'software', 'tts', 'uploader', 'other'
        ];

        const categoryDisplayNames = {
          'admin': '🔧 *ADMIN*',
          'ai': '🤖 *AI*',
          'ai-generated': '🌀 *AI GENERATED*',
          'ai-image': '🎨 *AI IMAGE*',
          'ai image-edit': '◈ *AI IMAGE-EDIT*',
          'anime': '◈ *ANIME*',
          'box chat': '💬 *BOX CHAT*',
          'chat': '◈ *CHAT*',
          'config': '⚙️ *CONFIG*',
          'contacts admin': '📞 *CONTACTS ADMIN*',
          'custom': '🛠️ *CUSTOM*',
          'developer': '◈ *DEVELOPER*',
          'discussion de groupe': '◈ *DISCUSSION DE GROUPE*',
          'economy': '💎 *ECONOMY*',
          'fun': '🎉 *FUN*',
          'game': '🎮 *GAME*',
          'groupe': '◈ *GROUPE*',
          'générateur d\'image': '◈ *GÉNÉRATEUR D\'IMAGE*',
          'générateur d\'image 2': '◈ *GÉNÉRATEUR D\'IMAGE 2*',
          'générateur d\'images': '◈ *GÉNÉRATEUR D\'IMAGES*',
          'ia': '◈ *IA*',
          'image': '🌌 *IMAGE*',
          'info': '📌 *INFO*',
          'information': '◈ *INFORMATION*',
          'jeu': '◈ *JEU*',
          'logiciel': '◈ *LOGICIEL*',
          'love': '◈ *LOVE*',
          'media': '📥 *MEDIA*',
          'média': '◈ *MÉDIA*',
          'nsfw': '🔞 *NSFW*',
          'owner': '👑 *OWNER*',
          'propriétaire': '◈ *PROPRIÉTAIRE*',
          'rank': '🏆 *RANK*',
          'ranking': '◈ *RANKING*',
          'system': '🖥️ *SYSTEM*',
          'système': '◈ *SYSTÈME*',
          'tools': '🔧 *TOOLS*',
          'utilitaire': '◈ *UTILITAIRE*',
          'utility': '🧰 *UTILITY*',
          'wiki': '📖 *WIKI*',
          'market': '◈ *𝗠𝗮𝗿𝗸𝗲𝘁*',
          'software': '📱 *SOFTWARE*',
          'tts': '🔊 *TTS*',
          'uploader': '📤 *UPLOADER*',
          'other': '🌐 *OTHER*'
        };

        for(let [name, cmd] of commands) {
          const cat = cmd.config.category?.toLowerCase() || "other";
          if(!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        }

        // Afficher les catégories dans l'ordre défini
        for(const cat of categoryOrder) {
          if(categories[cat] && categories[cat].length > 0) {
            const displayName = categoryDisplayNames[cat] || `◈ *${cat.toUpperCase()}*`;
            const sortedCommands = categories[cat].sort();
            
            // Calculer le nombre de lignes nécessaires (max 10 commandes par bloc)
            const commandChunks = [];
            for(let i = 0; i < sortedCommands.length; i += 10) {
              commandChunks.push(sortedCommands.slice(i, i + 10));
            }
            
            for(const chunk of commandChunks) {
              body += "╭═══✨✨✨═══╮\n" +
                      `│ ${displayName}\n`;
              
              chunk.forEach(cmd => {
                body += `│ 🎁 ${toAZStyle(cmd)}\n`;
              });
              
              body += "╰═══✨✨✨✨═══╯\n\n";
            }
            
            // Supprimer la catégorie après l'avoir affichée pour éviter les doublons
            delete categories[cat];
          }
        }

        // Afficher les catégories restantes
        for(const cat in categories) {
          if(categories[cat].length > 0) {
            const displayName = categoryDisplayNames[cat] || `◈ *${cat.toUpperCase()}*`;
            const sortedCommands = categories[cat].sort();
            
            const commandChunks = [];
            for(let i = 0; i < sortedCommands.length; i += 10) {
              commandChunks.push(sortedCommands.slice(i, i + 10));
            }
            
            for(const chunk of commandChunks) {
              body += "╭═══✨✨✨═══╮\n" +
                      `│ ${displayName}\n`;
              
              chunk.forEach(cmd => {
                body += `│ 🎁 ${toAZStyle(cmd)}\n`;
              });
              
              body += "╰═══✨✨✨✨═══╯\n\n";
            }
          }
        }

        // Statistiques finales
        const totalCommands = commands.size;
        const totalCategories = Object.keys(categories).length;
        
        body += "╭═══✨✨✨═══╮\n" +
                "│ ⚡ *TRØN ARËS CYBERNETIC SYSTEM* ⚡\n" +
                `│ 📊 Total Commands: ${totalCommands}\n` +
                `│ 📂 Categories: ${totalCategories}\n` +
                "│ ⚡ Status: Operational\n" +
                "│ 🎀 TRØN ARËS is proud of you.\n" +
                "╰═══✨✨✨✨═══╯\n\n" +
                "╭═══✨✨✨═══╮\n" +
                "│ 🎯 *QUICK REFERENCE*\n" +
                "│ 🎁 .help <command> - Command info\n" +
                "│ 🎁 .help -ai <keyword> - AI suggestions\n" +
                "│ 🎁 .callad [message] - Contact admin\n" +
                "╰═══✨✨✨✨═══╯";

        return message.reply({ body, attachment: await global.utils.getStreamFromURL(avatar)});
      }

      // --- Command Info ---
      const query = args[0].toLowerCase();
      const command = commands.get(query) || commands.get(aliases.get(query));
      if(!command) {
        return message.reply({ 
          body: "╭═══✨✨✨═══╮\n│ ❌ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑬𝑹𝑹𝑶𝑹 ❌\n│ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 '" + query + "' 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅\n│ 𝒊𝒏 𝒅𝒂𝒕𝒂𝒃𝒂𝒔𝒆\n╰═══✨✨✨✨═══╯",
          attachment: await global.utils.getStreamFromURL(avatar)
        });
      }

      const cfg = command.config || {};
      const roleMap = {0:"🟢 LEVEL 0 (All Users)", 1:"🟡 LEVEL 1 (Group Admins)", 2:"🔴 LEVEL 2 (Bot Admin)"};
      const aliasesList = Array.isArray(cfg.aliases) && cfg.aliases.length ? cfg.aliases.map(a=>toAZStyle(a)).join(" | ") : "𝑵𝒐𝒏𝒆";
      const desc = cfg.longDescription?.en || cfg.shortDescription?.en || "𝑵𝒐 𝒅𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏.";
      const usage = cfg.guide?.en || cfg.name;

      const card = "╭═══✨✨✨═══╮\n" +
                  "│ ⚡ 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵 ⚡\n" +
                  `│ 🎁 ${toAZStyle(cfg.name)}\n` +
                  "╰═══✨✨✨✨═══╯\n\n" +
                  "╭═══✨✨✨═══╮\n" +
                  "│ 📝 *DESCRIPTION*\n" +
                  `│ ${desc.substring(0, 60)}${desc.length > 60 ? '...' : ''}\n` +
                  "╰═══✨✨✨✨═══╯\n\n" +
                  "╭═══✨✨✨═══╮\n" +
                  `│ 📂 Category: ${cfg.category || "Misc"}\n` +
                  `│ 🔤 Aliases: ${aliasesList}\n` +
                  `│ 🛡️ Role: ${roleMap[cfg.role] || "Unknown"}\n` +
                  `│ ⏱️ Cooldown: ${cfg.countDown || 1}s\n` +
                  `│ 🚀 Version: ${cfg.version || "1.0"}\n` +
                  `│ 👨‍💻 Author: ${cfg.author || "Unknown"}\n` +
                  "╰═══✨✨✨✨═══╯\n\n" +
                  "╭═══✨✨✨═══╮\n" +
                  "│ 💡 *USAGE*\n" +
                  `│ .${toAZStyle(usage)}\n` +
                  "╰═══✨✨✨✨═══╯\n\n" +
                  "╭═══✨✨✨═══╮\n" +
                  "│ 🔧 *OPTIONS*\n" +
                  `│ .help ${toAZStyle(cfg.name.toLowerCase())} -u\n` +
                  `│ .help ${toAZStyle(cfg.name.toLowerCase())} -i\n` +
                  `│ .help ${toAZStyle(cfg.name.toLowerCase())} -a\n` +
                  `│ .help ${toAZStyle(cfg.name.toLowerCase())} -r\n` +
                  "╰═══✨✨✨✨═══╯";

      return message.reply({ body: card, attachment: await global.utils.getStreamFromURL(avatar)});

    } catch(err) {
      console.error("TRØN ARËS HELP ERROR:", err);
      return message.reply("╭═══✨✨✨═══╮\n│ ❌ 𝑺𝒀𝑺𝑻𝑬𝑴 𝑬𝑹𝑹𝑶𝑹 ❌\n│ " + (err.message || err).substring(0, 50) + "\n╰═══✨✨✨✨═══╯");
    }
  }
};
