const fs=require('fs');
(async()=>{
const page=await fetch('https://www.dvidshub.net/image/105222/french-f-2-rafale-launches-uss-theodore-roosevelt').then(r=>r.text());
const u=page.match(/<meta name="twitter:image" content="([^"]+)/)[1];
fs.writeFileSync('public/photos/rafale-carrier.jpg',Buffer.from(await (await fetch(u)).arrayBuffer()));
fs.mkdirSync('public/video',{recursive:true});
fs.writeFileSync('public/video/atlantic-trident.mp4',Buffer.from(await (await fetch('https://d34w7g4gy10iej.cloudfront.net/video/1705/DOD_104328412/DOD_104328412-1024x576-1769k.mp4')).arrayBuffer()));
console.log('carrier and archive video downloaded');
})();
