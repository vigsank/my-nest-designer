import * as THREE from 'three';
import { appState } from './state.js';
import { createMaterials } from './core/materials.js';
import { initScene, applyTheme, resize, startLoop } from './scene.js';
import { FL1, FL2 } from './core/coords.js';
import {
  buildFloor as buildGround,
  ROOMS as G_ROOMS, ROOM_LBLS as G_ROOM_LBLS, WIN_LBLS as G_WIN_LBLS, MK_LBLS as G_MK_LBLS,
} from './floors/ground/index.js';
import {
  buildFloor as buildFirst,
  ROOMS as F_ROOMS, ROOM_LBLS as F_ROOM_LBLS, WIN_LBLS as F_WIN_LBLS, MK_LBLS as F_MK_LBLS,
} from './floors/first/index.js';
import {
  buildFloor as buildSecond,
  ROOMS as S_ROOMS, ROOM_LBLS as S_ROOM_LBLS, WIN_LBLS as S_WIN_LBLS, MK_LBLS as S_MK_LBLS,
} from './floors/second/index.js';
import { createLabelSystem } from './ui/labels.js';
import { walkStep, applyWalkCam, updateHUD, currentRoom } from './ui/walkMode.js';
import { initRuler } from './ui/ruler.js';
import { initJoineryTooltip } from './ui/joinery-tooltip.js';
import { buildSliders, filterSliders } from './ui/sliders.js';
import { initControls } from './ui/controls.js';

const stage  = document.getElementById('stage');
const canvas = document.getElementById('c');
const lblBox = document.getElementById('labels');

const { renderer, scene, camera, controls, ground } = initScene(canvas, stage);
const M = createMaterials();

// Build order: second first, then first, then ground — so SOL ends as ground floor data
const sFloor = buildSecond(scene, M, appState);
const fFloor = buildFirst(scene, M, appState);
const gFloor = buildGround(scene, M, appState);

// Initial state: ground visible, first + second hidden
gFloor.structureGrp.visible = true;
gFloor.furnGrp.visible = appState.st.furn;
gFloor.siteGrp.visible = true;
if (gFloor.carGrp) gFloor.carGrp.visible = appState.st.car;

fFloor.structureGrp.visible = false;
fFloor.furnGrp.visible = false;
fFloor.siteGrp.visible = false;

sFloor.structureGrp.visible = false;
sFloor.furnGrp.visible = false;
sFloor.siteGrp.visible = false;

const floorData = {
  ground: { ROOMS: G_ROOMS, ROOM_LBLS: G_ROOM_LBLS, WIN_LBLS: G_WIN_LBLS, MK_LBLS: G_MK_LBLS },
  first:  { ROOMS: F_ROOMS, ROOM_LBLS: F_ROOM_LBLS, WIN_LBLS: F_WIN_LBLS, MK_LBLS: F_MK_LBLS },
  second: { ROOMS: S_ROOMS, ROOM_LBLS: S_ROOM_LBLS, WIN_LBLS: S_WIN_LBLS, MK_LBLS: S_MK_LBLS },
};

const labelSystem = createLabelSystem(camera, stage, lblBox, appState, floorData);
labelSystem.buildLabels();

const rulerSVG  = document.getElementById('ruler-svg');
const rulerHint = document.getElementById('ruler-hint');
const rulerBtn  = document.getElementById('ruler-btn');

// initRuler before initControls so ruler capture:true fires first
const { rulerState, rulerLines, redrawRuler } = initRuler(
  canvas, stage, rulerSVG, rulerHint, rulerBtn, camera, scene, controls, appState
);

initJoineryTooltip(canvas, stage, camera, scene, appState, rulerState);

function activeROOMS() {
  if (appState.st.floor === 'second') return S_ROOMS;
  if (appState.st.floor === 'first')  return F_ROOMS;
  return G_ROOMS;
}

function setFloor(f) {
  appState.st.floor = f;
  const onG = f === 'ground';
  const onF = f === 'first';
  const onS = f === 'second';

  gFloor.structureGrp.visible = onG;
  gFloor.furnGrp.visible = onG && appState.st.furn;
  gFloor.siteGrp.visible = true; // site always visible
  if (gFloor.carGrp) gFloor.carGrp.visible = appState.st.car;

  fFloor.structureGrp.visible = onF;
  fFloor.furnGrp.visible = onF && appState.st.furn;
  fFloor.siteGrp.visible = false;

  sFloor.structureGrp.visible = onS;
  sFloor.furnGrp.visible = onS && appState.st.furn;
  sFloor.siteGrp.visible = false;

  labelSystem.switchFloor();

  document.querySelectorAll('[data-floor]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.floor === f))
  );

  // reposition camera for the active floor
  const yOff = onS ? FL2 : onF ? FL1 : 0;
  controls.target.set(15, yOff + 2, 25);
  controls.enableDamping = false;
  controls.update();
  controls.enableDamping = true;

  // Repopulate SOL for the newly active floor's collision geometry
  if (onG) gFloor.rebuild(); else if (onF) fFloor.rebuild(); else sFloor.rebuild();
}

const { setMode } = initControls({
  canvas, stage, camera, controls, appState,
  gFloor, fFloor, sFloor,
  rulerState,
  activeROOMS,
  filterSliders,
  rebuild() {
    if (appState.st.floor === 'ground') {
      gFloor.rebuild();
    } else if (appState.st.floor === 'first') {
      fFloor.rebuild();
    } else {
      sFloor.rebuild();
    }
  },
  rebuildFurniture() {
    if (appState.st.floor === 'ground') gFloor.rebuildFurniture();
    else if (appState.st.floor === 'first') fFloor.rebuildFurniture();
    else sFloor.rebuildFurniture();
  },
  refreshCardContent: labelSystem.refreshCardContent,
  labelSystem,
  setFloor,
});

// Floor switcher buttons
document.querySelectorAll('[data-floor]').forEach(b =>
  b.addEventListener('click', () => setFloor(b.dataset.floor))
);

buildSliders(G_ROOMS, appState, () => gFloor.rebuildFurniture(), labelSystem.refreshCardContent);

applyTheme(scene, ground);
matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => applyTheme(scene, ground));
new MutationObserver(() => applyTheme(scene, ground))
  .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

new ResizeObserver(() => resize(renderer, camera, stage)).observe(stage);
resize(renderer, camera, stage);

const clock = new THREE.Clock();
let lastRoomId = null;
let lastMode = null;

startLoop({
  clock,
  renderer, scene, camera, controls, appState,
  walkStep: dt => walkStep(dt, appState),
  applyWalkCam: dt => applyWalkCam(dt, camera, appState),
  updateHUD: () => {
    const ROOMS = activeROOMS();
    updateHUD(ROOMS, appState.FP, appState);
    if (appState.st.mode === 'walk') {
      if (lastMode !== 'walk') { lastRoomId = null; }
      const rm = currentRoom(ROOMS);
      const id = rm ? rm.id : null;
      if (id !== lastRoomId) { lastRoomId = id; filterSliders(id); }
    }
    lastMode = appState.st.mode;
  },
  updateLabels: labelSystem.updateLabels,
  redrawRuler,
  rulerState, rulerLines,
});

setMode('orbit');

document.getElementById('loading').remove();
