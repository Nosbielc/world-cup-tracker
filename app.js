(function () {
  const data = window.TOURNAMENT_DATA;
  
  // Verificação de segurança
  if (!data || !data.teams || !data.matches) {
    console.error("❌ ERRO CRÍTICO: window.TOURNAMENT_DATA não carregado corretamente!");
    console.error("Data:", data);
    return;
  }

  const teamsById = Object.fromEntries(data.teams.map((team) => [team.id, team]));
  const state = {
    activeSection: "live",
    expandedMatches: new Set(),
    groupRoundIndexById: {},
    filters: {
      phase: "all",
      group: "all",
      status: "all"
    },
    liveMatchId: "match-1",
    liveSimulationIndex: 2
  };

  const phaseSectionMap = {
    "second-phase": "Segunda fase",
    "round-of-16": "Oitavas",
    "quarter-finals": "Quartas",
    "semi-finals": "Semifinais"
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyStoredTheme();
    syncStickyOffset();
    bindNavigation();
    bindThemeToggle();
    bindGroupRoundControls();
    populateFilters();
    bindFilters();
    renderAll();
    startLiveSimulation();

    window.addEventListener("resize", syncStickyOffset);
  });

  function syncStickyOffset() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
  }

  function applyStoredTheme() {
    let storedTheme = "light";

    try {
      storedTheme = localStorage.getItem("cup-tracker-theme") || "light";
    } catch (error) {
      storedTheme = "light";
    }

    document.body.classList.toggle("dark-theme", storedTheme === "dark");
    updateThemeToggleLabel();
  }

  function bindThemeToggle() {
    const button = document.getElementById("theme-toggle");

    button.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-theme");

      try {
        localStorage.setItem("cup-tracker-theme", isDark ? "dark" : "light");
      } catch (error) {
        // no-op
      }

      updateThemeToggleLabel();
    });
  }

  function updateThemeToggleLabel() {
    const button = document.getElementById("theme-toggle");
    const isDark = document.body.classList.contains("dark-theme");
    button.innerHTML = `<span aria-hidden="true">${isDark ? "☀️" : "🌙"}</span>`;
    button.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
  }

  function bindNavigation() {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => setActiveSection(tab.dataset.section));
    });
  }

  function setActiveSection(sectionId) {
    state.activeSection = sectionId;

    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.section === sectionId);
    });

    document.querySelectorAll(".page-section").forEach((section) => {
      const isActive = section.id === `section-${sectionId}`;
      section.classList.toggle("is-active", isActive);
      section.hidden = !isActive;
    });
  }

  function populateFilters() {
    const phases = Array.from(new Set(data.matches.map((match) => match.phase)));
    const groups = Array.from(new Set(data.matches.map((match) => match.group)));
    const statuses = Array.from(new Set(data.matches.map((match) => match.status)));

    populateSelect("phase-filter", phases);
    populateSelect("group-filter", groups);
    populateSelect("status-filter", statuses);
    applyDefaultStatusFilter(statuses);
  }

  function populateSelect(id, values) {
    const select = document.getElementById(id);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

  }

  function applyDefaultStatusFilter(statuses) {
    if (!statuses.length) {
      state.filters.status = "all";
      return;
    }

    const preferred = ["Agendado", "Ao vivo", "Encerrado"];
    const fallbackStatus = preferred.find((status) => statuses.includes(status)) || "all";
    state.filters.status = fallbackStatus;
    const statusSelect = document.getElementById("status-filter");
    if (statusSelect) {
      statusSelect.value = fallbackStatus;
    }
  }

  function bindFilters() {
    document.getElementById("phase-filter").addEventListener("change", (event) => {
      state.filters.phase = event.target.value;
      renderMatches();
    });

    document.getElementById("group-filter").addEventListener("change", (event) => {
      state.filters.group = event.target.value;
      renderMatches();
    });

    document.getElementById("status-filter").addEventListener("change", (event) => {
      state.filters.status = event.target.value;
      renderMatches();
    });
  }

  function renderAll() {
    renderSummary();
    renderLiveSection();
    renderFeaturedMatches();
    renderMatches();
    renderGroups();
    renderPhaseBrackets();
    renderFullBracket();
  }

  function renderSummary() {
    const summaryCards = document.getElementById("summary-cards");
    const liveMatches = data.matches.filter((match) => match.status === "Ao vivo").length;
    const scheduledMatches = data.matches.filter((match) => match.status === "Agendado").length;
    const qualifiedTeams = data.groups.length * 2;

    summaryCards.innerHTML = [
      { value: liveMatches, label: "Partidas ao vivo" },
      { value: scheduledMatches, label: "Jogos agendados" },
      { value: qualifiedTeams, label: "Classificados em destaque" }
    ]
      .map(
        (item) => `
          <article class="summary-card">
            <span class="summary-card__value">${item.value}</span>
            <span class="summary-card__label">${item.label}</span>
          </article>
        `
      )
      .join("");
  }

  function renderLiveSection() {
    const liveContainer = document.getElementById("live-match");
    const eventsContainer = document.getElementById("live-events");
    const liveMatch = getCurrentLiveMatch();

    if (!liveMatch) {
      liveContainer.innerHTML = '<div class="live-card"><p class="empty-state">Nenhum jogo ao vivo agora.</p></div>';
      eventsContainer.innerHTML = "";
      return;
    }

    const participants = [buildParticipant(liveMatch.home), buildParticipant(liveMatch.away)];
    const visibleEvents = getVisibleEvents(liveMatch);
    const liveScore = normalizeScore(liveMatch.score);

    liveContainer.innerHTML = `
      <article class="live-card">
        <div class="live-card__header">
          <div>
            <p class="section-kicker">${liveMatch.phase}</p>
            <h3>${liveMatch.venue}</h3>
          </div>
          ${buildBadge(liveMatch.status)}
        </div>

        <div class="scoreline">
          <div class="team-chip">
            ${buildParticipantMarkup(participants[0])}
          </div>
          <div class="scoreboard" aria-label="Placar ${participants[0].label} ${liveScore.home} a ${liveScore.away} ${participants[1].label}">
            <span>${liveScore.home}</span>
            <small>x</small>
            <span>${liveScore.away}</span>
          </div>
          <div class="team-chip" style="justify-content:flex-end;">
            ${buildParticipantMarkup(participants[1], true)}
          </div>
        </div>

        <div class="live-footer">
          <span><strong>Tempo:</strong> ${liveMatch.minute}</span>
          <span><strong>Cidade:</strong> ${liveMatch.city}</span>
          <span><strong>Data:</strong> ${formatDateTime(liveMatch.datetime)}</span>
        </div>
      </article>
    `;

    eventsContainer.innerHTML = visibleEvents
      .map(
        (event) => `
          <article class="event-item">
            <div class="event-icon" aria-hidden="true">${eventIcon(event.type)}</div>
            <div>
              <p><strong>${event.minute}</strong> · ${labelForParticipant(event.team)}</p>
              <p>${event.text}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderFeaturedMatches() {
    const featured = data.matches
      .slice()
      .sort(sortMatches)
      .filter((match) => ["Ao vivo", "Intervalo", "Encerrado"].includes(match.status))
      .slice(0, 3);

    document.getElementById("featured-matches").innerHTML = featured.map((match) => buildMatchCard(match)).join("");
    bindDetailsButtons();
  }

  function renderMatches() {
    ensureValidMatchFilters();

    const filteredMatches = data.matches.filter((match) => {
      const phaseMatch = state.filters.phase === "all" || match.phase === state.filters.phase;
      const groupMatch = state.filters.group === "all" || match.group === state.filters.group;
      const statusMatch = state.filters.status === "all" || match.status === state.filters.status;
      return phaseMatch && groupMatch && statusMatch;
    });

    const matchesContainer = document.getElementById("matches-list");

    if (!filteredMatches.length) {
      matchesContainer.innerHTML = '<div class="panel"><p class="empty-state">Nenhum jogo encontrado com os filtros selecionados.</p></div>';
      return;
    }

    const htmlCards = filteredMatches.slice().sort(sortMatches).map((match) => buildMatchCard(match)).join("");
    matchesContainer.innerHTML = htmlCards;
    bindDetailsButtons();
  }

  function ensureValidMatchFilters() {
    const phases = new Set(data.matches.map((match) => match.phase));
    const groups = new Set(data.matches.map((match) => match.group));
    const statuses = new Set(data.matches.map((match) => match.status));

    if (state.filters.phase !== "all" && !phases.has(state.filters.phase)) {
      state.filters.phase = "all";
      document.getElementById("phase-filter").value = "all";
    }

    if (state.filters.group !== "all" && !groups.has(state.filters.group)) {
      state.filters.group = "all";
      document.getElementById("group-filter").value = "all";
    }

    if (state.filters.status !== "all" && !statuses.has(state.filters.status)) {
      state.filters.status = "all";
      document.getElementById("status-filter").value = "all";
    }
  }

  function renderGroups() {
    const groupsGrid = document.getElementById("groups-grid");

    groupsGrid.innerHTML = data.groups
      .map((group) => {
        const rows = buildGroupStandings(group.id);
        const groupMatches = getGroupMatches(group.id);
        const roundMatches = buildGroupRounds(groupMatches, group.teams.length);
        const maxRoundIndex = Math.max(roundMatches.length - 1, 0);
        const currentRoundIndex = Math.min(Math.max(state.groupRoundIndexById[group.id] ?? 0, 0), maxRoundIndex);
        state.groupRoundIndexById[group.id] = currentRoundIndex;

        return `
          <article class="group-stage-card">
            <div class="group-stage-table">
              <h3 class="group-stage-title">${group.name}</h3>
              <div class="table-wrap">
                <table class="group-table">
                <thead>
                  <tr>
                    <th>Classificacao</th>
                    <th>P</th>
                    <th>J</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>GP</th>
                    <th>GC</th>
                    <th>SG</th>
                    <th>%</th>
                    <th>Ult. jogos</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map((row, index) => {
                      const team = teamsById[row.team] || { name: row.team || "Time", shortName: row.team || "--" };
                      const percentage = row.played ? Math.round((row.points / (row.played * 3)) * 100) : 0;

                      return `
                        <tr>
                          <td>
                            <div class="table-team-cell">
                              <span class="table-position ${index < 2 ? "qualified" : ""}">${index + 1}</span>
                              <span class="table-team-name">${team.name}</span>
                            </div>
                          </td>
                          <td>${row.points}</td>
                          <td>${row.played}</td>
                          <td>${row.wins}</td>
                          <td>${row.draws}</td>
                          <td>${row.losses}</td>
                          <td>${row.goalsFor ?? "--"}</td>
                          <td>${row.goalsAgainst ?? "--"}</td>
                          <td>${row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                          <td>${percentage}</td>
                          <td>${buildFormDots(row.team, groupMatches)}</td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
                </table>
              </div>
            </div>

            <aside class="group-stage-fixtures">
              <header class="group-fixtures-header">
                <button class="stage-arrow group-round-button" type="button" data-group-id="${group.id}" data-direction="prev" aria-label="Rodada anterior" ${currentRoundIndex === 0 ? "disabled" : ""}>&lsaquo;</button>
                <h4>${currentRoundIndex + 1}a Rodada</h4>
                <button class="stage-arrow group-round-button" type="button" data-group-id="${group.id}" data-direction="next" aria-label="Próxima rodada" ${currentRoundIndex >= maxRoundIndex ? "disabled" : ""}>&rsaquo;</button>
              </header>
              <div class="group-fixtures-list">
                ${groupMatches.length ? (roundMatches[currentRoundIndex] || []).map((match) => buildGroupMatchRow(match)).join("") : '<p class="empty-state">Sem jogos cadastrados para este grupo.</p>'}
              </div>
            </aside>
          </article>
        `;
      })
      .join("");
  }

  function getGroupMatches(groupId) {
    return data.matches
      .filter((match) => match.phase === "Fase de grupos" && match.group === groupId)
      .slice()
      .sort((first, second) => new Date(first.datetime) - new Date(second.datetime));
  }

  function buildGroupRounds(groupMatches, teamsPerGroup) {
    const matchesPerRound = Math.max(1, Math.floor((teamsPerGroup || 4) / 2));
    const rounds = [];

    for (let index = 0; index < groupMatches.length; index += matchesPerRound) {
      rounds.push(groupMatches.slice(index, index + matchesPerRound));
    }

    return rounds;
  }

  function bindGroupRoundControls() {
    const groupsGrid = document.getElementById("groups-grid");

    groupsGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".group-round-button");
      if (!button) {
        return;
      }

      const groupId = button.dataset.groupId;
      const direction = button.dataset.direction === "next" ? 1 : -1;
      const group = data.groups.find((item) => item.id === groupId);

      if (!group) {
        return;
      }

      const groupRounds = buildGroupRounds(getGroupMatches(groupId), group.teams.length);
      const maxRoundIndex = Math.max(groupRounds.length - 1, 0);
      const currentRoundIndex = state.groupRoundIndexById[groupId] ?? 0;
      const nextRoundIndex = Math.min(maxRoundIndex, Math.max(0, currentRoundIndex + direction));

      if (nextRoundIndex === currentRoundIndex) {
        return;
      }

      state.groupRoundIndexById[groupId] = nextRoundIndex;
      renderGroups();
    });
  }

  function buildGroupStandings(groupId) {
    const group = data.groups.find((item) => item.id === groupId);
    if (!group) {
      return [];
    }

    const table = new Map(
      group.teams.map((teamId) => [
        teamId,
        {
          team: teamId,
          points: 0,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0
        }
      ])
    );

    getGroupMatches(groupId)
      .filter((match) => {
        const isPlayedStatus = ["Encerrado", "Ao vivo", "Intervalo"].includes(match.status);
        const hasNumericScore = Number.isFinite(match.score?.home) && Number.isFinite(match.score?.away);
        return isPlayedStatus && hasNumericScore;
      })
      .forEach((match) => {
        const homeRow = table.get(match.home);
        const awayRow = table.get(match.away);

        if (!homeRow || !awayRow) {
          return;
        }

        homeRow.played += 1;
        awayRow.played += 1;
        homeRow.goalsFor += match.score.home;
        homeRow.goalsAgainst += match.score.away;
        awayRow.goalsFor += match.score.away;
        awayRow.goalsAgainst += match.score.home;

        if (match.score.home > match.score.away) {
          homeRow.wins += 1;
          homeRow.points += 3;
          awayRow.losses += 1;
        } else if (match.score.home < match.score.away) {
          awayRow.wins += 1;
          awayRow.points += 3;
          homeRow.losses += 1;
        } else {
          homeRow.draws += 1;
          awayRow.draws += 1;
          homeRow.points += 1;
          awayRow.points += 1;
        }
      });

    return Array.from(table.values())
      .map((row) => ({
        ...row,
        goalDifference: row.goalsFor - row.goalsAgainst
      }))
      .sort((first, second) => {
        if (second.points !== first.points) {
          return second.points - first.points;
        }

        if (second.goalDifference !== first.goalDifference) {
          return second.goalDifference - first.goalDifference;
        }

        if (second.goalsFor !== first.goalsFor) {
          return second.goalsFor - first.goalsFor;
        }

        const firstName = teamsById[first.team]?.name || first.team;
        const secondName = teamsById[second.team]?.name || second.team;
        return firstName.localeCompare(secondName, "pt-BR");
      });
  }

  function buildGroupMatchRow(match) {
    const home = buildParticipant(match.home);
    const away = buildParticipant(match.away);
    const homeScore = typeof match.score?.home === "number" ? match.score.home : "-";
    const awayScore = typeof match.score?.away === "number" ? match.score.away : "-";

    return `
      <article class="group-fixture-item">
        <p class="group-fixture-meta">${match.venue} · ${formatDateTime(match.datetime)}</p>
        <div class="group-fixture-score">
          <span>${home.label}</span>
          <strong>${homeScore} x ${awayScore}</strong>
          <span>${away.label}</span>
        </div>
        <p class="group-fixture-link">Saiba como foi</p>
      </article>
    `;
  }

  function buildFormDots(teamId, groupMatches) {
    const recent = groupMatches
      .filter((match) => match.status === "Encerrado" && (match.home === teamId || match.away === teamId))
      .slice(-5)
      .map((match) => {
        const goalsFor = match.home === teamId ? match.score.home : match.score.away;
        const goalsAgainst = match.home === teamId ? match.score.away : match.score.home;

        if (goalsFor > goalsAgainst) {
          return "win";
        }

        if (goalsFor === goalsAgainst) {
          return "draw";
        }

        return "loss";
      });

    if (!recent.length) {
      return '<span class="form-dot draw" aria-hidden="true"></span>';
    }

    return `<div class="form-dots">${recent
      .map((result) => `<span class="form-dot ${result}" aria-hidden="true"></span>`)
      .join("")}</div>`;
  }

  function renderPhaseBrackets() {
    Object.entries(phaseSectionMap).forEach(([sectionKey, phaseName]) => {
      const container = document.getElementById(`${sectionKey}-bracket`);
      
      if (sectionKey === "second-phase") {
        container.innerHTML = `<div class="second-phase-grid">${buildBracketCardsEnhanced(
          phaseName,
          data.bracket[phaseName]
        )}</div>`;
      } else {
        container.innerHTML = `<div class="bracket-track"><div class="bracket-column">${buildBracketCards(
          phaseName,
          data.bracket[phaseName]
        )}</div></div>`;
      }
    });
  }

  function renderFullBracket() {
    const bracketOrder = ["Segunda fase", "Oitavas", "Quartas", "Semifinais", "Final"];
    const fullBracket = document.getElementById("full-bracket");

    fullBracket.innerHTML = `
      <div class="bracket-track">
        ${bracketOrder
          .map(
            (phaseName) => `
              <div class="bracket-column">
                <h3>${phaseName}</h3>
                ${buildBracketCards(phaseName, data.bracket[phaseName])}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function buildBracketCards(phaseName, fixtures) {
    return fixtures
      .map((fixture) => {
        const home = buildParticipant(fixture.home);
        const away = buildParticipant(fixture.away);

        return `
          <article class="bracket-card">
            <div class="bracket-card__meta">
              <strong>${fixture.label}</strong>
              <span>${fixture.datetime}</span>
            </div>
            <div class="team-line">
              ${buildParticipantMarkup(home)}
            </div>
            <div class="team-line">
              ${buildParticipantMarkup(away)}
            </div>
            <p class="match-location">${fixture.stadium} · ${phaseName}</p>
          </article>
        `;
      })
      .join("");
  }

  function buildBracketCardsEnhanced(phaseName, fixtures) {
    return fixtures
      .map((fixture) => {
        const home = buildParticipant(fixture.home);
        const away = buildParticipant(fixture.away);
        const [date, time] = fixture.datetime.split(" · ");
        const statusBadge = fixture.status ? `<span class="badge">${fixture.status}</span>` : '';

        return `
          <article class="bracket-card--enhanced">
            <div class="bracket-card--enhanced__header">
              <span class="bracket-card--enhanced__label">${fixture.label}</span>
              <div class="bracket-card--enhanced__meta">
                <span>${date}</span>
                <span>${time}</span>
              </div>
            </div>
            <div class="bracket-card--enhanced__teams">
              <div class="team-line">
                ${buildParticipantMarkup(home)}
              </div>
              <div class="bracket-card--enhanced__separator">⚽</div>
              <div class="team-line">
                ${buildParticipantMarkup(away)}
              </div>
            </div>
            <p class="match-location--enhanced">${fixture.stadium}</p>
          </article>
        `;
      })
      .join("");
  }

  function buildMatchCard(match) {
    const home = buildParticipant(match.home);
    const away = buildParticipant(match.away);
    const score = normalizeScore(match.score);
    const expanded = state.expandedMatches.has(match.id);
    const eventMarkup = getMatchEvents(match)
      .slice(-3)
      .map((event) => `<li>${event.minute} · ${event.text}</li>`)
      .join("");

    return `
      <article class="match-card ${match.status === "Ao vivo" ? "is-live" : ""} ${expanded ? "expanded" : ""}">
        <div class="match-card__top">
          <div class="match-meta">
            <span>${match.phase}${match.group && match.group !== "Eliminatórias" ? ` · Grupo ${match.group}` : ""}</span>
            ${buildBadge(match.status)}
          </div>

          <div class="match-teams">
            <div class="team-chip">
              ${buildParticipantMarkup(home)}
            </div>
            <div class="scoreboard">
              <span>${score.home}</span>
              <small>x</small>
              <span>${score.away}</span>
            </div>
            <div class="team-chip" style="justify-content:flex-end;">
              ${buildParticipantMarkup(away, true)}
            </div>
          </div>

          <p class="match-location">${formatDateTime(match.datetime)} · ${match.venue}, ${match.city}</p>

          <button
            class="details-button"
            type="button"
            data-match-id="${match.id}"
            aria-label="${expanded ? "Ocultar detalhes" : "Mostrar detalhes"} da partida"
            aria-expanded="${expanded}"
          >
            ${expanded ? "Ocultar detalhes" : "Ver detalhes"}
          </button>
        </div>

        <div class="match-card__details">
          <p class="match-location"><strong>Status:</strong> ${match.status}${match.minute && match.minute !== "--" ? ` · ${match.minute}` : ""}</p>
          <p class="match-location"><strong>Fase:</strong> ${match.phase}</p>
          ${
            eventMarkup
              ? `<ul>${eventMarkup}</ul>`
              : '<p class="match-location">Sem eventos registrados até o momento.</p>'
          }
        </div>
      </article>
    `;
  }

  function bindDetailsButtons() {
    document.querySelectorAll(".details-button").forEach((button) => {
      button.addEventListener("click", () => {
        const matchId = button.dataset.matchId;
        if (state.expandedMatches.has(matchId)) {
          state.expandedMatches.delete(matchId);
        } else {
          state.expandedMatches.add(matchId);
        }

        renderFeaturedMatches();
        renderMatches();
      });
    });
  }

  function getCurrentLiveMatch() {
    return data.matches.find((match) => match.id === state.liveMatchId) || null;
  }

  function getVisibleEvents(match) {
    const currentSimulation = match.simulation?.[state.liveSimulationIndex];
    const eventIds = currentSimulation ? match.events.slice(0, currentSimulation.visibleEvents) : match.events;
    return eventIds.map((eventId) => data.events[eventId]).filter(Boolean);
  }

  function getMatchEvents(match) {
    return (match.events || []).map((eventId) => data.events[eventId]).filter(Boolean);
  }

  function startLiveSimulation() {
    const liveMatch = getCurrentLiveMatch();
    if (!liveMatch || !liveMatch.simulation) {
      return;
    }

    window.setInterval(() => {
      if (state.liveSimulationIndex >= liveMatch.simulation.length - 1) {
        return;
      }

      state.liveSimulationIndex += 1;
      const currentState = liveMatch.simulation[state.liveSimulationIndex];
      liveMatch.minute = currentState.minute;
      liveMatch.status = currentState.status;
      liveMatch.score = { ...currentState.score };
      renderSummary();
      renderLiveSection();
      renderFeaturedMatches();
      renderMatches();
    }, 8000);
  }

  function buildParticipant(participantId) {
    const team = teamsById[participantId];

    if (team) {
      return {
        label: team.name,
        shortLabel: team.shortName,
        marker: team.flag,
        isPlaceholder: false
      };
    }

    return {
      label: participantId,
      shortLabel: participantId,
      marker: participantId.split(" ").slice(0, 2).join(" "),
      isPlaceholder: true
    };
  }

  function buildParticipantMarkup(participant, alignRight) {
    return `
      <div class="team-line" style="${alignRight ? "margin-left:auto; text-align:right;" : ""}">
        <span class="${participant.isPlaceholder ? "team-placeholder" : "team-flag"}">${participant.marker}</span>
        <span class="team-name">
          <strong>${participant.shortLabel}</strong>
          <span>${participant.label}</span>
        </span>
      </div>
    `;
  }

  function labelForParticipant(participantId) {
    return teamsById[participantId]?.name || participantId;
  }

  function buildBadge(status) {
    const liveClass = status === "Ao vivo" ? " live" : "";
    return `<span class="badge${liveClass}">${status}</span>`;
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function sortMatches(firstMatch, secondMatch) {
    const statusOrder = { "Ao vivo": 0, Intervalo: 1, Agendado: 2, Encerrado: 3 };
    const firstStatus = statusOrder[firstMatch.status] ?? 9;
    const secondStatus = statusOrder[secondMatch.status] ?? 9;

    if (firstStatus !== secondStatus) {
      return firstStatus - secondStatus;
    }

    return new Date(firstMatch.datetime) - new Date(secondMatch.datetime);
  }

  function eventIcon(type) {
    const iconMap = {
      goal: "⚽",
      card: "🟨",
      substitution: "🔁",
      whistle: "📣"
    };

    return iconMap[type] || "•";
  }

  function normalizeScore(score) {
    const hasHome = score && Number.isFinite(Number(score.home));
    const hasAway = score && Number.isFinite(Number(score.away));

    return {
      home: hasHome ? Number(score.home) : "-",
      away: hasAway ? Number(score.away) : "-"
    };
  }
})();

