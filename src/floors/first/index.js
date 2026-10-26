import * as THREE from 'three';
import { fx, fz, FL1 } from '../../core/coords.js';
import { buildStructure } from './structure.js';
import { build as buildMasterBed }  from './rooms/masterBed.js';
import { build as buildEnsuite }    from './rooms/ensuiteBath.js';
import { build as buildWalkIn }     from './rooms/walkInWard.js';
import { build as buildStudy }      from './rooms/study.js';
import { build as buildBed2 }       from './rooms/bedroom2.js';
import { build as buildBed2Bath }   from './rooms/bed2Bath.js';
import { build as buildStairLift }  from './rooms/stairLift.js';

export const ROOMS = [
  {id:'masterBed', name:'Master Bedroom',  dim:"16'6\"×14'0\"",  x0:fx(222),x1:fx(660),z0:fz(735), z1:fz(1170), furn:[{n:'Queen bed',wKey:'bedW',dKey:'bedD'},{n:'Wardrobe',w:"6'",d:"2'",clear:"3' door swing"}]},
  {id:'ensuite',   name:'Ensuite',          dim:"8'0\"×5'10\"",   x0:fx(660),x1:fx(976),z0:fz(735), z1:fz(910),  furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Basin',w:"1'6\"",d:"1'4\"",clear:"1' front"}]},
  {id:'walkIn',    name:'Walk-in Wardrobe', dim:"8'0\"×7'10\"",   x0:fx(660),x1:fx(976),z0:fz(910), z1:fz(1143), furn:[{n:'Rails + shelving',w:"full wall",d:"2'",clear:"4' dressing"}]},
  {id:'study',     name:'Study',            dim:"10'8\"×5'0\"",   x0:fx(222),x1:fx(523),z0:fz(1170),z1:fz(1320), furn:[{n:'Desk',w:"5'",d:"2'",clear:"3' chair pull"},{n:'Bookshelf',w:"6'",d:"1'",clear:""}]},
  {id:'stairF',    name:'Stair + Lift',     dim:"lift 4'×4.5'",   x0:fx(660),x1:fx(985),z0:fz(1170),z1:fz(1513), furn:[]},
  {id:'bed2',      name:'Bedroom 2',        dim:"11'0\"×11'0\"",  x0:fx(660),x1:fx(976),z0:fz(1513),z1:fz(1985), furn:[{n:'Queen bed',wKey:'bedW',dKey:'bedD'},{n:'Wardrobe',w:"5'",d:"2'",clear:"3' door swing"}]},
  {id:'bed2Bath',  name:'Toilet',           dim:"4'9\"×6'6\"",    x0:fx(481),x1:fx(660),z0:fz(1640),z1:fz(1985), furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Shower',w:"2'6\"",d:"2'6\"",clear:"floor space"}]},
  {id:'dresser',   name:'Dresser',          dim:"5'0\"×4'0\"",    x0:fx(481),x1:fx(660),z0:fz(1513),z1:fz(1640), furn:[]},
  {id:'balconyT',  name:'Top Balcony',      dim:"3'6\"×10'0\"",   x0:fx(222),x1:fx(481),z0:fz(735), z1:fz(1030), furn:[]},
  {id:'balconyS',  name:'South Balcony',    dim:"8'6\"×11'0\"",   x0:fx(222),x1:fx(481),z0:fz(1513),z1:fz(1985), furn:[]},
];

export const ROOM_LBLS = [
  {id:'masterBed', name:'Master Bed', dim:"16'6\"×14'0\"",  px:441,  pz:950,  ht:4},
  {id:'ensuite',   name:'Ensuite',    dim:"8'0\"×5'10\"",   px:818,  pz:822,  ht:4},
  {id:'walkIn',    name:'Walk-in',    dim:"8'0\"×7'10\"",   px:818,  pz:1026, ht:4},
  {id:'study',     name:'Study',      dim:"10'8\"×5'0\"",   px:372,  pz:1245, ht:4},
  {id:'stairF',    name:'Stair/Lift', dim:"4'×4.5' lift",   px:800,  pz:1340, ht:4},
  {id:'bed2',      name:'Bedroom 2',  dim:"11'0\"×11'0\"",  px:818,  pz:1750, ht:4},
  {id:'bed2Bath',  name:'Toilet',     dim:"4'9\"×6'6\"",    px:570,  pz:1812, ht:4},
  {id:'dresser',   name:'Dresser',    dim:"5'0\"×4'0\"",    px:570,  pz:1576, ht:4},
  {id:'balconyT',  name:'Balcony',    dim:"3'6\"×10'0\"",   px:351,  pz:882,  ht:4},
  {id:'balconyS',  name:'Balcony',    dim:"8'6\"×11'0\"",   px:351,  pz:1749, ht:4},
];

export const WIN_LBLS = [
  {label:"W 4'×6'",  px:222,  pz:735,  ht:5.0, mk:false},  // balcony north (blue annotation 4×6)
  {label:"V1 2'×2'", px:976,  pz:820,  ht:8.5, mk:false},  // ensuite east vent
  {label:"W1 2'×4'", px:976,  pz:1014, ht:5.5, mk:false},  // wardrobe east
  {label:"W1 2'×4'", px:976,  pz:1309, ht:5.5, mk:false},  // stair east (upper)
  {label:"W1 2'×4'", px:976,  pz:1449, ht:5.5, mk:false},  // stair east (lower)
  {label:"W1 2'×4'", px:976,  pz:1729, ht:5.5, mk:false},  // bed2 east
  {label:"W5 3'×4'", px:222,  pz:944,  ht:5.5, mk:false},  // master bed west
  {label:"W 4'×4'",  px:222,  pz:1264, ht:5.5, mk:false},  // study west
  {label:"W3 2'×8'", px:222,  pz:1672, ht:4.0, mk:false},  // south balcony west (blue)
  {label:"W1 2'×4'", px:222,  pz:1899, ht:5.5, mk:false},  // south balcony west (blue)
  {label:"V1 2'×2'", px:560,  pz:1985, ht:8.5, mk:false},  // bed2 toilet south vent
  {label:"W6 7'×5'", px:801,  pz:1985, ht:4.0, mk:false},  // bed2 south garden window
  {label:"SD 6'×7'", px:481,  pz:840,  ht:3.5, mk:false},  // balcony sliding door
  {label:"SD 6'×7'", px:481,  pz:1837, ht:3.5, mk:false},  // south balcony sliding door
];

export const MK_LBLS = [];

const ROOM_BUILDERS = [
  buildMasterBed, buildEnsuite, buildWalkIn,
  buildStudy, buildBed2, buildBed2Bath, buildStairLift,
];

export function buildFloor(scene, M, appState) {
  const structureGrp = new THREE.Group();
  const furnGrp      = new THREE.Group();
  const siteGrp      = new THREE.Group(); // empty — site is ground-only
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

  rebuild();
  rebuildFurniture();

  return { structureGrp, siteGrp, furnGrp, carGrp: null, rebuild, rebuildFurniture };
}
