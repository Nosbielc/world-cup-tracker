window.TOURNAMENT_DATA = {
  tournament: {
    name: "Copa Tracker 2026",
    location: "Brasil",
    themeColors: ["#0f8f4d", "#ffcb05", "#0d5bd7"]
  },
  teams: [
    { id: "BRA", name: "Brasil", shortName: "BRA", flag: "🇧🇷", group: "A" },
    { id: "NED", name: "Holanda", shortName: "NED", flag: "🇳🇱", group: "A" },
    { id: "SEN", name: "Senegal", shortName: "SEN", flag: "🇸🇳", group: "A" },
    { id: "QAT", name: "Qatar", shortName: "QAT", flag: "🇶🇦", group: "A" },
    { id: "FRA", name: "França", shortName: "FRA", flag: "🇫🇷", group: "B" },
    { id: "USA", name: "Estados Unidos", shortName: "EUA", flag: "🇺🇸", group: "B" },
    { id: "JPN", name: "Japão", shortName: "JPN", flag: "🇯🇵", group: "B" },
    { id: "MAR", name: "Marrocos", shortName: "MAR", flag: "🇲🇦", group: "B" },
    { id: "ARG", name: "Argentina", shortName: "ARG", flag: "🇦🇷", group: "C" },
    { id: "MEX", name: "México", shortName: "MEX", flag: "🇲🇽", group: "C" },
    { id: "POL", name: "Polônia", shortName: "POL", flag: "🇵🇱", group: "C" },
    { id: "AUS", name: "Austrália", shortName: "AUS", flag: "🇦🇺", group: "C" },
    { id: "GER", name: "Alemanha", shortName: "GER", flag: "🇩🇪", group: "D" },
    { id: "ESP", name: "Espanha", shortName: "ESP", flag: "🇪🇸", group: "D" },
    { id: "CRO", name: "Croácia", shortName: "CRO", flag: "🇭🇷", group: "D" },
    { id: "KOR", name: "Coreia do Sul", shortName: "KOR", flag: "🇰🇷", group: "D" },
    { id: "ENG", name: "Inglaterra", shortName: "ENG", flag: "🇬🇧", group: "E" },
    { id: "DEN", name: "Dinamarca", shortName: "DEN", flag: "🇩🇰", group: "E" },
    { id: "SRB", name: "Sérvia", shortName: "SRB", flag: "🇷🇸", group: "E" },
    { id: "CMR", name: "Camarões", shortName: "CMR", flag: "🇨🇲", group: "E" },
    { id: "POR", name: "Portugal", shortName: "POR", flag: "🇵🇹", group: "F" },
    { id: "URU", name: "Uruguai", shortName: "URU", flag: "🇺🇾", group: "F" },
    { id: "GHA", name: "Gana", shortName: "GHA", flag: "🇬🇭", group: "F" },
    { id: "CAN", name: "Canadá", shortName: "CAN", flag: "🇨🇦", group: "F" },
    { id: "ITA", name: "Itália", shortName: "ITA", flag: "🇮🇹", group: "G" },
    { id: "SUI", name: "Suíça", shortName: "SUI", flag: "🇨🇭", group: "G" },
    { id: "COL", name: "Colômbia", shortName: "COL", flag: "🇨🇴", group: "G" },
    { id: "KSA", name: "Arábia Saudita", shortName: "KSA", flag: "🇸🇦", group: "G" },
    { id: "BEL", name: "Bélgica", shortName: "BEL", flag: "🇧🇪", group: "H" },
    { id: "AUT", name: "Áustria", shortName: "AUT", flag: "🇦🇹", group: "H" },
    { id: "CHI", name: "Chile", shortName: "CHI", flag: "🇨🇱", group: "H" },
    { id: "NGA", name: "Nigéria", shortName: "NGA", flag: "🇳🇬", group: "H" }
  ],
  groups: [
    { id: "A", name: "Grupo A", teams: ["BRA", "NED", "SEN", "QAT"] },
    { id: "B", name: "Grupo B", teams: ["FRA", "USA", "JPN", "MAR"] },
    { id: "C", name: "Grupo C", teams: ["ARG", "MEX", "POL", "AUS"] },
    { id: "D", name: "Grupo D", teams: ["GER", "ESP", "CRO", "KOR"] },
    { id: "E", name: "Grupo E", teams: ["ENG", "DEN", "SRB", "CMR"] },
    { id: "F", name: "Grupo F", teams: ["POR", "URU", "GHA", "CAN"] },
    { id: "G", name: "Grupo G", teams: ["ITA", "SUI", "COL", "KSA"] },
    { id: "H", name: "Grupo H", teams: ["BEL", "AUT", "CHI", "NGA"] }
  ],
  matches: [
    {
      id: "match-1",
      phase: "Fase de grupos",
      group: "A",
      status: "Ao vivo",
      home: "BRA",
      away: "NED",
      venue: "Arena Atlântica",
      city: "Rio de Janeiro",
      datetime: "2026-06-14T18:00:00-03:00",
      score: { home: 2, away: 1 },
      minute: "67'",
      events: ["evt-1", "evt-2", "evt-3", "evt-4", "evt-5"],
      simulation: [
        { minute: "23'", status: "Ao vivo", score: { home: 1, away: 0 }, visibleEvents: 2 },
        { minute: "45+1'", status: "Intervalo", score: { home: 1, away: 1 }, visibleEvents: 3 },
        { minute: "67'", status: "Ao vivo", score: { home: 2, away: 1 }, visibleEvents: 5 },
        { minute: "78'", status: "Ao vivo", score: { home: 2, away: 1 }, visibleEvents: 6 },
        { minute: "90+4'", status: "Encerrado", score: { home: 2, away: 1 }, visibleEvents: 7 }
      ]
    },
    {
      id: "match-2",
      phase: "Fase de grupos",
      group: "A",
      status: "Agendado",
      home: "SEN",
      away: "QAT",
      venue: "Estádio do Litoral",
      city: "Recife",
      datetime: "2026-06-15T16:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-3",
      phase: "Fase de grupos",
      group: "B",
      status: "Agendado",
      home: "FRA",
      away: "USA",
      venue: "Arena das Dunas",
      city: "Natal",
      datetime: "2026-06-15T19:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-4",
      phase: "Fase de grupos",
      group: "C",
      status: "Encerrado",
      home: "ARG",
      away: "POL",
      venue: "Estádio da Serra",
      city: "Belo Horizonte",
      datetime: "2026-06-13T20:00:00-03:00",
      score: { home: 3, away: 0 },
      minute: "FT",
      events: ["evt-8", "evt-9", "evt-10"]
    },
    {
      id: "match-5",
      phase: "Fase de grupos",
      group: "D",
      status: "Agendado",
      home: "GER",
      away: "ESP",
      venue: "Arena Central",
      city: "Brasília",
      datetime: "2026-06-16T18:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-6",
      phase: "Fase de grupos",
      group: "E",
      status: "Agendado",
      home: "ENG",
      away: "DEN",
      venue: "Estádio do Parque",
      city: "Curitiba",
      datetime: "2026-06-16T21:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-7",
      phase: "Oitavas",
      group: "Eliminatórias",
      status: "Agendado",
      home: "1º Grupo A",
      away: "Vencedor Segunda fase 1",
      venue: "Maracanã",
      city: "Rio de Janeiro",
      datetime: "2026-06-22T20:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-8",
      phase: "Oitavas",
      group: "Eliminatórias",
      status: "Agendado",
      home: "1º Grupo C",
      away: "Vencedor Segunda fase 3",
      venue: "Arena das Águas",
      city: "Fortaleza",
      datetime: "2026-06-23T20:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-9",
      phase: "Semifinais",
      group: "Eliminatórias",
      status: "Agendado",
      home: "Vencedor Quartas 1",
      away: "Vencedor Quartas 2",
      venue: "Arena do Sol",
      city: "Salvador",
      datetime: "2026-06-28T21:00:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    },
    {
      id: "match-10",
      phase: "Final",
      group: "Eliminatórias",
      status: "Agendado",
      home: "Vencedor Semifinal 1",
      away: "Vencedor Semifinal 2",
      venue: "Estádio Nacional",
      city: "Brasília",
      datetime: "2026-07-02T20:30:00-03:00",
      score: { home: 0, away: 0 },
      minute: "--",
      events: []
    }
  ],
  events: {
    "evt-1": { id: "evt-1", matchId: "match-1", minute: "12'", type: "goal", team: "BRA", text: "Brasil abre o placar com Vini Jr." },
    "evt-2": { id: "evt-2", matchId: "match-1", minute: "29'", type: "card", team: "NED", text: "Van Dijk recebe amarelo por falta tática." },
    "evt-3": { id: "evt-3", matchId: "match-1", minute: "41'", type: "goal", team: "NED", text: "Depay empata em contra-ataque rápido." },
    "evt-4": { id: "evt-4", matchId: "match-1", minute: "52'", type: "substitution", team: "BRA", text: "Rodrygo entra no lugar de Martinelli." },
    "evt-5": { id: "evt-5", matchId: "match-1", minute: "67'", type: "goal", team: "BRA", text: "Raphinha recoloca o Brasil na frente." },
    "evt-6": { id: "evt-6", matchId: "match-1", minute: "78'", type: "card", team: "BRA", text: "Casemiro recebe cartão por carrinho duro." },
    "evt-7": { id: "evt-7", matchId: "match-1", minute: "90+4'", type: "whistle", team: "BRA", text: "Fim de jogo no Rio de Janeiro." },
    "evt-8": { id: "evt-8", matchId: "match-4", minute: "18'", type: "goal", team: "ARG", text: "Alvarez finaliza de primeira para marcar." },
    "evt-9": { id: "evt-9", matchId: "match-4", minute: "57'", type: "goal", team: "ARG", text: "Mac Allister amplia após jogada trabalhada." },
    "evt-10": { id: "evt-10", matchId: "match-4", minute: "82'", type: "goal", team: "ARG", text: "Lautaro fecha a conta de cabeça." }
  },
  standings: {
    A: [
      { team: "BRA", points: 6, played: 2, wins: 2, draws: 0, losses: 0, goalDifference: 4 },
      { team: "NED", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 1 },
      { team: "SEN", points: 1, played: 1, wins: 0, draws: 1, losses: 0, goalDifference: 0 },
      { team: "QAT", points: 0, played: 1, wins: 0, draws: 0, losses: 1, goalDifference: -3 }
    ],
    B: [
      { team: "FRA", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 3 },
      { team: "USA", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 2 },
      { team: "JPN", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 0 },
      { team: "MAR", points: 0, played: 2, wins: 0, draws: 0, losses: 2, goalDifference: -5 }
    ],
    C: [
      { team: "ARG", points: 6, played: 2, wins: 2, draws: 0, losses: 0, goalDifference: 5 },
      { team: "MEX", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 0 },
      { team: "POL", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: -1 },
      { team: "AUS", points: 0, played: 2, wins: 0, draws: 0, losses: 2, goalDifference: -4 }
    ],
    D: [
      { team: "ESP", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 2 },
      { team: "GER", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 2 },
      { team: "CRO", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -1 },
      { team: "KOR", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -3 }
    ],
    E: [
      { team: "ENG", points: 6, played: 2, wins: 2, draws: 0, losses: 0, goalDifference: 4 },
      { team: "DEN", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 1 },
      { team: "SRB", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -1 },
      { team: "CMR", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -4 }
    ],
    F: [
      { team: "POR", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 2 },
      { team: "URU", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 1 },
      { team: "GHA", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 0 },
      { team: "CAN", points: 0, played: 2, wins: 0, draws: 0, losses: 2, goalDifference: -3 }
    ],
    G: [
      { team: "ITA", points: 6, played: 2, wins: 2, draws: 0, losses: 0, goalDifference: 5 },
      { team: "COL", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: 1 },
      { team: "SUI", points: 3, played: 2, wins: 1, draws: 0, losses: 1, goalDifference: -1 },
      { team: "KSA", points: 0, played: 2, wins: 0, draws: 0, losses: 2, goalDifference: -5 }
    ],
    H: [
      { team: "BEL", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 2 },
      { team: "AUT", points: 4, played: 2, wins: 1, draws: 1, losses: 0, goalDifference: 1 },
      { team: "CHI", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -1 },
      { team: "NGA", points: 1, played: 2, wins: 0, draws: 1, losses: 1, goalDifference: -2 }
    ]
  },
  bracket: {
    "Segunda fase": [
      { id: "sf-1", label: "Jogo 1", home: "2º Grupo B", away: "3º Grupo A", datetime: "18 jun · 16:00", stadium: "Recife" },
      { id: "sf-2", label: "Jogo 2", home: "2º Grupo D", away: "3º Grupo C", datetime: "18 jun · 20:00", stadium: "Brasília" },
      { id: "sf-3", label: "Jogo 3", home: "2º Grupo F", away: "3º Grupo E", datetime: "19 jun · 16:00", stadium: "Curitiba" },
      { id: "sf-4", label: "Jogo 4", home: "2º Grupo H", away: "3º Grupo G", datetime: "19 jun · 20:00", stadium: "Fortaleza" },
      { id: "sf-5", label: "Jogo 5", home: "2º Grupo A", away: "3º Grupo B", datetime: "20 jun · 16:00", stadium: "Salvador" },
      { id: "sf-6", label: "Jogo 6", home: "2º Grupo C", away: "3º Grupo D", datetime: "20 jun · 20:00", stadium: "Natal" },
      { id: "sf-7", label: "Jogo 7", home: "2º Grupo E", away: "3º Grupo F", datetime: "21 jun · 16:00", stadium: "Belo Horizonte" },
      { id: "sf-8", label: "Jogo 8", home: "2º Grupo G", away: "3º Grupo H", datetime: "21 jun · 20:00", stadium: "Rio de Janeiro" }
    ],
    Oitavas: [
      { id: "oit-1", label: "Oitavas 1", home: "1º Grupo A", away: "Vencedor Segunda fase 1", datetime: "22 jun · 20:00", stadium: "Rio de Janeiro" },
      { id: "oit-2", label: "Oitavas 2", home: "1º Grupo B", away: "Vencedor Segunda fase 2", datetime: "22 jun · 23:00", stadium: "São Paulo" },
      { id: "oit-3", label: "Oitavas 3", home: "1º Grupo C", away: "Vencedor Segunda fase 3", datetime: "23 jun · 20:00", stadium: "Fortaleza" },
      { id: "oit-4", label: "Oitavas 4", home: "1º Grupo D", away: "Vencedor Segunda fase 4", datetime: "23 jun · 23:00", stadium: "Brasília" },
      { id: "oit-5", label: "Oitavas 5", home: "1º Grupo E", away: "Vencedor Segunda fase 5", datetime: "24 jun · 20:00", stadium: "Curitiba" },
      { id: "oit-6", label: "Oitavas 6", home: "1º Grupo F", away: "Vencedor Segunda fase 6", datetime: "24 jun · 23:00", stadium: "Belo Horizonte" },
      { id: "oit-7", label: "Oitavas 7", home: "1º Grupo G", away: "Vencedor Segunda fase 7", datetime: "25 jun · 20:00", stadium: "Recife" },
      { id: "oit-8", label: "Oitavas 8", home: "1º Grupo H", away: "Vencedor Segunda fase 8", datetime: "25 jun · 23:00", stadium: "Salvador" }
    ],
    Quartas: [
      { id: "qua-1", label: "Quartas 1", home: "Vencedor Oitavas 1", away: "Vencedor Oitavas 2", datetime: "27 jun · 18:00", stadium: "Rio de Janeiro" },
      { id: "qua-2", label: "Quartas 2", home: "Vencedor Oitavas 3", away: "Vencedor Oitavas 4", datetime: "27 jun · 22:00", stadium: "Brasília" },
      { id: "qua-3", label: "Quartas 3", home: "Vencedor Oitavas 5", away: "Vencedor Oitavas 6", datetime: "28 jun · 18:00", stadium: "Belo Horizonte" },
      { id: "qua-4", label: "Quartas 4", home: "Vencedor Oitavas 7", away: "Vencedor Oitavas 8", datetime: "28 jun · 22:00", stadium: "Fortaleza" }
    ],
    Semifinais: [
      { id: "semi-1", label: "Semifinal 1", home: "Vencedor Quartas 1", away: "Vencedor Quartas 2", datetime: "30 jun · 21:00", stadium: "Salvador" },
      { id: "semi-2", label: "Semifinal 2", home: "Vencedor Quartas 3", away: "Vencedor Quartas 4", datetime: "01 jul · 21:00", stadium: "São Paulo" }
    ],
    Final: [
      { id: "final-1", label: "Final", home: "Vencedor Semifinal 1", away: "Vencedor Semifinal 2", datetime: "02 jul · 20:30", stadium: "Brasília" }
    ]
  }
};
