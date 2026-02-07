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
    'rat_fnc': 'fnc', 'her_shi': 'shi', 'nav_fnc': 'fnc', 'rat_gx': 'gx', 'vit_shi': 'vit', 'sk_kcb': 'sk', 'her_sk': 'sk', 'shi_nav': 'nav', 'kcb_fnc': 'fnc',
    'shi_gx': 'gx', 'rat_kcb': 'kcb', 'kcb_vit': 'vit', 'nav_kcb': 'nav', 'sk_nav': 'nav', 'shi_rat': 'rat', 'nav_gx': 'gx', 'her_kcb': 'her', 'sk_gx': 'gx',
    'g2_mko': 'g2', 'vit_nav': 'nav', 'her_gx': 'her', 'vit_her': 'her', 'her_rat': 'rat', 'vit_fnc': 'fnc', 'shi_fnc': 'shi', 'vit_gx': 'vit', 'rat_nav': 'nav',
    'her_nav': 'nav', 'sk_fnc': 'sk', 'shi_mko': 'shi', 'shi_g2': 'g2', 'mko_kcb': 'mko', 'her_g2': 'g2', 'kcb_g2': 'g2', 'sk_mko': 'mko', 'vit_g2': 'g2',
    'vit_sk': 'vit', 'g2_gx': 'gx', 'rat_kc': 'kc', 'sk_kc': 'kc', 'fnc_gx': 'fnc', 'nav_kc': 'kc', 'vit_kc': 'vit', 'kc_fnc': 'kc', 'her_mko': 'her',
    'kc_kcb': 'kc', 'mko_kc': 'mko', 'sk_g2': 'g2', 'mko_fnc': 'mko', 'kc_g2': 'kc', 'mko_gx': 'gx', 'mko_rat': 'rat', 'rat_g2': 'rat', 'shi_kc': 'kc', 'mko_g2': 'mko',
    'her_fnc': 'her', 'shi_kcb': 'shi', 'sk_rat': 'rat', 'nav_g2': 'nav', 'vit_mko': 'vit',
    'kc_gx': 'kc'
};

const remainingMatches = [
    { t1: 'vit', t2: 'rat', winner: null }, { t1: 'kcb', t2: 'gx', winner: null },
    { t1: 'sk', t2: 'shi', winner: null }, { t1: 'nav', t2: 'mko', winner: null },
    { t1: 'her', t2: 'kc', winner: null }, { t1: 'fnc', t2: 'g2', winner: null }
];

// État des Playoffs (Vainqueurs et Scores)
let pWinners = {};
let pScores = {};

