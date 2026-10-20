import * as THREE from 'three';
import { fx, fz, FL } from '../../core/coords.js';
import { buildStructure } from './structure.js';
import { buildSite } from './site.js';
import { build as buildPooja }     from './rooms/pooja.js';
import { build as buildDining }    from './rooms/dining.js';
import { build as buildKitchen }   from './rooms/kitchen.js';
import { build as buildUtility }   from './rooms/utility.js';
import { build as buildLiving }    from './rooms/living.js';
import { build as buildFoyer }     from './rooms/foyer.js';
import { build as buildPorch }     from './rooms/porch.js';
import { build as buildPowder }    from './rooms/powder.js';
import { build as buildToilet }    from './rooms/toilet.js';
import { build as buildBedroom1 }  from './rooms/bedroom1.js';
import { build as buildBath }      from './rooms/bath.js';
import { build as buildStairLift } from './rooms/stairLift.js';

export const ROOMS = [
  {id:'pooja',   name:'Pooja',       dim:"4'0\"×6'0\"",   x0:fx(222),x1:fx(358),z0:fz(735), z1:fz(931),  furn:[{n:'Planter/altar',w:"2'",d:"2'",clear:"~1.5' each side"}]},
  {id:'dining',  name:'Dining',      dim:"10'2\"×14'0\"",  x0:fx(358),x1:fx(660),z0:fz(735), z1:fz(1170), furn:[{n:'Dining table',wKey:'diningW',dKey:'diningD'},{n:'Chairs (6)',w:"1'6\"×1'6\"",d:'',clear:"2.5' around table"}]},
  {id:'kitchen', name:'Kitchen',     dim:"10'6\"×11'0\"",  x0:fx(660),x1:fx(976),z0:fz(832), z1:fz(1170), furn:[{n:'L-counter',w:"8'",d:"2'",clear:"4' aisle"},{n:'Fridge',w:"2'6\"",d:"2'4\"",clear:'side'}]},
  {id:'utility', name:'Utility',     dim:"12'6\"×6'0\"",   x0:fx(660),x1:fx(976),z0:fz(735), z1:fz(832),  furn:[{n:'Wash counter',w:"5'",d:"2'",clear:"3' front"}]},
  {id:'living',  name:'Living Area', dim:"14'6\"×11'2\"",  x0:fx(222),x1:fx(660),z0:fz(1170),z1:fz(1513), furn:[{n:'Sofa (3-seat)',wKey:'sofaW',dKey:'sofaD'},{n:'Coffee table',w:"3'",d:"1'8\"",clear:"3' front sofa"}]},
  {id:'foyer',   name:'Foyer',       dim:"6'7\"×4'0\"",    x0:fx(285),x1:fx(480),z0:fz(1513),z1:fz(1643), furn:[]},
  {id:'porch',   name:'Porch',       dim:"4'3\"×7'6\"",    x0:fx(156),x1:fx(285),z0:fz(1513),z1:fz(1740), furn:[]},
  {id:'powder',  name:'Powder',      dim:"4'9\"×4'0\"",    x0:fx(480),x1:fx(660),z0:fz(1643),z1:fz(1787), furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Basin',w:"1'6\"",d:"1'4\"",clear:"1' front"}]},
  {id:'toilet',  name:'Toilet',      dim:"4'9\"×6'6\"",    x0:fx(480),x1:fx(660),z0:fz(1787),z1:fz(1978), furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Shower',w:"2'6\"",d:"2'6\"",clear:'floor space'}]},
  {id:'bed1',    name:'Bedroom 1',   dim:"11'0\"×10'10\"", x0:fx(660),x1:fx(976),z0:fz(1643),z1:fz(1978), furn:[{n:'Queen bed',wKey:'bedW',dKey:'bedD'},{n:'Wardrobe',w:"5'",d:"2'",clear:"3' door swing"},{n:'Side tables (×2)',w:"1'6\"",d:"1'6\"",clear:'beside bed'}]},
  {id:'bath',    name:'Bath',        dim:"5'6\"×3'6\"",    x0:fx(800),x1:fx(976),z0:fz(1513),z1:fz(1643), furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Shower',w:"2'6\"",d:"2'",clear:'floor'}]},
  {id:'stair',   name:'Stair + Lift',dim:"lift 4'×4.5'",   x0:fx(660),x1:fx(976),z0:fz(1170),z1:fz(1513), furn:[]},
  {id:'parking', name:'Parking',     dim:"11'0\"×16'0\"",  x0:fx(156),x1:fx(480),z0:fz(1643),z1:fz(1985), furn:[{n:'Car',w:"7'",d:"14'",clear:"2' sides, 4' rear"}]},
];

