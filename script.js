// Convertit "MM:SS" en secondes totales pour les calculs mathématiques
function timeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const [min, sec] = timeStr.split(':').map(Number);
    return (min * 60) + sec;
}

// --- DONNÉES INITIALES ---
const teams = [
    { id: 'kc', name: "Karmine Corp", w: 8, l: 2 },
    { id: 'gx', name: "GIANTX", w: 6, l: 4 },
    { id: 'nav', name: "Natus Vincere", w: 7, l: 3 },
    { id: 'mko', name: "Movistar KOI", w: 5, l: 5 },
    { id: 'fnc', name: "Fnatic", w: 5, l: 5 },
    { id: 'g2', name: "G2 Esports", w: 5, l: 5 },
    { id: 'vit', name: "Team Vitality", w: 6, l: 4 },
    { id: 'rat', name: "Los Ratones", w: 5, l: 5 },
    { id: 'her', name: "Team Heretics", w: 5, l: 5 },
    { id: 'sk', name: "SK Gaming", w: 3, l: 7 },
    { id: 'shi', name: "Shifters", w: 4, l: 6 },
    { id: 'kcb', name: "Karmine Corp Blue", w: 1, l: 9 }
];

const headToHead = {
    // SEMAINE 1 JOUR 1
    'rat_fnc': { w: 'fnc', t: '32:13' },
    'shi_gx':  { w: 'gx',  t: '35:25' },
    'her_nav': { w: 'nav', t: '32:34' },
    'vit_sk':  { w: 'vit', t: '33:44' },
    'kc_kcb':  { w: 'kc',  t: '35:35' },
    'g2_mko':  { w: 'mko',  t: '31:52' },

    // SEMAINE 1 JOUR 2
    'her_shi': { w: 'shi', t: '40:19' },
    'rat_kcb': { w: 'kcb', t: '37:22' },
    'vit_nav': { w: 'nav', t: '30:41' },
    'sk_fnc':  { w: 'sk',  t: '28:12' },
    'g2_gx':   { w: 'gx',  t: '35:59' },
    'mko_kc':  { w: 'mko', t: '32:14' },
    
    // SEMAINE 1 JOUR 3
    'nav_fnc': { w: 'fnc', t: '37:50' },
    'kcb_vit': { w: 'vit', t: '36:03' },
    'her_gx':  { w: 'her', t: '41:47' },
    'shi_mko': { w: 'shi', t: '26:41' },
    'rat_kc':  { w: 'kc',  t: '37:21' },
    'sk_g2':   { w: 'g2',  t: '25:32' },

    // SEMAINE 2 JOUR 1
    'rat_gx':  { w: 'gx',  t: '24:31' },
    'nav_kcb': { w: 'nav', t: '37:55' },
    'vit_her': { w: 'her', t: '32:27' },
    'shi_g2':  { w: 'g2',  t: '29:29' },
    'sk_kc':   { w: 'kc',  t: '37:20' },
    'mko_fnc': { w: 'mko', t: '32:05' },

    // SEMAINE 2 JOUR 2
    'vit_shi': { w: 'vit', t: '32:57' },
    'sk_nav':  { w: 'nav', t: '30:43' },
    'her_rat': { w: 'rat', t: '32:49' },
    'mko_kcb': { w: 'mko', t: '25:55' },
    'fnc_gx':  { w: 'fnc', t: '28:30' },
    'kc_g2':   { w: 'kc',  t: '33:43' },

    // SEMAINE 2 JOUR 3
    'sk_kcb':  { w: 'sk',  t: '25:17' },
    'shi_rat': { w: 'rat', t: '37:25' },
    'vit_fnc': { w: 'fnc', t: '29:42' },
    'her_g2':  { w: 'g2',  t: '29:06' },
    'nav_kc':  { w: 'kc',  t: '30:48' },
    'mko_gx':  { w: 'gx',  t: '32:41' },

    // SEMAINE 3 JOUR 1
    'her_sk':  { w: 'sk',  t: '39:25' },
    'nav_gx':  { w: 'gx',  t: '34:04' },
    'shi_fnc': { w: 'shi', t: '32:20' },
    'kcb_g2':  { w: 'g2',  t: '34:00' },
    'vit_kc':  { w: 'vit', t: '32:58' },
    'mko_rat': { w: 'rat', t: '39:57' },

    // SEMAINE 3 JOUR 2
    'shi_nav': { w: 'nav', t: '41:06' },
    'her_kcb': { w: 'her', t: '42:46' },
    'vit_gx':  { w: 'vit', t: '36:38' },
    'sk_mko':  { w: 'mko', t: '36:12' },
    'kc_fnc':  { w: 'kc',  t: '30:18' },
    'rat_g2':  { w: 'rat', t: '31:32' },

    // SEMAINE 3 JOUR 3
    'kcb_fnc': { w: 'fnc', t: '33:25' },
    'sk_gx':   { w: 'gx',  t: '34:37' },
    'rat_nav': { w: 'nav', t: '30:49' },
    'vit_g2':  { w: 'g2',  t: '40:38' },
    'her_mko': { w: 'her', t: '37:49' },
    'shi_kc':  { w: 'kc',  t: '31:16' },

    // SEMAINE 4 JOUR 1
    'her_fnc': { w: 'her', t: '35:05' },
    'shi_kcb': { w: 'shi', t: '33:28' },
    'sk_rat':  { w: 'rat', t: '34:58' },
    'nav_g2':  { w: 'nav', t: '29:55' },
    'vit_mko': { w: 'vit', t: '36:40' },
    'kc_gx':   { w: 'kc',  t: '33:11' }

    // SEMAINE 4 JOUR 2
    // 'vit_lr': { w: 'lr', t: '30:00' },
    // 'kcb_gx': { w: 'gx', t: '30:00' },
    // 'sk_shi':  { w: 'shi', t: '30:00' },
    // 'nav_mko':  { w: 'nav', t: '30:00' },
    // 'her_kc': { w: 'kc', t: '30:00' },
    // 'fnc_g2':   { w: 'g2',  t: '30:00' }
};

