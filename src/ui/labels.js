import * as THREE from 'three';
import { fx, fz, FL, FL1 } from '../core/coords.js';

export function createLabelSystem(camera, stage, lblBox, appState, floorData) {
  // floorData: { ground: {ROOMS, ROOM_LBLS, WIN_LBLS, MK_LBLS}, first: {...} }
  const labelEls = [];
  const openCards = {};
  const tmp = new THREE.Vector3();

  function activeFloor() {
    return floorData[appState.st.floor] || floorData.ground;
  }

  function roomCardHTML(roomId) {
    const { ROOMS } = activeFloor();
    const rm = ROOMS.find(r => r.id === roomId);
    if (!rm) return '';
    const furnRows = rm.furn.map(f => {
      let w = f.w || '', d = f.d || '';
      if (f.wKey) w = appState.FP[f.wKey].toFixed(1) + "'";
      if (f.dKey) d = appState.FP[f.dKey].toFixed(1) + "'";
      return `<tr><td>${f.n}</td><td>${w}${d ? '×' + d : ''}</td></tr><tr class="space-row"><td></td><td>↳ ${f.clear || ''}</td></tr>`;
    }).join('');
    return `<h3>${rm.name}</h3><div class="dim">${rm.dim}</div><table>${furnRows}</table>`;
  }

  function positionCard(roomId, card) {
    const lbl = labelEls.find(l => l.id === roomId);
    if (!lbl) return;
    tmp.copy(lbl.p).project(camera);
    if (tmp.z > 1) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    card.style.left = (tmp.x * 0.5 + 0.5) * w + 'px';
    card.style.top  = (-tmp.y * 0.5 + 0.5) * h + 'px';
  }

  function toggleRoomCard(roomId, anchorEl) {
    if (openCards[roomId]) { openCards[roomId].remove(); delete openCards[roomId]; return; }
    const card = document.createElement('div');
    card.className = 'room-card'; card.dataset.room = roomId;
    const btn = document.createElement('button');
    btn.className = 'close-btn'; btn.textContent = '×';
    btn.onclick = () => { card.remove(); delete openCards[roomId]; };
    card.innerHTML = roomCardHTML(roomId);
    card.appendChild(btn);
    lblBox.appendChild(card);
    openCards[roomId] = card;
    positionCard(roomId, card);
  }

  function buildLabels() {
    // close all open cards first
    for (const id in openCards) { openCards[id].remove(); delete openCards[id]; }
    lblBox.innerHTML = '';
    labelEls.length = 0;

    const floorBase = appState.st.floor === 'first' ? FL1 : FL;
    const { ROOM_LBLS, WIN_LBLS, MK_LBLS } = activeFloor();

    ROOM_LBLS.forEach(l => {
      const d = document.createElement('div');
      d.className = 'lb';
      d.innerHTML = `${l.name}<small>${l.dim}</small>`;
      d.dataset.room = l.id;
      d.addEventListener('click', () => toggleRoomCard(l.id, d));
      lblBox.appendChild(d);
      labelEls.push({ el: d, type: 'room', id: l.id, p: new THREE.Vector3(fx(l.px), floorBase + l.ht, fz(l.pz)) });
    });

    WIN_LBLS.forEach(l => {
      const d = document.createElement('div');
      d.className = 'lb win-lbl';
      d.innerHTML = `<b>${l.label}</b>`;
      lblBox.appendChild(d);
      labelEls.push({ el: d, type: 'win', mk: l.mk, p: new THREE.Vector3(fx(l.px), floorBase + l.ht, fz(l.pz)) });
    });

    MK_LBLS.forEach(l => {
      const d = document.createElement('div');
      d.className = 'lb mk';
      d.textContent = l.label;
      lblBox.appendChild(d);
      labelEls.push({ el: d, type: 'mk', p: new THREE.Vector3(fx(l.px), floorBase + l.ht, fz(l.pz)) });
    });
  }

  function updateLabels() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const walk = appState.st.mode === 'walk';
    lblBox.classList.toggle('narrow', w < 560);

    for (const L of labelEls) {
      let show = false;
      if (L.type === 'room') show = !walk && appState.st.labels;
      else if (L.type === 'win') show = !walk && appState.st.winlabels && (L.mk ? appState.st.marks : true);
      else if (L.type === 'mk') show = !walk && appState.st.marks;
      if (!show) { L.el.style.display = 'none'; continue; }
      tmp.copy(L.p).project(camera);
      if (tmp.z > 1 || tmp.z < -1) { L.el.style.display = 'none'; continue; }
      L.el.style.display = 'block';
      L.el.style.transform = `translate(-50%,-50%) translate(${(tmp.x * 0.5 + 0.5) * w}px,${(-tmp.y * 0.5 + 0.5) * h}px)`;
    }

    for (const id in openCards) positionCard(id, openCards[id]);
  }

  function refreshCardContent() {
    for (const id in openCards) {
      openCards[id].innerHTML = roomCardHTML(id);
      const btn = document.createElement('button');
      btn.className = 'close-btn'; btn.textContent = '×';
      btn.onclick = () => { openCards[id].remove(); delete openCards[id]; };
      openCards[id].appendChild(btn);
    }
  }

  function switchFloor() {
    buildLabels();
  }

  return { buildLabels, updateLabels, refreshCardContent, switchFloor };
}
