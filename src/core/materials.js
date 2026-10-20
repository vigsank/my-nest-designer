import * as THREE from 'three';

export function std(c, r = 0.9, m = 0) {
  return new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
}

export function createMaterials() {
  return {
    wall: std(0xf0ece4, .90),           // off-white walls — light, matte
    plinth: std(0xbdb6a8, .95),
    col: Object.assign(std(0x2c2f36, .8), { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }),
    frame: std(0x3a3f48, .5, .4),
    floor: std(0xc8b99a, .65),          // warm sandstone — clearly distinct from walls
    floorK: std(0xa8b5b8, .55),         // kitchen: cool slate grey tile
    floorW: std(0x8fa4ae, .50),         // wet-area: darker grey-blue tile
    floorB: std(0xb98b5f, .60),         // bedroom: warm timber tone
    floorP: std(0xdcd5c5, .55),         // pooja: pale stone
    porch: std(0xcdbfa9, .8),
    door: std(0x8a5a36, .6),
    steel: std(0x9aa3ad, .35, .7),
    dark: std(0x20242b, .5),
    glass: new THREE.MeshStandardMaterial({ color:0x9ec9e2, roughness:.08, metalness:.1, transparent:true, opacity:.32, depthWrite:false }),
    glassMk: new THREE.MeshStandardMaterial({ color:0xb48cff, roughness:.1, metalness:.1, transparent:true, opacity:.6, depthWrite:false, emissive:0x5a2aa8, emissiveIntensity:.35 }),
    glassFG: new THREE.MeshStandardMaterial({ color:0xc8e8f5, roughness:.05, metalness:.05, transparent:true, opacity:.45, depthWrite:false }),
    glassSD: new THREE.MeshStandardMaterial({ color:0x7ab8e8, roughness:.06, metalness:.15, transparent:true, opacity:.55, depthWrite:false }),
    wood: std(0xa9784a, .6),
    woodD: std(0x6d4a2f, .6),
    fabric: std(0xc7b9a6, .95),
    fabricD: std(0x7f8794, .95),
    white: std(0xf6f6f4, .4),
    cream: std(0xefe6d2, .7),
    counter: std(0x24272d, .3, .1),
    cab: std(0xe9e4da, .7),
    cabU: std(0xd9d2c4, .7),
    soil: std(0x5a4636, 1),
    stone: std(0xa7a095, .9),
    paving: std(0xd6d2c9, .95),
    park: std(0xb4b0a6, .95),
    grass: std(0x6c9a55, 1),
    leaf: std(0x2f6a3a, .9),
    leaf2: std(0x4f8f45, .9),
    leaf3: std(0x8fc277, .9),
    trunk: std(0x6a4d36, .9),
    car: std(0x2f5d7c, .35, .3),
    carG: std(0x182430, .1, .5),
    tire: std(0x15171b, .9),
    rug: std(0xd9cdb8, 1),
    rug2: std(0xb9c3cf, 1),
    slab: std(0xe8e4dc, .9),
    lift: std(0xd7d3ca, .8),
    light: new THREE.MeshBasicMaterial({ color: 0xfff1c8 }),
    vent: std(0xaaaaaa, .7)
  };
}
