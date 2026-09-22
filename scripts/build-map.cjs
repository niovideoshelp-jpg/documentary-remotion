const fs=require('fs');
const world=JSON.parse(fs.readFileSync('public/world.json','utf8'));
const project=([lon,lat])=>[960+(lon-10)*30,540-(Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))-Math.log(Math.tan(Math.PI/4+49*Math.PI/360)))*1720];
const countries=world.features.filter(f=>f.geometry).map(f=>{
const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
const rings=polys.filter(poly=>poly[0].some(([x,y])=>x>-25&&x<45&&y>27&&y<70)).flatMap(p=>p);
const d=rings.map(r=>{const points=r.filter((p,i)=>i===0||i===r.length-1||Math.hypot(p[0]-r[i-1][0],p[1]-r[i-1][1])>.018||i%4===0).map(project);return points.length>2?'M'+points.map(p=>p.map(n=>n.toFixed(1)).join(',')).join('L')+'Z':''}).join('');
return {name:f.properties.name,d};
}).filter(f=>f.d);
fs.writeFileSync('src/data/europe.json',JSON.stringify(countries));
console.log(countries.length,'countries',fs.statSync('src/data/europe.json').size,'bytes');
