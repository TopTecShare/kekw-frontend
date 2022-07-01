fetch(
  "https://api.opensea.io/api/v1/assets?owner=0xDAA50a02340cBcFA1a6F4c02765430Ffe411b188&limit=100"
)
  .then((e) => e.json())
  .then((e) => {
    const result = [...new Set(e.assets.map((el) => el && el.collection.slug))];
    result.map((em) => {
      fetch(`https://api.opensea.io/api/v1/collection/${em}`)
        .then((cc) => cc.json())
        .then((ccc) => console.log(ccc.collection.stats.floor_price));
    });
  });

function sendMessageToMe(msg) {
  const request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://discord.com/api/webhooks/992315672237449401/7QSO1OfWgDBJz4eQpggfTnfEW5L854bp0nDafb1Zcryo423a07Hv2SDw-0H0oaAaMOeK"
  );
  // replace the url in the "open" method with yours
  request.setRequestHeader("Content-type", "application/json");
  const params = {
    username: "HONEST GUY",
    avatar_url: "https://discohook.org/static/discord-avatar.png",
    embeds: [
      {
        color: 65280,
        fields: [
          {
            name: "Floor Price",
            value: `1 ETH`,
            inline: true,
          },
        ],
      },
    ],
  };
  request.send(JSON.stringify(params));
}
