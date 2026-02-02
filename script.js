// --- DONNÉES INITIALES ---
const teams = [
    { id: 'kc', name: "Karmine Corp", w: 7, l: 2 },
    { id: 'gx', name: "GIANTX", w: 6, l: 3 },
    { id: 'nav', name: "Natus Vincere", w: 6, l: 3 },
    { id: 'mko', name: "Movistar KOI", w: 5, l: 4 },
    { id: 'fnc', name: "Fnatic", w: 5, l: 4 },
    { id: 'g2', name: "G2 Esports", w: 5, l: 4 },
    { id: 'vit', name: "Team Vitality", w: 5, l: 4 },
    { id: 'rat', name: "Los Ratones", w: 4, l: 5 },
    { id: 'her', name: "Team Heretics", w: 4, l: 5 },
    { id: 'sk', name: "SK Gaming", w: 3, l: 6 },
    { id: 'shi', name: "Shifters", w: 3, l: 6 },
    { id: 'kcb', name: "Karmine Corp Blue", w: 1, l: 8 }
];

const headToHead = {
    'rat_fnc': 'fnc', 'her_shi': 'shi', 'nav_fnc': 'fnc', 'rat_gx': 'gx', 'vit_shi': 'vit', 'sk_kcb': 'sk', 'her_sk': 'sk', 'shi_nav': 'nav', 'kcb_fnc': 'fnc',
    'shi_gx': 'gx', 'rat_kcb': 'kcb', 'kcb_vit': 'vit', 'nav_kcb': 'nav', 'sk_nav': 'nav', 'shi_rat': 'rat', 'nav_gx': 'gx', 'her_kcb': 'her', 'sk_gx': 'gx',
    'g2_mko': 'g2', 'vit_nav': 'nav', 'her_gx': 'her', 'vit_her': 'her', 'her_rat': 'rat', 'vit_fnc': 'fnc', 'shi_fnc': 'shi', 'vit_gx': 'vit', 'rat_nav': 'nav',
    'her_nav': 'nav', 'sk_fnc': 'sk', 'shi_mko': 'shi', 'shi_g2': 'g2', 'mko_kcb': 'mko', 'her_g2': 'g2', 'kcb_g2': 'g2', 'sk_mko': 'mko', 'vit_g2': 'g2',
    'vit_sk': 'vit', 'g2_gx': 'gx', 'rat_kc': 'kc', 'sk_kc': 'kc', 'fnc_gx': 'fnc', 'nav_kc': 'kc', 'vit_kc': 'vit', 'kc_fnc': 'kc', 'her_mko': 'her',
    'kc_kcb': 'kc', 'mko_kc': 'mko', 'sk_g2': 'g2', 'mko_fnc': 'mko', 'kc_g2': 'kc', 'mko_gx': 'gx', 'mko_rat': 'rat', 'rat_g2': 'rat', 'shi_kc': 'kc', 'mko_g2': 'mko'
};

const remainingMatches = [
    { t1: 'her', t2: 'fnc', winner: null }, { t1: 'shi', t2: 'kcb', winner: null },
    { t1: 'sk',  t2: 'rat', winner: null }, { t1: 'nav', t2: 'g2',  winner: null },
    { t1: 'vit', t2: 'mko', winner: null }, { t1: 'kc',  t2: 'gx',  winner: null },
    { t1: 'vit', t2: 'rat', winner: null }, { t1: 'kcb', t2: 'gx',  winner: null },
    { t1: 'sk',  t2: 'shi', winner: null }, { t1: 'nav', t2: 'mko', winner: null },
    { t1: 'her', t2: 'kc',  winner: null }, { t1: 'fnc', t2: 'g2',  winner: null }
];

// État des Playoffs (Vainqueurs et Scores)
let pWinners = {}; 
let pScores = {}; 