export const ROOM_LBLS = [
  {id:'pooja',   name:'Pooja',      dim:"4'0\"×6'0\"",   px:289, pz:840,  ht:6},
  {id:'dining',  name:'Dining',     dim:"10'2\"×14'0\"",  px:500, pz:940,  ht:3},
  {id:'kitchen', name:'Kitchen',    dim:"10'6\"×11'0\"",  px:800, pz:1000, ht:5.5},
  {id:'utility', name:'Utility',    dim:"12'6\"×6'0\"",   px:820, pz:775,  ht:2},
  {id:'living',  name:'Living',     dim:"14'6\"×11'2\"",  px:380, pz:1320, ht:4},
  {id:'stair',   name:'Stair/Lift', dim:"4'×4.5' lift",   px:800, pz:1380, ht:10.5},
  {id:'foyer',   name:'Foyer',      dim:"6'7\"×4'0\"",    px:385, pz:1580, ht:5},
  {id:'porch',   name:'Porch',      dim:"4'3\"×7'6\"",    px:220, pz:1640, ht:4.5},
  {id:'parking', name:'Parking',    dim:"11'0\"×16'0\"",  px:300, pz:1870, ht:5},
  {id:'powder',  name:'Powder',     dim:"4'9\"×4'0\"",    px:566, pz:1710, ht:5},
  {id:'toilet',  name:'Toilet',     dim:"4'9\"×6'6\"",    px:566, pz:1880, ht:5},
  {id:'bed1',    name:'Bedroom 1',  dim:"11'0\"×10'10\"", px:820, pz:1810, ht:5},
  {id:'bath',    name:'Bath',       dim:"5'6\"×3'6\"",    px:885, pz:1580, ht:5},
  {id:'garden',  name:'Garden',     dim:"19'0\"×4'7\"",   px:760, pz:2060, ht:3},
];

export const WIN_LBLS = [
  {label:"2'×6' W",  px:289, pz:743,  ht:7.4, mk:true},
  {label:"SD 6'×7'", px:508, pz:743,  ht:4.0, mk:false},
  {label:"FG 4'×8'", px:222, pz:866,  ht:5.0, mk:false},
  {label:"FG full",   px:358, pz:833,  ht:5.5, mk:false},
  {label:"W3 2'×8'", px:222, pz:1400, ht:5.0, mk:false},
  {label:"7'×3.5'",  px:976, pz:983,  ht:5.0, mk:true},
  {label:"W1 2'×4'", px:976, pz:1220, ht:6.0, mk:false},
  {label:"W1 2'×4'", px:976, pz:1490, ht:6.0, mk:false},
  {label:"W1 2'×4'", px:976, pz:1920, ht:5.5, mk:false},
  {label:"2'×2'",    px:928, pz:832,  ht:5.0, mk:true},
  {label:"W4 2'×4'", px:487, pz:1695, ht:5.0, mk:false},
  {label:"W 4'×4'",  px:415, pz:1643, ht:5.5, mk:false},
  {label:"W2 6'×4'", px:784, pz:1978, ht:5.5, mk:false},
  {label:"V1 2'×2'", px:560, pz:1978, ht:6.5, mk:false},
  {label:"MD 4'×7'", px:285, pz:1578, ht:4.0, mk:false},
];

export const MK_LBLS = [
  {label:"2'×6' win",    px:289, pz:743,  ht:7.4},
  {label:"Closed",       px:820, pz:832,  ht:6},
  {label:"7'×3.5'",      px:976, pz:983,  ht:5.0},
  {label:"Lift 4'×4.5'", px:796, pz:1357, ht:11.7},
];

const ROOM_BUILDERS = [
  buildPooja, buildDining, buildKitchen, buildUtility,
  buildLiving, buildFoyer, buildPorch, buildPowder,
  buildToilet, buildBedroom1, buildBath, buildStairLift,
];

export function buildFloor(scene, M, appState) {
  const structureGrp = new THREE.Group();
  const furnGrp      = new THREE.Group();
  const siteGrp      = new THREE.Group();
  scene.add(structureGrp, furnGrp, siteGrp);

  function addFurnSOL(x0, x1, z0, z1) {
    appState.SOLX.push([x0, x1, z0, z1]);
  }

  function rebuild() {
    buildStructure(structureGrp, M, appState);
  }

  function rebuildFurniture() {
    furnGrp.clear();
    appState.SOLX.length = 0;
    for (const builder of ROOM_BUILDERS) {
      builder(furnGrp, M, appState.FP, addFurnSOL);
    }
  }

  const carGrp = buildSite(siteGrp, M, appState);
  rebuild();
  rebuildFurniture();

  return { structureGrp, siteGrp, furnGrp, carGrp, rebuild, rebuildFurniture };
}