const remainingMatches = [
    // { t1: 'her', t2: 'fnc', winner: 'her' },
    // { t1: 'shi', t2: 'kcb', winner: 'shi' },
    // { t1: 'sk',  t2: 'rat', winner: 'rat' },
    // { t1: 'nav', t2: 'g2',  winner: 'nav' },
    // { t1: 'vit', t2: 'mko', winner: 'vit' },
    // { t1: 'kc',  t2: 'gx',  winner: 'kc' },
    { t1: 'vit', t2: 'rat', winner: null },
    { t1: 'kcb', t2: 'gx',  winner: null },
    { t1: 'sk',  t2: 'shi', winner: null },
    { t1: 'nav', t2: 'mko', winner: null },
    { t1: 'her', t2: 'kc',  winner: null },
    { t1: 'fnc', t2: 'g2',  winner: null }
];

// État des Playoffs (Vainqueurs et Scores)
let pWinners = {}; 
let pScores = {}; 

// --- LOGIQUE DE CLASSEMENT ---
function calculateResults() {
    // 1. Initialisation : On crée une copie propre avec les victoires actuelles
    let current = teams.map(t => ({...t, curW: t.w, curL: t.l, sov: 0, totalVTime: 0}));
    let dynamicH2H = JSON.parse(JSON.stringify(headToHead));

    // 2. Intégrer les simulations des "Remaining Matches"
    remainingMatches.forEach(m => {
        if(m.winner) {
            const wId = m.winner === 1 ? m.t1 : m.t2;
            const lId = m.winner === 1 ? m.t2 : m.t1;
            current.find(x => x.id === wId).curW++;
            current.find(x => x.id === lId).curL++;
            // On enregistre ce match simulé dans le H2H pour le calcul SoV et Temps
            dynamicH2H[`${m.t1}_${m.t2}`] = { w: wId, t: '30:00' };
        }
    });

    // 3. Calcul du SoV et du Temps Total
    // IMPORTANT : On parcourt TOUS les matchs enregistrés dans le H2H
    current.forEach(team => {
        Object.keys(dynamicH2H).forEach(key => {
            const entry = dynamicH2H[key];
            if (entry.w === team.id) {
                const [t1, t2] = key.split('_');
                const opponentId = (t1 === team.id) ? t2 : t1;
                const opponent = current.find(x => x.id === opponentId);
                
                if (opponent) {
                    team.sov += opponent.curW; // Somme des victoires des adversaires battus
                }
                team.totalVTime += timeToSeconds(entry.t);
            }
        });
    });

    // 4. Tri avec l'ordre de priorité officiel
    return current.sort((a, b) => {
        if (b.curW !== a.curW) return b.curW - a.curW;

        const h2h = dynamicH2H[`${a.id}_${b.id}`] || dynamicH2H[`${b.id}_${a.id}`];
        if (h2h && h2h.w === a.id) return -1;
        if (h2h && h2h.w === b.id) return 1;

        if (b.sov !== a.sov) return b.sov - a.sov;

        // Tri par TEMPS MOYEN (Critère LEC officiel)
        const avgA = a.curW > 0 ? a.totalVTime / a.curW : 999999;
        const avgB = b.curW > 0 ? b.totalVTime / b.curW : 999999;
        if (avgA !== avgB) return avgA - avgB;

        return a.name.localeCompare(b.name);
    });
}

