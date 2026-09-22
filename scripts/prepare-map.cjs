const fs=require('fs');
const world=JSON.parse(fs.readFileSync('public/world.json','utf8'));
console.log(world.features[0].properties);
console.log(world.features.filter(f=>['France','United Kingdom','Germany','Spain','Italy'].includes(f.properties.name || f.properties.ADMIN)).map(f=>f.properties));
fetch('https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2111/6954094/2000w_q95.jpg').then(r=>r.arrayBuffer()).then(b=>fs.writeFileSync('public/photos/typhoon-refuel.jpg',Buffer.from(b)));
