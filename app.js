(function () {
  const data = window.TOURNAMENT_DATA;
  const teamsById = Object.fromEntries(data.teams.map((team) => [team.id, team]));
  const state = {
    activeSection: "live",
    expandedMatches: new Set(),
    filters: {
      phase: "all",
      group: "all",
      status: "Agendado"
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
    bindNavigation();
    bindThemeToggle();
    populateFilters();
    bindFilters();
    renderAll();
    startLiveSimulation();
  });

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
  }

  function populateSelect(id, values) {
    const select = document.getElementById(id);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    if (id === "status-filter") {
      select.value = state.filters.status;
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
    const qualifiedTeams = Object.values(data.standings).reduce((count, group) => count + Math.min(group.length, 2), 0);

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
          <div class="scoreboard" aria-label="Placar ${participants[0].label} ${liveMatch.score.home} a ${liveMatch.score.away} ${participants[1].label}">
            <span>${liveMatch.score.home}</span>
            <small>x</small>
            <span>${liveMatch.score.away}</span>
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

    matchesContainer.innerHTML = filteredMatches.slice().sort(sortMatches).map((match) => buildMatchCard(match)).join("");
    bindDetailsButtons();
  }

  function renderGroups() {
    const groupsGrid = document.getElementById("groups-grid");

    groupsGrid.innerHTML = data.groups
      .map((group) => {
        const rows = data.standings[group.id] || [];

        return `
          <article class="group-card">
            <h3>${group.name}</h3>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Time</th>
                    <th>PTS</th>
                    <th>J</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>SG</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map((row, index) => {
                      const team = teamsById[row.team];
                      return `
                        <tr class="${index < 2 ? "qualifier" : ""}">
                          <td>${index + 1}</td>
                          <td>${team.flag} ${team.shortName}</td>
                          <td>${row.points}</td>
                          <td>${row.played}</td>
                          <td>${row.wins}</td>
                          <td>${row.draws}</td>
                          <td>${row.losses}</td>
                          <td>${row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
            <p class="group-legend">Os dois primeiros avançam destacados em verde.</p>
          </article>
        `;
      })
      .join("");
  }

  function renderPhaseBrackets() {
    Object.entries(phaseSectionMap).forEach(([sectionKey, phaseName]) => {
      const container = document.getElementById(`${sectionKey}-bracket`);
      container.innerHTML = `<div class="bracket-track"><div class="bracket-column">${buildBracketCards(
        phaseName,
        data.bracket[phaseName]
      )}</div></div>`;
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

  function buildMatchCard(match) {
    const home = buildParticipant(match.home);
    const away = buildParticipant(match.away);
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
              <span>${match.score.home}</span>
              <small>x</small>
              <span>${match.score.away}</span>
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
})();
