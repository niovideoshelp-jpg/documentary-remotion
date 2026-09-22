const fs = require('fs');
const path = require('path');
const assets = [
['photos/rafale-landing.jpg','https://media.defense.gov/2015/Dec/03/2001488660/-1/-1/0/151201-F-KB808-169.jpg'],
['photos/rafale-pilot.jpg','https://media.defense.gov/2015/Dec/03/2001488657/-1/-1/0/151201-F-KB808-284.JPG'],
['photos/rafale-taxi.jpg','https://media.defense.gov/2015/Dec/03/2001488659/-1/-1/0/151201-F-KB808-181.jpg'],
['photos/crew.jpg','https://media.defense.gov/2015/Dec/03/2001488665/-1/-1/0/151201-F-KB808-008.jpg'],
['photos/formation.jpg','https://upload.wikimedia.org/wikipedia/commons/d/d3/F-22_Raptor%2C_Eurofighter_Typhoon_and_Dassault_Rafale_fly_in_formation_-_151207-F-KB808-347.jpg'],
['fonts/Anton-Regular.ttf','https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf'],
['fonts/Oswald.ttf','https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/Oswald%5Bwght%5D.ttf'],
['fonts/Anton-OFL.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt'],
['fonts/Oswald-OFL.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/OFL.txt'],
['world.json','https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson']
];
Promise.all(assets.map(async ([name,url])=>{try{const r=await fetch(url);if(!r.ok)throw Error(r.status);const b=Buffer.from(await r.arrayBuffer());fs.writeFileSync(path.join('public',name),b);console.log(name,b.length)}catch(e){console.error(name,e.message);process.exitCode=1}}));