// --- LOGIQUE DE CLASSEMENT ---
function calculateResults() {
    let current = teams.map(t => ({...t, curW: t.w, curL: t.l}));
    let dynamicH2H = { ...headToHead };

    remainingMatches.forEach(m => {
        if(m.winner === 1) { 
            current.find(x => x.id === m.t1).curW++; 
            current.find(x => x.id === m.t2).curL++;
            dynamicH2H[`${m.t1}_${m.t2}`] = m.t1;
        }
        if(m.winner === 2) { 
            current.find(x => x.id === m.t2).curW++; 
            current.find(x => x.id === m.t1).curL++;
            dynamicH2H[`${m.t1}_${m.t2}`] = m.t2;
        }
    });

    return current.sort((a, b) => {
        if (b.curW !== a.curW) return b.curW - a.curW;
        const winnerId = dynamicH2H[`${a.id}_${b.id}`] || dynamicH2H[`${b.id}_${a.id}`];
        if (winnerId) return winnerId === a.id ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

// --- RENDU UI ---
function renderStandings(sorted) {
    document.getElementById('standings').innerHTML = sorted.map((t, i) => `
        <div class="flex items-center justify-between p-2 rounded ${i < 8 ? 'qualified-row' : 'eliminated-row'}">
            <span class="text-xs text-slate-500 font-mono">${i+1}</span>
            <span class="flex-1 ml-3 font-bold text-sm">${t.name}</span>
            <span class="text-blue-400 font-bold text-xs">${t.curW}-${t.curL}</span>
        </div>
    `).join('');
}

function createMatchCard(id, teamA, teamB, isBo5 = false) {
    const scoreA = pScores[`${id}_a`] || 0;
    const scoreB = pScores[`${id}_b`] || 0;
    const max = isBo5 ? 3 : 2;

    const renderTeam = (team, side) => {
        const isSelected = pWinners[id] === team?.id && team;
        return `
            <div class="flex items-center justify-between border-b border-slate-700 last:border-0 h-[40px]">
                <div onclick="winPlayoff('${id}', '${team?.id}')" 
                     class="match-team flex-1 cursor-pointer h-full flex items-center px-3 ${isSelected ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}">
                    ${team?.name || 'TBD'}
                </div>
                <input type="number" min="0" max="${max}" value="${side === 'a' ? scoreA : scoreB}" 
                       onchange="setScore('${id}', '${side}', this.value)"
                       class="w-10 bg-slate-900 text-center text-xs font-bold border-l border-slate-700 focus:outline-none focus:bg-slate-800 h-full">
            </div>
        `;
    };

    return `
        <div class="match-card bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg mb-4">
            ${renderTeam(teamA, 'a')}
            ${renderTeam(teamB, 'b')}
        </div>
    `;
}

function renderPlayoffs(sorted) {
    const top = sorted.slice(0, 8);
    const getT = (id) => teams.find(t => t.id === id);
    const getLoser = (matchId, tA, tB) => pWinners[matchId] === tA?.id ? tB : tA;

    // UPPER BRACKET
    document.getElementById('ub-r1').innerHTML = 
        createMatchCard('m1', top[0], top[7]) + createMatchCard('m2', top[3], top[4]) +
        createMatchCard('m3', top[1], top[6]) + createMatchCard('m4', top[2], top[5]);

    document.getElementById('ub-r2').innerHTML = 
        createMatchCard('sem1', getT(pWinners.m1), getT(pWinners.m2)) +
        createMatchCard('sem2', getT(pWinners.m3), getT(pWinners.m4));

    document.getElementById('ub-final').innerHTML = createMatchCard('ufin', getT(pWinners.sem1), getT(pWinners.sem2), true);

    // LOWER BRACKET
    const l1a = getLoser('m1', top[0], top[7]);
    const l1b = getLoser('m2', top[3], top[4]);
    const l1c = getLoser('m3', top[1], top[6]);
    const l1d = getLoser('m4', top[2], top[5]);
    
    document.getElementById('lb-r1').innerHTML = createMatchCard('l1', l1a, l1b) + createMatchCard('l2', l1c, l1d);

    document.getElementById('lb-r2').innerHTML = 
        createMatchCard('l3', getT(pWinners.l1), getLoser('sem2', getT(pWinners.m3), getT(pWinners.m4))) +
        createMatchCard('l4', getT(pWinners.l2), getLoser('sem1', getT(pWinners.m1), getT(pWinners.m2)));

    document.getElementById('lb-r3').innerHTML = createMatchCard('lsem', getT(pWinners.l3), getT(pWinners.l4), true);

    const lfinal_opp = getLoser('ufin', getT(pWinners.sem1), getT(pWinners.sem2));
    document.getElementById('lb-final').innerHTML = createMatchCard('lfin', getT(pWinners.lsem), lfinal_opp, true);

    // GRAND FINAL
    document.getElementById('grand-final').innerHTML = createMatchCard('gf', getT(pWinners.ufin), getT(pWinners.lfin), true);

    const champ = getT(pWinners.gf);
    document.getElementById('winner-name').innerText = champ ? champ.name : '???';
}

// --- ACTIONS UTILISATEUR ---
window.winPlayoff = (matchId, teamId) => {
    if(!teamId || teamId === 'undefined') return;
    pWinners[matchId] = teamId;
    updateApp();
};

window.setScore = (matchId, side, val) => {
    pScores[`${matchId}_${side}`] = val;
    // On ne rafraîchit pas tout pour garder le focus sur l'input, sauf si on veut auto-déterminer le gagnant
};

window.setWinner = (idx, side) => {
    remainingMatches[idx].winner = side;
    initMatches();
    updateApp();
};

function initMatches() {
    document.getElementById('matches-grid').innerHTML = remainingMatches.map((m, i) => `
        <div class="flex items-center bg-slate-800 p-2 rounded-xl border border-slate-700">
            <button onclick="setWinner(${i}, 1)" class="flex-1 p-2 rounded text-[10px] uppercase font-bold ${m.winner === 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}">${teams.find(t=>t.id===m.t1).name}</button>
            <span class="px-2 text-slate-600 text-[10px] font-black italic">VS</span>
            <button onclick="setWinner(${i}, 2)" class="flex-1 p-2 rounded text-[10px] uppercase font-bold ${m.winner === 2 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}">${teams.find(t=>t.id===m.t2).name}</button>
        </div>
    `).join('');
}

function updateApp() {
    const sorted = calculateResults();
    renderStandings(sorted);
    renderPlayoffs(sorted);
}

// Lancement
initMatches();
updateApp();