// --- LOGIQUE DE CLASSEMENT ---
// Pure function: takes an array of {t1, t2, winner} with all winners filled (1 or 2)
function calculateStandings(matchOutcomes) {
    let current = teams.map(t => ({ ...t, curW: t.w, curL: t.l }));
    let dynamicH2H = { ...headToHead };

    matchOutcomes.forEach(m => {
        if (m.winner === 1) {
            current.find(x => x.id === m.t1).curW++;
            current.find(x => x.id === m.t2).curL++;
            dynamicH2H[`${m.t1}_${m.t2}`] = m.t1;
        }
        if (m.winner === 2) {
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

function calculateResults() {
    return calculateStandings(remainingMatches);
}

// --- RENDU UI ---
function renderStandings(sorted) {
    document.getElementById('standings').innerHTML = sorted.map((t, i) => `
        <div class="flex items-center justify-between p-2 rounded ${i < 8 ? 'qualified-row' : 'eliminated-row'}">
            <span class="text-xs text-slate-500 font-mono">${i + 1}</span>
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
    if (!teamId || teamId === 'undefined') return;
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

window.clearAllPicks = () => {
    remainingMatches.forEach(m => m.winner = null);
    initMatches();
    updateApp();
};

function initMatches() {
    document.getElementById('matches-grid').innerHTML = remainingMatches.map((m, i) => `
        <div class="flex items-center bg-slate-800 p-2 rounded-xl border border-slate-700">
            <button onclick="setWinner(${i}, 1)" class="flex-1 p-2 rounded text-[10px] uppercase font-bold ${m.winner === 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}">${teams.find(t => t.id === m.t1).name}</button>
            <span class="px-2 text-slate-600 text-[10px] font-black italic">VS</span>
            <button onclick="setWinner(${i}, 2)" class="flex-1 p-2 rounded text-[10px] uppercase font-bold ${m.winner === 2 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}">${teams.find(t => t.id === m.t2).name}</button>
        </div>
    `).join('');
}

// --- SCENARIO ANALYSIS ---
let selectedScenarioTeam = '';

function updateApp() {
    const sorted = calculateResults();
    renderStandings(sorted);
    renderPlayoffs(sorted);
    // Auto-refresh scenario analysis if a team is selected
    if (selectedScenarioTeam) {
        runScenarioAnalysis();
    }
}

function populateTeamDropdown() {
    const sel = document.getElementById('scenario-team-select');
    teams.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        sel.appendChild(opt);
    });
}

function findEliminationScenarios(teamId) {
    const unpickedIndices = [];
    remainingMatches.forEach((m, i) => {
        if (m.winner === null) {
            unpickedIndices.push(i);
        }
    });

    const n = unpickedIndices.length;
    const totalCombinations = 1 << n;
    const elimScenarios = [];
    const top4Scenarios = [];

    // Key match tracking: for each unpicked match, count outcomes
    const keyMatchStats = unpickedIndices.map(() => ({
        t1Wins: { elim: 0, top4: 0, total: 0 },
        t2Wins: { elim: 0, top4: 0, total: 0 }
    }));

    for (let mask = 0; mask < totalCombinations; mask++) {
        const outcomes = remainingMatches.map((m, i) => {
            if (m.winner !== null) {
                return { t1: m.t1, t2: m.t2, winner: m.winner };
            }
            const bitPos = unpickedIndices.indexOf(i);
            const w = (mask >> bitPos) & 1 ? 2 : 1;
            return { t1: m.t1, t2: m.t2, winner: w };
        });

        const sorted = calculateStandings(outcomes);
        const rank = sorted.findIndex(t => t.id === teamId);
        const scenarioDetail = unpickedIndices.map(idx => ({
            t1: remainingMatches[idx].t1,
            t2: remainingMatches[idx].t2,
            winner: outcomes[idx].winner
        }));

        const isElim = rank >= 8;
        const isTop4 = rank < 4;

        if (isElim) {
            elimScenarios.push({ outcomes: scenarioDetail, rank: rank + 1 });
        }
        if (isTop4) {
            top4Scenarios.push({ outcomes: scenarioDetail, rank: rank + 1 });
        }

        // Track key match stats
        unpickedIndices.forEach((idx, localIdx) => {
            const w = outcomes[idx].winner;
            const bucket = w === 1 ? keyMatchStats[localIdx].t1Wins : keyMatchStats[localIdx].t2Wins;
            bucket.total++;
            if (isElim) bucket.elim++;
            if (isTop4) bucket.top4++;
        });
    }

    // Compute key match impact for each unpicked match
    const keyMatches = unpickedIndices.map((idx, localIdx) => {
        const m = remainingMatches[idx];
        const stats = keyMatchStats[localIdx];
        const t1ElimRate = stats.t1Wins.total > 0 ? stats.t1Wins.elim / stats.t1Wins.total : 0;
        const t2ElimRate = stats.t2Wins.total > 0 ? stats.t2Wins.elim / stats.t2Wins.total : 0;
        const t1Top4Rate = stats.t1Wins.total > 0 ? stats.t1Wins.top4 / stats.t1Wins.total : 0;
        const t2Top4Rate = stats.t2Wins.total > 0 ? stats.t2Wins.top4 / stats.t2Wins.total : 0;
        const elimImpact = Math.abs(t1ElimRate - t2ElimRate);
        const top4Impact = Math.abs(t1Top4Rate - t2Top4Rate);
        const totalImpact = elimImpact + top4Impact;
        return {
            t1: m.t1, t2: m.t2,
            t1ElimRate, t2ElimRate, t1Top4Rate, t2Top4Rate,
            elimImpact, top4Impact, totalImpact
        };
    }).sort((a, b) => b.totalImpact - a.totalImpact);

    return { elimScenarios, top4Scenarios, totalCombinations, unpickedIndices, keyMatches };
}

function getTeamName(id) {
    return teams.find(t => t.id === id)?.name || id;
}

function renderScenarios(result, teamId) {
    const summaryEl = document.getElementById('scenario-summary');
    const keyMatchesEl = document.getElementById('scenario-key-matches');
    const resultsEl = document.getElementById('scenario-results');
    const teamName = getTeamName(teamId);
    const { elimScenarios, top4Scenarios, totalCombinations, keyMatches } = result;

    summaryEl.classList.remove('hidden');
    keyMatchesEl.classList.remove('hidden');
    resultsEl.classList.remove('hidden');

    // --- SUMMARY ---
    let summaryHtml = '';

    // Top 4 summary
    if (top4Scenarios.length === totalCombinations) {
        summaryHtml += `
            <div class="scenario-summary-box scenario-top4 mb-2">
                <span class="text-lg">🏆</span>
                <span><strong>${teamName}</strong> finishes <strong>top 4</strong> in <strong>all ${totalCombinations}</strong> scenarios!</span>
            </div>`;
    } else if (top4Scenarios.length === 0) {
        summaryHtml += `
            <div class="scenario-summary-box scenario-no-top4 mb-2">
                <span class="text-lg">📉</span>
                <span><strong>${teamName}</strong> cannot finish <strong>top 4</strong> in any remaining scenario.</span>
            </div>`;
    } else {
        summaryHtml += `
            <div class="scenario-summary-box scenario-top4-chance mb-2">
                <span class="text-lg">🏆</span>
                <span><strong>${top4Scenarios.length}</strong> out of <strong>${totalCombinations}</strong> scenarios (<strong>${Math.round(top4Scenarios.length / totalCombinations * 100)}%</strong>) result in <strong>${teamName}</strong> finishing <strong>top 4</strong>.</span>
            </div>`;
    }

    // Elimination summary
    if (elimScenarios.length === 0) {
        summaryHtml += `
            <div class="scenario-summary-box scenario-safe">
                <span class="text-lg">✅</span>
                <span><strong>${teamName}</strong> qualifies in <strong>all ${totalCombinations}</strong> remaining scenarios. They cannot be eliminated!</span>
            </div>`;
    } else if (elimScenarios.length === totalCombinations) {
        summaryHtml += `
            <div class="scenario-summary-box scenario-doomed">
                <span class="text-lg">❌</span>
                <span><strong>${teamName}</strong> finishes 9th or lower in <strong>all ${totalCombinations}</strong> scenarios. Eliminated regardless of results.</span>
            </div>`;
    } else {
        summaryHtml += `
            <div class="scenario-summary-box scenario-warning">
                <span class="text-lg">⚠️</span>
                <span><strong>${elimScenarios.length}</strong> out of <strong>${totalCombinations}</strong> scenarios (<strong>${Math.round(elimScenarios.length / totalCombinations * 100)}%</strong>) result in <strong>${teamName}</strong> finishing 9th or lower.</span>
            </div>`;
    }
    summaryEl.innerHTML = summaryHtml;

    // --- KEY MATCHES ---
    if (keyMatches.length > 0) {
        let keyHtml = '<h3 class="text-sm font-bold text-slate-300 mb-2">🔑 Key Matches</h3>';
        keyHtml += '<div class="key-matches-grid">';
        keyMatches.forEach(km => {
            const t1Name = getTeamName(km.t1);
            const t2Name = getTeamName(km.t2);
            const hasImpact = km.totalImpact > 0.01;
            const impactClass = km.totalImpact > 0.5 ? 'key-match-critical' : km.totalImpact > 0.15 ? 'key-match-important' : 'key-match-minor';

            keyHtml += `
                <div class="key-match-card ${impactClass}">
                    <div class="key-match-header">${t1Name} vs ${t2Name}</div>
                    <div class="key-match-stats">
                        <div class="key-match-stat">
                            <span class="key-match-label">If ${t1Name} wins:</span>
                            <span class="key-match-val">Top 4: <strong>${Math.round(km.t1Top4Rate * 100)}%</strong></span>
                            <span class="key-match-val">Elim: <strong>${Math.round(km.t1ElimRate * 100)}%</strong></span>
                        </div>
                        <div class="key-match-stat">
                            <span class="key-match-label">If ${t2Name} wins:</span>
                            <span class="key-match-val">Top 4: <strong>${Math.round(km.t2Top4Rate * 100)}%</strong></span>
                            <span class="key-match-val">Elim: <strong>${Math.round(km.t2ElimRate * 100)}%</strong></span>
                        </div>
                    </div>
                    ${!hasImpact ? '<div class="key-match-note">No impact on this team</div>' : ''}
                </div>`;
        });
        keyHtml += '</div>';
        keyMatchesEl.innerHTML = keyHtml;
    } else {
        keyMatchesEl.innerHTML = '';
    }

    // --- ELIMINATION SCENARIOS LIST ---
    if (elimScenarios.length === 0) {
        resultsEl.innerHTML = '';
        return;
    }

    const lockedCount = remainingMatches.filter(m => m.winner !== null).length;
    const lockedNote = lockedCount > 0
        ? `<p class="text-xs text-slate-500 mb-2 italic" style="padding: 8px 12px 0;">${lockedCount} match(es) already picked — only unpicked match outcomes shown below.</p>`
        : '';

    let listHtml = lockedNote + '<div class="scenario-list">';
    elimScenarios.forEach((s, idx) => {
        const matchResults = s.outcomes.map(o => {
            const winnerId = o.winner === 1 ? o.t1 : o.t2;
            const loserId = o.winner === 1 ? o.t2 : o.t1;
            const winClass = winnerId === teamId ? 'scenario-team-win' : '';
            const loseClass = loserId === teamId ? 'scenario-team-loss' : '';
            return `<span class="scenario-match"><span class="${winClass}">${getTeamName(winnerId)}</span> <span class="scenario-vs">beat</span> <span class="${loseClass}">${getTeamName(loserId)}</span></span>`;
        }).join('');

        listHtml += `
            <div class="scenario-row ${idx % 2 === 0 ? 'scenario-row-even' : ''}">
                <span class="scenario-rank-badge">${s.rank}th</span>
                <div class="scenario-matches-wrap">${matchResults}</div>
            </div>`;
    });
    listHtml += '</div>';
    resultsEl.innerHTML = listHtml;
}

function runScenarioAnalysis() {
    const teamId = document.getElementById('scenario-team-select').value;
    if (!teamId) {
        document.getElementById('scenario-summary').classList.add('hidden');
        document.getElementById('scenario-key-matches').classList.add('hidden');
        document.getElementById('scenario-results').classList.add('hidden');
        return;
    }
    selectedScenarioTeam = teamId;
    const result = findEliminationScenarios(teamId);
    renderScenarios(result, teamId);
}

// Lancement
populateTeamDropdown();
document.getElementById('scenario-analyze-btn').addEventListener('click', runScenarioAnalysis);
initMatches();
updateApp();