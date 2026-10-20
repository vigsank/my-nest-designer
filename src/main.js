import * as THREE from 'three';
import { appState } from './state.js';
import { createMaterials } from './core/materials.js';
import { initScene, applyTheme, resize, startLoop } from './scene.js';
import { buildFloor, ROOMS, ROOM_LBLS, WIN_LBLS, MK_LBLS } from './floors/ground/index.js';
import { createLabelSystem } from './ui/labels.js';
import { walkStep, applyWalkCam, updateHUD, currentRoom } from './ui/walkMode.js';
import { initRuler } from './ui/ruler.js';
import { buildSliders, filterSliders } from './ui/sliders.js';
import { initControls } from './ui/controls.js';

const stage  = document.getElementById('stage');
const canvas = document.getElementById('c');
const lblBox = document.getElementById('labels');

const { renderer, scene, camera, controls, ground } = initScene(canvas, stage);
const M = createMaterials();

const { structureGrp, siteGrp, furnGrp, carGrp, rebuild, rebuildFurniture } =
  buildFloor(scene, M, appState);

furnGrp.visible = appState.st.furn;
if (carGrp) carGrp.visible = appState.st.car;

const labelSystem = createLabelSystem(camera, stage, lblBox, appState, ROOMS, ROOM_LBLS, WIN_LBLS, MK_LBLS);
labelSystem.buildLabels();

const rulerSVG  = document.getElementById('ruler-svg');
const rulerHint = document.getElementById('ruler-hint');
const rulerBtn  = document.getElementById('ruler-btn');

// initRuler before initControls so ruler capture:true fires first
const { rulerState, rulerLines, redrawRuler } = initRuler(
  canvas, stage, rulerSVG, rulerHint, rulerBtn, camera, scene, controls, appState
);

const { setMode } = initControls({
  canvas, stage, camera, controls, appState,
  furnGrp, carGrp, rulerState,
  ROOMS, filterSliders,
  rebuild() {
    rebuild();
    if (appState.st.marks) structureGrp.visible = true;
  },
  rebuildFurniture,
  refreshCardContent: labelSystem.refreshCardContent,
  labelSystem,
});

buildSliders(ROOMS, appState, rebuildFurniture, labelSystem.refreshCardContent);

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
  applyWalkCam: dt => applyWalkCam(dt, camera),
  updateHUD: () => {
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