// --- RENDU UI ---
function renderStandings(sorted) {
    document.getElementById('standings').innerHTML = sorted.map((t, i) => {
        // Calcul du temps moyen (Total / Nombre de victoires)
        const avgSeconds = t.curW > 0 ? Math.round(t.totalVTime / t.curW) : 0;
        
        // Formatage en MM:SS
        const mins = Math.floor(avgSeconds / 60);
        const secs = avgSeconds % 60;
        const avgTimeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

        return `
        <div class="flex items-center justify-between p-2 rounded ${i < 8 ? 'qualified-row' : 'eliminated-row'}">
            <div class="flex items-center">
                <span class="text-[10px] text-slate-500 font-mono w-4">${i+1}</span>
                <span class="flex-1 ml-3 font-bold text-sm">${t.name}</span>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right hidden sm:block">
                   <div class="text-[8px] text-slate-500 uppercase">
                     SoV: ${t.sov} | <span class="text-slate-300">Avg: ${avgTimeStr}</span>
                   </div>
                </div>
                <span class="text-blue-400 font-bold text-xs w-8 text-right">${t.curW}-${t.curL}</span>
            </div>
        </div>
    `}).join('');
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
    const getT = (id) => teams.find(t => t.id === id) || sorted.find(t => t.id === id);
    const getWinner = (mId) => getT(pWinners[mId]);
    const getLoser = (matchId, tA, tB) => pWinners[matchId] === tA?.id ? tB : tA;

    // --- UPPER BRACKET R1 (Matches 1-4) - Bo3 ---
    // Match 1: Seed 1 vs Seed 8 (Simulation du choix par défaut)
    // Match 2: Seed 4 vs Seed 5
    // Match 3: Seed 2 vs Seed 7
    // Match 4: Seed 3 vs Seed 6
    document.getElementById('ub-r1').innerHTML = 
        createMatchCard('m1', top[0], top[7], false) + 
        createMatchCard('m2', top[3], top[4], false) +
        createMatchCard('m3', top[1], top[6], false) + 
        createMatchCard('m4', top[2], top[5], false);

    // --- UPPER BRACKET R2 (Matches 5-6) - Bo3 ---
    document.getElementById('ub-r2').innerHTML = 
        createMatchCard('m5', getWinner('m1'), getWinner('m2'), false) +
        createMatchCard('m6', getWinner('m3'), getWinner('m4'), false);

    // --- LOWER BRACKET R1 (Matches 7-8) - Bo3 ---
    // Règle 6.2.15: Loser M1 vs Loser M2 | Loser M3 vs Loser M4
    const lM1 = getLoser('m1', top[0], top[7]);
    const lM2 = getLoser('m2', top[3], top[4]);
    const lM3 = getLoser('m3', top[1], top[6]);
    const lM4 = getLoser('m4', top[2], top[5]);

    document.getElementById('lb-r1').innerHTML = 
        createMatchCard('m7', lM1, lM2, false) + 
        createMatchCard('m8', lM3, lM4, false);

    // --- LOWER BRACKET R2 (Matches 9-10) - Bo3 ---
    // Règle 6.2.16: Loser M5 vs Winner M8 | Loser M6 vs Winner M7
    document.getElementById('lb-r2').innerHTML = 
        createMatchCard('m9', getLoser('m5', getWinner('m1'), getWinner('m2')), getWinner('m8'), false) +
        createMatchCard('m10', getLoser('m6', getWinner('m3'), getWinner('m4')), getWinner('m7'), false);

    // --- UPPER FINALS (Match 11) - Bo5 ---
    document.getElementById('ub-final').innerHTML = 
        createMatchCard('m11', getWinner('m5'), getWinner('m6'), true);

    // --- LOWER BRACKET R3 (Match 12) - Bo5 ---
    document.getElementById('lb-r3').innerHTML = 
        createMatchCard('m12', getWinner('m9'), getWinner('m10'), true);

    // --- LOWER FINALS (Match 13) - Bo5 ---
    // Règle 6.2.19: Loser M11 vs Winner M12
    const lM11 = getLoser('m11', getWinner('m5'), getWinner('m6'));
    document.getElementById('lb-final').innerHTML = 
        createMatchCard('m13', lM11, getWinner('m12'), true);

    // --- GRAND FINAL (Match 14) - Bo5 ---
    document.getElementById('grand-final').innerHTML = 
        createMatchCard('m14', getWinner('m11'), getWinner('m13'), true);

    const champ = getWinner('m14');
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