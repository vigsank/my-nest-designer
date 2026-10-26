import * as THREE from 'three';
import { fx, fz, FL2 } from '../../core/coords.js';
import { buildStructure } from './structure.js';
import { build as buildHomeTheatre } from './rooms/homeTheatre.js';
import { build as buildOffice }      from './rooms/office.js';
import { build as buildStore }       from './rooms/store.js';
import { build as buildToilet }      from './rooms/toilet.js';
import { build as buildWashArea }    from './rooms/washArea.js';
import { build as buildStairLift }   from './rooms/stairLift.js';

export const ROOMS = [
  {id:'homeTheatre', name:'Home Theatre',  dim:"14'8\"×14'0\"", x0:fx(156),x1:fx(660),z0:fz(648), z1:fz(1170), furn:[{n:'Screen',w:"6'",d:"0.2'",clear:""},{n:'Seating (3 rows)',w:"6'",d:"3'",clear:"3' aisle"}]},
  {id:'office',      name:'Office',         dim:"10'0\"×5'10\"", x0:fx(660),x1:fx(985),z0:fz(648), z1:fz(910),  furn:[{n:'Desk',w:"4'",d:"2'",clear:"3' chair"},{n:'Bookshelf',w:"6'",d:"1'",clear:""}]},
  {id:'store',       name:'Store',          dim:"10'0\"×7'10\"", x0:fx(660),x1:fx(985),z0:fz(910), z1:fz(1170), furn:[{n:'Shelving (east)',w:"full",d:"1'6\"",clear:""},{n:'Shelving (north)',w:"6'",d:"1'6\"",clear:""}]},
  {id:'toilet',      name:'Toilet',         dim:"8'8\"×5'0\"",   x0:fx(156),x1:fx(481),z0:fz(1170),z1:fz(1320), furn:[{n:'WC',w:"2'",d:"2'6\"",clear:"2' front"},{n:'Basin',w:"2'",d:"1'4\"",clear:"1' front"}]},
  {id:'stairS',      name:'Stair + Lift',   dim:"lift 4'×4.5'",  x0:fx(660),x1:fx(985),z0:fz(1170),z1:fz(1513), furn:[]},
  {id:'washArea',    name:'Wash Area',      dim:"8'5\"×4'0\"",   x0:fx(660),x1:fx(985),z0:fz(1513),z1:fz(1985), furn:[{n:'Washer',w:"2'",d:"2'",clear:""},{n:'Dryer',w:"2'",d:"2'",clear:""}]},
  {id:'terrace',     name:'Open Terrace',   dim:"16'0\"×15'6\"", x0:fx(156),x1:fx(660),z0:fz(1513),z1:fz(1985), furn:[]},
];

export const ROOM_LBLS = [
  {id:'homeTheatre', name:'Home Theatre', dim:"14'8\"×14'0\"", px:408,  pz:909,  ht:4},
  {id:'office',      name:'Office',       dim:"10'0\"×5'10\"", px:822,  pz:779,  ht:4},
  {id:'store',       name:'Store',        dim:"10'0\"×7'10\"", px:822,  pz:1040, ht:4},
  {id:'toilet',      name:'Toilet',       dim:"8'8\"×5'0\"",   px:318,  pz:1245, ht:4},
  {id:'stairS',      name:'Stair/Lift',   dim:"lift 4'×4.5'",  px:822,  pz:1340, ht:4},
  {id:'washArea',    name:'Wash Area',    dim:"8'5\"×4'0\"",   px:822,  pz:1749, ht:4},
  {id:'terrace',     name:'Terrace',      dim:"16'0\"×15'6\"", px:408,  pz:1749, ht:4},
];

export const WIN_LBLS = [
  {label:"W 4'×4'",  px:156,  pz:794,  ht:5.5, mk:false},  // home theatre west window
  {label:"W 4'×4'",  px:269,  pz:648,  ht:5.5, mk:false},  // home theatre north window
  {label:"W 4'×4'",  px:755,  pz:648,  ht:5.5, mk:false},  // office/store north window
  {label:"W 4'×4'",  px:985,  pz:779,  ht:5.5, mk:false},  // office east window
  {label:"W1 2'×4'", px:985,  pz:1300, ht:5.5, mk:false},  // stair east upper
  {label:"W1 2'×4'", px:985,  pz:1450, ht:5.5, mk:false},  // stair east lower
  {label:"V1 2'×2'", px:156,  pz:1235, ht:8.5, mk:false},  // toilet west vent
  {label:"W 4'×4'",  px:604,  pz:1985, ht:5.5, mk:false},  // south wall window
  {label:"SD 6'×7'", px:320,  pz:1513, ht:3.5, mk:false},  // terrace sliding door
];

export const MK_LBLS = [];

const ROOM_BUILDERS = [
  buildHomeTheatre, buildOffice, buildStore,
  buildToilet, buildWashArea, buildStairLift,
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

  rebuild();
  rebuildFurniture();

  return { structureGrp, siteGrp, furnGrp, carGrp: null, rebuild, rebuildFurniture };
}
