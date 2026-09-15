// app.jsx — Labuu Landing Page (dois lados: ajudante + contratante)
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "#E47310",
  "headline": "C"
} /*EDITMODE-END*/;

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/JF9DPRxdNcTEAchIvnKHmw?s=cl&p=a&ilr=4";

// ───────────────────── Conteúdo por audiência ─────────────────────
const CONTENT = {
  ajudante: {
    label: "Sou Ajudante",
    tag: "PRA QUEM TRABALHA DE AJUDANTE",
    sub: ["", "Labuu", " é seu app de trabalho. Ele te conecta ", "direto", " com quem precisa de um ajudante — sem enrolação, sem intermediário. Cadastre-se e comece a receber ", "chamados", "."],
    micro: ["Gratuito pra ajudante", "Receba chamados da sua região"],
    headlines: {
      A: { l1: "Trabalho ", accent: "toda semana", l2: ".", l3: "Sem ficar esperando alguém te ligar." },
      B: { l1: "Seu histórico ", accent: "registrado", l2: ".", l3: "Mais chamados. Sem depender de indicação." },
      C: { l1: "Chega de ficar parado ", accent: "esperando", l2: " alguém te chamar pra trabalhar.", l3: "" }
    },
    stats: [
    { num: "Serviço todo dia.", lbl: "" },
    { num: "Sem\nTaxas", lbl: "" },
    { num: "Pagamento Garantido", lbl: "" }],

    pains: [
    "Ficar a semana inteira esperando o celular tocar.",
    "Perder trampo pra quem foi chamado primeiro.",
    "Trabalhar bem e o empreiteiro não conseguir te indicar para os outros.",
    "Depender do grupo de zap. Amigos e conhecidos para te indicar.",
    "Não ter como mostrar seu trabalho pra quem ainda não te conhece.",
    "Depender da sorte. A sorte não paga as contas!"],

    painsKicker: "",
    painsTitle: "O problema não é falta de trabalho. É falta de visibilidade.",
    painsLead: "A demanda existe. O contratante está procurando ajudantes todos os dias. O problema é que vocês só não se conhecem.",
    steps: [
    { n: "01", title: "Baixa o app e cria seu perfil", desc: "Nome, tipo de serviço e região. Leva 5 minutos. Tudo gratuito." },
    { n: "02", title: "Contratantes te encontram", desc: "Quando precisam de reforço, abrem o app e veem seu histórico de trabalho." },
    { n: "03", title: "Recebe o chamado direto", desc: "Sem enrolação. Sem taxas. Sem esperar conhecido te chamar." },
    { n: "04", title: "Pagamento garantido", desc: "Dinheiro fica retido na plataforma antes de você começar e liberado em até 24h após o fim do serviço." }],

    solTitle: "Seu histórico fala por você.",
    solLead: "Cada serviço gera uma avaliação. Sua reputação cresce, e reputação boa vira mais chamado e diária melhor.",
    benefits: [
    { t: "Visibilidade onde tem trabalho", d: "Você aparece pra quem contrata perto — sem mandar mensagem em grupo." },
    { t: "Histórico registrado pra sempre", d: "Cada serviço bem feito vira prova pro próximo contrato." },
    { t: "Chamados chegam até você", d: "Contratantes te encontram pelo app. Você não precisa procurar." },
    { t: "Pagamento garantido", d: "Dinheiro retido antes do serviço começar. Sem dor de cabeça para receber." },
    { t: "App 100% gratuito", d: "sem complicação" },
    { t: "Base que volta a te chamar", d: "Quanto mais você trabalha bem, mais o app te indica." }],

    benefitsTitle: "6 coisas que você ganha — hoje.",
    quotePre: "É como ter alguém ", quoteEm: "divulgando seu trabalho 24 horas", quotePost: ", até enquanto você descansa.",
    crossTitle: "Seu serviço parado por falta de ajudante?",
    crossText: "A Labuu também é pra você. Cadastra o serviço e ajudantes da região aparecem com histórico verificado.",
    crossBtn: "Sou Contratante",
    guaranteeText: "Do cadastro ao pagamento, você fala com gente de verdade — suporte direto pelo app.",
    guaranteeItems: ["Suporte humano no app, todo dia", "Dúvida resolvida no mesmo dia", "Pagamento garantido"]
  },

  contratante: {
    label: "Preciso de Ajudante",
    tag: "PRA QUEM TOCA OBRA",
    sub: ["Encontre ajudantes com histórico real perto de você. Sem grupos de mensagens, sem vizinho, sem ficar refém de indicação. Você publica seu pedido e o ajudante chega.", "", "", "", "", "", ""],
    micro: ["", "Cadastre-se e já publique seu pedido"],
    headlines: {
      A: { l1: "Reforço pra obra ", accent: "na hora", l2: ".", l3: "Sem precisar correr atrás de ninguém." },
      B: { l1: "Veja o histórico ", accent: "antes de contratar", l2: ".", l3: "Acabou o jogo do escuro." },
      C: { l1: "Chega de ", accent: "improvisar", l2: " quem vai pro serviço amanhã.", l3: "" }
    },
    stats: [
    { num: "Perfil 100% verificado", lbl: "" },
    { num: "Avaliações reais", lbl: "" },
    { num: "Todos os dias", lbl: "" }],

    pains: [
    "Atrasar a obra porque não achou ajudante na hora certa.",
    "Pegar alguém sem histórico e o serviço não render — só perder dinheiro.",
    "Contar com o ajudante no dia e ele não aparecer.",
    "Mandar zap em 5 grupos e ninguém aparecer.",
    "Não saber o histórico de quem chega na sua obra.",
    "Perder tempo procurando ajudante quando o prazo da obra já tá atrasado."],

    painsKicker: "",
    painsTitle: "Chega de depender só de conhecidos. Tenha ajudante disponível sempre que precisar.",
    painsLead: "Indicação é boa — até o dia que ela falha. Quando o reforço não vem, o serviço para. E quem perde é você.",
    steps: [
    { n: "01", title: "Descreva a diária", desc: "Informe local, horário e o serviço. Em poucos minutos seu pedido está no ar." },
    { n: "02", title: "Escolha o ajudante", desc: "Defina o perfil ideal, próximo de você." },
    { n: "03", title: "Contrate e avalie", desc: "Contrate pelo histórico e avalie ao fim da diária." }],

    solTitle: "Reforço com perfil qualificado e histórico de jornada.",
    solLead: "Os ajudantes na Labuu já trabalharam em obras avaliadas. Você vê o histórico antes de decidir — não precisa apostar no escuro.",
    benefits: [
    { t: "Histórico verificado", d: "Veja avaliações reais de quem já contratou aquele ajudante antes." },
    { t: "Reforço rápido", d: "Cadastra o serviço e ajudantes da região chegam no seu painel." },
    { t: "Pagamento só depois do serviço", d: "Valor fica retido na plataforma." },
    { t: "Sua rede de confiança cresce", d: "Marca seus favoritos e chama eles primeiro nas próximas obras." },
    { t: "Vaga publicada", d: "Contratou, resolveu. Sem complicação." },
    { t: "Suporte direto no App", d: "Teve problema? Fale com a gente." }],

    benefitsTitle: "6 coisas que mudam na sua obra.",
    quotePre: "É como ter uma ", quoteEm: "secretaria procurando ajudante", quotePost: " pra você o tempo todo.",
    crossTitle: "Você trabalha em obra e quer mais chamados?",
    crossText: "A Labuu também é pra ajudantes. Se cadastra e contratantes da região te encontram quando precisam de reforço.",
    crossBtn: "Ver lado de ajudante",
    guaranteeText: "Suporte humano direto pelo app, do cadastro ao pagamento. Se o ajudante furar, o dinheiro fica retido. Se acontecer qualquer problema na diária, a gente intervém no mesmo dia para resolver o problema.",
    guaranteeItems: ["Pagamento retido até a diária ser concluída", "Equipe de Suporte no app"]
  }
};

const TESTIMONIALS = [
{
  quote: "Antes eu ficava 2 semanas parado. Depois da Labuu, já tive chamado na primeira semana.",
  name: "Cícero Andrade", role: "Ajudante de obra", loc: "Recife · PE", initial: "C"
},
{
  quote: "Faltou um servente de última hora. Cadastrei na Labuu, em 3 horas tinha 4 perfis pra escolher.",
  name: "Marcos Tavares", role: "Empreiteiro · Construtora MT", loc: "Belo Horizonte · MG", initial: "M"
},
{
  quote: "Trabalhei sabendo que o dinheiro já tava garantido. Isso fez diferença.",
  name: "Joelson Ribeiro", role: "Ajudante", loc: "Salvador · BA", initial: "J"
},
{
  quote: "Saí dos grupos de WhatsApp. Hoje contrato direto pelo app e tenho histórico de quem é bom.",
  name: "Renata Alves", role: "Contratante · Reformas RA", loc: "Curitiba · PR", initial: "R"
}];


const FAQ = [
{ q: "Quanto custa baixar o app?", a: "Nada. O app é gratuito pra baixar e usar — tanto pra ajudante quanto pra quem contrata. Você paga uma taxa pequena só quando um serviço é fechado pelo app." },
{ q: "Sou empreiteiro. Como contrato pelo app?", a: "Cadastra o serviço (tipo, endereço, dia, valor), ajudantes da região aparecem com histórico. Você escolhe, confirma, e o pagamento fica retido até o serviço terminar." },
{ q: "Sou ajudante. Que tipo de serviço posso aceitar?", a: "Qualquer serviço de apoio em obra: servente, carregador, diarista de construção, limpeza pós-obra, demolição simples. Não precisa ser especializado." },
{ q: "Como funciona o pagamento?", a: "O contratante paga antes do serviço começar. O valor fica retido na Labuu e é liberado pro ajudante quando o serviço termina e é confirmado." },
{ q: "E se eu não gostar?", a: "Sai quando quiser. Sem contrato, sem mensalidade, sem multa. É só desinstalar o app." },
{ q: "Tem suporte? Como funciona?", a: "Tem. Pelo WhatsApp da Labuu, todo dia da semana. Você não fica na mão — nem como ajudante, nem como contratante." },
{ q: "Precisa de smartphone bom?", a: "Não. O seu celular abre WhatsApp? Então fica tranquilo, o app da Labuu funciona perfeitamente." }];


// ───────────────────── Headline renderer ─────────────────────
function Headline({ data, which }) {
  const h = data.headlines[which] || data.headlines.C;
  return (
    <h1>
      {h.l1}
      {h.accent && <span className="accent">{h.accent}</span>}
      {h.l2}
      {h.l3 && <><br />{h.l3}</>}
    </h1>);

}

// ───────────────────── Audience toggle ─────────────────────
function AudienceToggle({ value, onChange }) {
  return (
    <div className="aud-toggle" role="tablist">
      <button role="tab" className={value === "ajudante" ? "on" : ""}
      onClick={() => onChange("ajudante")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" />
          <path d="M17.64 15L22 10.64" />
          <path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
        </svg>
        <span className="aud-toggle-label">Sou Ajudante</span>
      </button>
      <button role="tab" className={value === "contratante" ? "on" : ""}
      onClick={() => onChange("contratante")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span className="aud-toggle-label">Preciso de Ajudante</span>
      </button>
    </div>);

}

// ───────────────────── Play Store Button ─────────────────────
function PlayBadge({ orange = false, big = false, onOpen }) {
  return (
    <button type="button" onClick={onOpen}
    className={"ps-btn" + (orange ? " is-orange" : "")}
    style={big ? { padding: "20px 32px 20px 26px" } : null}>
      <svg className="icon" viewBox="0 0 512 512" aria-hidden="true">
        <defs>
          <linearGradient id="pg-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00C3FF" /><stop offset="1" stopColor="#1A73E8" />
          </linearGradient>
          <linearGradient id="pg-red" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF3A44" /><stop offset="1" stopColor="#C31162" />
          </linearGradient>
          <linearGradient id="pg-yellow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD500" /><stop offset="1" stopColor="#FFA000" />
          </linearGradient>
          <linearGradient id="pg-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00F076" /><stop offset="1" stopColor="#00B14F" />
          </linearGradient>
        </defs>
        <path fill="url(#pg-blue)" d="M61 30c-7 7-11 18-11 32v388c0 14 4 25 11 32l2 2 217-217v-22L63 28l-2 2z" />
        <path fill="url(#pg-red)" d="M61 30L280 249 354 175 95 27c-13-7-25-7-34 3z" />
        <path fill="url(#pg-yellow)" d="M353 339L280 263 61 482c10 10 22 10 34 3l258-146z" />
        <path fill="url(#pg-green)" d="M353 175L280 249l73 73 102-58c20-11 20-27 0-38l-102-51z" />
      </svg>
      <span className="lbl">
        <small>BAIXE NA</small>
        <strong>Google Play</strong>
      </span>
    </button>);

}

// ───────────────────── FAQ ─────────────────────
function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {FAQ.map((item, i) =>
      <div key={i} className="faq-item" data-open={open === i}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="plus">+</span>
          </button>
          <div className="faq-a">
            <div className="faq-a-inner">{item.a}</div>
          </div>
        </div>
      )}
    </div>);

}

// ───────────────────── Brand block (mascot hero) ─────────────────────
function BrandBlock({ audience }) {
  const isAjudante = audience === "ajudante";
  return (
    <div className="hero-brand" aria-hidden="true">
      <img className="mascot-img" src="assets/labu-mascot.jpeg" alt="Labu, mascote da Labuu" />
      <div className="brand-tag">
        <span className="dot"></span>
        <span>Olá, sou o Labu</span>
      </div>
      <div className="brand-phone-card">
        <div className="row">
          <div className="ico">{isAjudante ? "OB" : "✓"}</div>
          <div className="meta">
            <span className="role">{isAjudante ? "Servente · Obra" : "Reforço confirmado"}</span>
            <span className="loc">{isAjudante ? "Recife · 2,4 km" : "Quinta · Recife"}</span>
          </div>
        </div>
        <div className="val">
          <span>{isAjudante ? "diária" : "pagamento"}</span>
          <strong>R$ 180</strong>
        </div>
      </div>
      <div className="brand-name">
        <div className="who">
          <small>App do</small>
          <strong>Ajudante</strong>
        </div>
        <div className="badge">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
          </svg>
          4.8
        </div>
      </div>
    </div>);

}

// ───────────────────── Phone mockup (per audience) ─────────────────────
function PhoneMockup({ audience }) {
  const [tab, setTab] = useState("inicio");
  const [loggedIn, setLoggedIn] = useState(false);

  if (audience === "contratante") {
    return (
      <div className="hero-vis" aria-hidden="true">
        <div className="hero-vis-screen">
          <div className="hero-vis-status">
            <span>9:41</span>
            <span className="right">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4l2 2a7.07 7.07 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
            </span>
          </div>
          {!loggedIn &&
          <div className="app-login" style={{ backgroundImage: "url(assets/app-login-screen-cropped.png)" }}>
            <div className="app-login-submit" onClick={() => { setLoggedIn(true); setTab("inicio"); }}></div>
          </div>}
          {loggedIn && <>
          {tab !== "menu" &&
          <div className="app-topbar">
            <img className="app-topbar-avatar" src="assets/avatar-contratante-topbar-avatar.webp" alt="" />
            <strong>Contratante</strong>
            <div className="app-topbar-icons">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" /></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 8h16c0-2-2-3-2-8z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
            </div>
          </div>}
          {tab === "inicio" &&
          <>
            <div className="app-real-head">
              <div className="h">Bom dia, Marcos!</div>
            </div>
            <div className="app-feed">
              <div className="app-notice-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="M12 8v4M12 15h.01" /></svg>
                <strong>Verifique sua identidade</strong>
                <p>Confirme seus dados e ganhe o selo de verificação.</p>
                <div className="app-notice-cta">Verificar agora</div>
              </div>
              <div className="app-notice-card danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"><path d="M12 4 3 20h18z" /><path d="M12 10v4M12 17h.01" /></svg>
                <strong>Ajudante atrasado há mais de 30 minutos</strong>
                <p>Ninguém fez check-in em Sua Casa ainda. Se ele não aparecer, fale com o suporte pra solicitar outro ajudante.</p>
                <div className="app-notice-cta danger">Falar com o suporte</div>
              </div>
              <div className="app-notice-card plain">
                <strong>Seus pedidos</strong>
                <p>1 aguardando candidatos · 7 com propostas recebidas.</p>
                <div className="app-notice-cta" onClick={() => setTab("painel")}>Visualizar pedidos</div>
              </div>
            </div>
          </>}
          {tab === "painel" &&
          <>
            <div className="app-real-head">
              <div className="h">Meu painel</div>
              <div className="sub">Acompanhe candidaturas dos ajudantes em Guarulhos.</div>
            </div>
            <div className="app-feed">
              <div className="app-cta-banner">+ Novo pedido</div>
              <div className="app-tabs">
                <div className="app-tab on">Publicados 1</div>
                <div className="app-tab">Respondidos</div>
                <div className="app-tab">Em andamento</div>
              </div>
              <div className="app-job-real">
                <strong className="jr-title">Ajudante de Obra</strong>
                <div className="jr-status">Recebendo candidatos</div>
                <div className="jr-loc">Avenida Salgado Filho · Vila Rio, Guarulhos</div>
                <div className="jr-time">10/09/2026 · 09:30–14:00 (+5 outras)</div>
                <div className="jr-bottom">
                  <div className="jr-cta ghost">Editar</div>
                  <div className="jr-cta ghost warn">Excluir</div>
                </div>
                <div className="jr-views">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                  14 ajudantes visualizando
                </div>
              </div>
            </div>
          </>}
          {tab === "conversas" &&
          <>
            <div className="app-real-head">
              <div className="h">Conversas</div>
              <div className="sub">Fale direto com ajudantes e o suporte.</div>
            </div>
            <div className="app-feed">
              <div className="app-chat">
                <img className="badge-photo" src="assets/avatar-chat-avatar-contratante-cicero.webp" alt="" />
                <div className="meta"><span className="role">Cícero</span><span className="loc">Chego às 8h, pode confirmar o endereço?</span></div>
                <small>09:02</small>
              </div>
              <div className="app-chat">
                <img className="badge-photo" src="assets/support-agent.jpeg" alt="" />
                <div className="meta"><span className="role">Suporte Labuu</span><span className="loc">Seu pedido foi publicado com sucesso ✅</span></div>
                <small>Ontem</small>
              </div>
              <div className="app-chat">
                <img className="badge-photo" src="assets/avatar-chat-avatar-contratante-1.webp" alt="" />
                <div className="meta"><span className="role">Felipe Silva de Souza</span><span className="loc">Cheguei mais cedo, já pode conferir o serviço.</span></div>
                <small>Ontem</small>
              </div>
            </div>
          </>}
          {tab === "ajudantes" &&
          <>
            <div className="app-real-head">
              <div className="h">👥 Ajudantes</div>
              <div className="sub">Veja quem já trabalhou com você e monte sua lista de favoritos.</div>
            </div>
            <div className="app-tabs">
              <div className="app-tab on">Já trabalhou com você</div>
              <div className="app-tab">Favoritos</div>
            </div>
            <div className="app-feed">
              <div className="app-helper-row">
                <div className="app-helper-avatar letter">L<span></span></div>
                <div className="meta"><span className="role">Luigi</span><span className="loc">☆ Sem avaliação</span></div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>
              </div>
              <div className="app-helper-row">
                <img className="app-helper-avatar" src="assets/avatar-helper-avatar-felipe.webp" alt="" /><span className="app-helper-dot"></span>
                <div className="meta"><span className="role">Felipe Silva de Souza</span><span className="loc">☆ Sem avaliação</span></div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>
              </div>
            </div>
          </>}
          {tab === "menu" &&
          <div className="app-menu-body">
            <div className="app-menu-header">
              <img className="app-menu-avatar" src="assets/avatar-contratante-menu-avatar.webp" alt="" />
              <div className="app-menu-who">
                <strong>Contratante</strong>
                <small>Contratante</small>
              </div>
              <div className="app-menu-icons">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" /></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 8h16c0-2-2-3-2-8z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              </div>
            </div>
            <div className="app-menu-statcard">
              <div className="app-menu-stat"><strong>8</strong><small>Pedidos<br />publicados</small></div>
              <div className="app-menu-stat"><strong>23</strong><small>Ajudantes<br />contratados</small></div>
              <div className="app-menu-stat"><strong>4.8</strong><small>Avaliação<br />média</small></div>
            </div>
            <div className="app-menu-cta">Meu desempenho</div>
            <div className="app-menu-scroll">
              <div className="app-menu-list">
                <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></svg><span>Perfil</span><small>›</small></div>
                <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg><span>Dados de pagamento</span><small>›</small></div>
                <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4 3 20h18z" /><path d="M12 10v4M12 17h.01" /></svg><span>Ocorrências</span><small>›</small></div>
                <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="7" r="2.4" /><circle cx="17" cy="5" r="2.2" /><circle cx="17" cy="19" r="2.2" /><path d="M9 8.4 15 5.6M9 9.6l6 8" /></svg><span>Convidar amigos</span><small>›</small></div>
              </div>
            </div>
          </div>}
          <div className="app-nav">
            <div className={"app-nav-item" + (tab === "inicio" ? " on" : "")} onClick={() => setTab("inicio")}>
              <div className="app-nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 4 9v12h5v-7h6v7h5V9z" /></svg>
              </div>
              Início
            </div>
            <div className={"app-nav-item" + (tab === "painel" ? " on" : "")} onClick={() => setTab("painel")}>
              <div className="app-nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4zm9 0h7v7h-7zm-9 9h7v7H4zm9 0h7v7h-7z" /></svg>
              </div>
              Painel
            </div>
            <div className={"app-nav-item" + (tab === "conversas" ? " on" : "")} onClick={() => setTab("conversas")}>
              <div className="app-nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z" /></svg>
              </div>
              Conversas
            </div>
            <div className={"app-nav-item" + (tab === "ajudantes" ? " on" : "")} onClick={() => setTab("ajudantes")}>
              <div className="app-nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3 0-8 1.5-8 4.5V21h16v-2.5c0-3-5-4.5-8-4.5z" /></svg>
              </div>
              Ajudantes
            </div>
            <div className={"app-nav-item" + (tab === "menu" ? " on" : "")} onClick={() => setTab("menu")}>
              <div className="app-nav-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" /></svg>
              </div>
              Menu
            </div>
          </div>
          </>}
        </div>
      </div>);

  }

  // ajudante (default)
  return (
    <div className="hero-vis" aria-hidden="true">
      <div className="hero-vis-screen">
        <div className="hero-vis-status">
          <span>9:41</span>
          <span className="right">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4l2 2a7.07 7.07 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
          </span>
        </div>
        {!loggedIn &&
        <div className="app-login" style={{ backgroundImage: "url(assets/app-login-screen-cropped.png)" }}>
          <div className="app-login-submit" onClick={() => { setLoggedIn(true); setTab("inicio"); }}></div>
        </div>}
        {loggedIn && <>
        {tab !== "menu" &&
        <div className="app-topbar">
          <img className="app-topbar-avatar" src="https://i.pravatar.cc/64?img=52" alt="" />
          <strong>Ajudante</strong>
          <div className="app-topbar-icons">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" /></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 8h16c0-2-2-3-2-8z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
          </div>
        </div>}
        {tab === "inicio" &&
        <>
          <div className="app-real-head">
            <div className="h">Bom dia, Cícero!</div>
          </div>
          <div className="app-feed">
            <div className="app-notice-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="M12 8v4M12 15h.01" /></svg>
              <strong>Verifique sua identidade</strong>
              <p>É necessário para poder se candidatar às vagas.</p>
              <div className="app-notice-cta">Verificar agora</div>
            </div>
            <div className="app-notice-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></svg>
              <strong>Cadastre sua chave Pix!</strong>
              <p>Para receber os pagamentos dos seus serviços, você precisa cadastrar uma chave Pix.</p>
              <div className="app-notice-cta">Cadastrar Pix</div>
            </div>
            <div className="app-notice-card plain">
              <strong>Serviços de hoje</strong>
              <p>Você não tem serviços reservados para hoje.</p>
              <div className="app-notice-ghost" onClick={() => setTab("vagas")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                Buscar vagas
              </div>
            </div>
          </div>
        </>}
        {tab === "vagas" &&
        <>
          <div className="app-real-head">
            <div className="h">Solicitações de serviço</div>
            <div className="sub">15 oportunidades em até 5 km de você.</div>
          </div>
          <div className="app-sort-row">
            <div className="app-sort">Ordenar: Relevância</div>
            <div className="app-filter">Filtros</div>
          </div>
          <div className="app-days">
            {[["SEG", "14"], ["TER", "15"], ["QUA", "16"], ["QUI", "17"], ["SEX", "18"]].map(([d, n]) =>
            <div className="app-day" key={d}><small>{d}</small><strong>{n}</strong><span></span></div>)}
          </div>
          <div className="app-feed">
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE OBRA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Jardim Santa Cecília, Guarulhos · 0.5 km</div>
              <div className="jr-time">14/09 – 17/09 · 08:00–15:00 · 7h/dia</div>
              <div className="jr-bottom">
                <div className="jr-price">4 diárias · R$ 150<small>/dia</small></div>
                <div className="jr-cta">Candidatar-se</div>
              </div>
            </div>
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE ELÉTRICA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Vila Rio, Guarulhos · 0.4 km</div>
              <div className="jr-time">24/09 · 11:00–19:30 · 8.5h/dia</div>
              <div className="jr-bottom">
                <div className="jr-price">1 diária · R$ 180<small>/dia</small></div>
                <div className="jr-cta">Candidatar-se</div>
              </div>
            </div>
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE PINTURA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Centro, Guarulhos · 1.1 km</div>
              <div className="jr-time">28/09 · 08:00–17:00 · 8h/dia</div>
              <div className="jr-bottom">
                <div className="jr-price">2 diárias · R$ 160<small>/dia</small></div>
                <div className="jr-cta">Candidatar-se</div>
              </div>
            </div>
          </div>
        </>}
        {tab === "painel" &&
        <>
          <div className="app-real-head">
            <div className="h">Meu painel</div>
            <div className="sub">Suas candidaturas e serviços concluídos.</div>
          </div>
          <div className="app-avail-row">
            <div>
              <strong>Disponível para novos serviços</strong>
              <small>Contratantes veem você como disponível.</small>
            </div>
            <div className="app-switch on"><span></span></div>
          </div>
          <div className="app-tabs">
            <div className="app-tab on">Enviados 3</div>
            <div className="app-tab">Pendentes</div>
            <div className="app-tab">Aceitos</div>
          </div>
          <div className="app-feed">
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE OBRA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Centro, Guarulhos · 11/09</div>
              <div className="jr-time">16:30–20:30 · 4h/dia · 1 diária · R$ 130/dia</div>
              <div className="jr-bottom">
                <div className="jr-cta alt">Conversar</div>
                <div className="jr-cta ghost">Candidatura enviada</div>
              </div>
            </div>
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE PINTURA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Vila Rio, Guarulhos · 12/09</div>
              <div className="jr-time">08:00–12:00 · 4h/dia · 1 diária · R$ 110/dia</div>
              <div className="jr-bottom">
                <div className="jr-cta alt">Conversar</div>
                <div className="jr-cta ghost">Candidatura enviada</div>
              </div>
            </div>
            <div className="app-job-real">
              <div className="jr-top">
                <span className="jr-tag">AJUDANTE DE ELÉTRICA</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z" /><circle cx="12" cy="10" r="1.4" fill="currentColor" /></svg>
              </div>
              <div className="jr-loc">Vila Rio, Guarulhos · 14/09</div>
              <div className="jr-time">11:00–19:30 · 8.5h/dia · 1 diária · R$ 180/dia</div>
              <div className="jr-bottom">
                <div className="jr-cta alt">Conversar</div>
                <div className="jr-cta ghost">Candidatura enviada</div>
              </div>
            </div>
          </div>
        </>}
        {tab === "conversas" &&
        <>
          <div className="app-real-head">
            <div className="h">Conversas</div>
            <div className="sub">Fale direto com contratantes e o suporte.</div>
          </div>
          <div className="app-feed">
            <div className="app-chat">
              <img className="badge-photo" src="assets/avatar-chat-avatar-1.webp" alt="" />
              <div className="meta"><span className="role">Construtora Oliveira</span><span className="loc">Combinado! Te espero às 8h.</span></div>
              <small>09:14</small>
            </div>
            <div className="app-chat">
              <img className="badge-photo" src="assets/support-agent.jpeg" alt="" />
              <div className="meta"><span className="role">Suporte Labuu</span><span className="loc">Seu cadastro foi aprovado ✅</span></div>
              <small>Ontem</small>
            </div>
            <div className="app-chat">
              <img className="badge-photo" src="assets/avatar-chat-avatar-3.webp" alt="" />
              <div className="meta"><span className="role">Reforma Moura</span><span className="loc">Ficou show o serviço de ontem 👍</span></div>
              <small>Ontem</small>
            </div>
          </div>
        </>}
        {tab === "menu" &&
        <div className="app-menu-body">
          <div className="app-menu-header">
            <img className="app-menu-avatar" src="https://i.pravatar.cc/64?img=52" alt="" />
            <div className="app-menu-who">
              <strong>Ajudante</strong>
              <small>Ajudante</small>
            </div>
            <div className="app-menu-icons">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" /></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 8h16c0-2-2-3-2-8z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
            </div>
          </div>
          <div className="app-menu-statcard">
            <div className="app-menu-stat"><strong>4.9</strong><small>Avaliação</small></div>
            <div className="app-menu-stat"><strong>127</strong><small>Atendimentos<br />finalizados</small></div>
            <div className="app-menu-stat"><strong>3</strong><small>Serviços em<br />aberto</small></div>
          </div>
          <div className="app-menu-cta">Meu desempenho</div>
          <div className="app-menu-scroll">
            <div className="app-menu-visited-title">Mais visitados</div>
            <div className="app-menu-grid">
              <div className="app-menu-grid-item">
                <div className="app-menu-grid-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></svg></div>
                <small>Perfil</small>
              </div>
              <div className="app-menu-grid-item">
                <div className="app-menu-grid-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></svg></div>
                <small>Carteira</small>
              </div>
              <div className="app-menu-grid-item">
                <div className="app-menu-grid-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4 3 20h18z" /><path d="M12 10v4M12 17h.01" /></svg></div>
                <small>Ocorrências</small>
              </div>
              <div className="app-menu-grid-item">
                <div className="app-menu-grid-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg></div>
                <small>Dados bancários</small>
              </div>
            </div>
            <div className="app-menu-list">
              <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></svg><span>Perfil</span><small>›</small></div>
              <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg><span>Dados bancários</span><small>›</small></div>
              <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4 3 20h18z" /><path d="M12 10v4M12 17h.01" /></svg><span>Ocorrências</span><small>›</small></div>
              <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></svg><span>Carteira</span><small>›</small></div>
              <div className="app-menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="7" r="2.4" /><circle cx="17" cy="5" r="2.2" /><circle cx="17" cy="19" r="2.2" /><path d="M9 8.4 15 5.6M9 9.6l6 8" /></svg><span>Convidar amigos</span><small>›</small></div>
            </div>
          </div>
        </div>}
        <div className="app-nav">
          <div className={"app-nav-item" + (tab === "inicio" ? " on" : "")} onClick={() => setTab("inicio")}>
            <div className="app-nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 4 9v12h5v-7h6v7h5V9z" /></svg>
            </div>
            Início
          </div>
          <div className={"app-nav-item" + (tab === "vagas" ? " on" : "")} onClick={() => setTab("vagas")}>
            <div className="app-nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v18l-6-3V6zm2 0 4-2 4 2v18l-4-2zm10 0v18l-6-3V3z" /></svg>
            </div>
            Vagas
          </div>
          <div className={"app-nav-item" + (tab === "painel" ? " on" : "")} onClick={() => setTab("painel")}>
            <div className="app-nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4zm9 0h7v7h-7zm-9 9h7v7H4zm9 0h7v7h-7z" /></svg>
            </div>
            Painel
          </div>
          <div className={"app-nav-item" + (tab === "conversas" ? " on" : "")} onClick={() => setTab("conversas")}>
            <div className="app-nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z" /></svg>
            </div>
            Conversas
          </div>
          <div className={"app-nav-item" + (tab === "menu" ? " on" : "")} onClick={() => setTab("menu")}>
            <div className="app-nav-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" /></svg>
            </div>
            Menu
          </div>
        </div>
        </>}
      </div>
    </div>);

}

// ───────────────────── Pre-launch popup ─────────────────────
function trackWhatsAppClick() {
  const event_id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());

  if (window.ttq) ttq.track("Contact", {}, { event_id });

  const body = JSON.stringify({
    event: "Contact",
    event_id,
    url: window.location.href,
    referrer: document.referrer,
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  }
}

function PrelaunchModal({ onClose, onContinue }) {
  return (
    <div className="prelaunch-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="prelaunch-card" onClick={(e) => e.stopPropagation()}>
        <button className="prelaunch-close" onClick={onClose} aria-label="Fechar">×</button>
        <div className="prelaunch-badge">🔥 VAGAS LIMITADAS · PRÉ-LANÇAMENTO</div>
        <h3>O app Labuu está chegando — e você pode garantir sua vaga antes de todo mundo</h3>
        <p>Faça seu cadastro agora e garanta sua vaga no aplicativo assim que ele for lançado.</p>
        <button type="button" className="prelaunch-cta" onClick={onContinue}>
          👉 Cadastrar agora
        </button>
      </div>
    </div>);

}

// ───────────────────── Autocomplete de cidades (IBGE) ─────────────────────
let CITY_CACHE = null;
async function loadCities() {
  if (CITY_CACHE) return CITY_CACHE;
  try {
    const res = await fetch("/api/cidades");
    CITY_CACHE = await res.json();
  } catch (err) {
    CITY_CACHE = [];
  }
  return CITY_CACHE;
}
const ACCENT_MAP = { á: "a", à: "a", â: "a", ã: "a", ä: "a", é: "e", è: "e", ê: "e", ë: "e", í: "i", ì: "i", î: "i", ï: "i", ó: "o", ò: "o", ô: "o", õ: "o", ö: "o", ú: "u", ù: "u", û: "u", ü: "u", ç: "c", ñ: "n" };
function normalizeText(s) {
  return s.toLowerCase().replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, (ch) => ACCENT_MAP[ch] || ch);
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const ESPECIALIDADE_OPTIONS = [
"Ajudante de pintura",
"Ajudante de pedreiro",
"Ajudante de eletricista",
"Ajudante de carpinteiro"];


const DIFICULDADE_OPTIONS = [
"Falta de indicação — pouca gente conhece meu trabalho",
"Depender só de grupos de WhatsApp",
"Poucos chamados, trabalho irregular",
"Concorrência com quem já tem contato direto",
"Não ter como mostrar meu histórico e avaliações"];


function resolveSingle(value, outroText) {
  return value === "Outros" ? `Outros: ${outroText.trim()}` : value;
}

// ───────────────────── Grupo de opções (escolha única) ─────────────────────
function ChoiceGroup({ name, options, selected, onSelect, outroValue, onOutroChange }) {
  return (
    <>
      <div className="cadastro-check-grid">
        {options.map((opt) =>
        <label key={opt} className={"cadastro-check" + (selected === opt ? " on" : "")}>
            <input type="radio" name={name} checked={selected === opt} onChange={() => onSelect(opt)} />
            {opt}
          </label>
        )}
        <label className={"cadastro-check" + (selected === "Outros" ? " on" : "")}>
          <input type="radio" name={name} checked={selected === "Outros"} onChange={() => onSelect("Outros")} />
          Outros
        </label>
      </div>
      {selected === "Outros" &&
      <input type="text" className="cadastro-outro-input" value={outroValue}
      onChange={(e) => onOutroChange(e.target.value)} placeholder="Escreva aqui..." />}
    </>);

}

// ───────────────────── Cadastro modal ─────────────────────
function CadastroModal({ step, onClose, onSuccess, onSwitchStep }) {
  const [form, setForm] = useState({
    nome: "", telefone: "", email: "", senha: "", confirmarSenha: "", interesse: "ajudante",
    cidade: "", uf: "",
    especialidade: "", especialidadeOutro: "",
    dificuldade: "", dificuldadeOutro: ""
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [cityList, setCityList] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => { loadCities(); }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleCidadeChange(value) {
    update("cidade", value);
    update("uf", "");
    if (!value.trim()) { setCityList([]); setCityOpen(false); return; }
    const q = normalizeText(value);
    loadCities().then((all) => {
      const matches = all.filter((c) => normalizeText(c.nome).includes(q)).slice(0, 8);
      setCityList(matches);
      setCityOpen(matches.length > 0);
    });
  }

  function selectCidade(c) {
    update("cidade", c.nome);
    update("uf", c.uf);
    setCityList([]);
    setCityOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim()) {
      setError("Informe seu nome e sobrenome.");
      return;
    }
    if (form.telefone.replace(/\D/g, "").length < 10) {
      setError("Informe um número de celular válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (form.senha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (form.confirmarSenha !== form.senha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!form.especialidade) {
      setError("Selecione sua especialidade.");
      return;
    }
    if (form.especialidade === "Outros" && !form.especialidadeOutro.trim()) {
      setError("Escreva sua especialidade em \"Outros\".");
      return;
    }
    if (!form.dificuldade) {
      setError("Selecione sua maior dificuldade.");
      return;
    }
    if (form.dificuldade === "Outros" && !form.dificuldadeOutro.trim()) {
      setError("Escreva sua dificuldade em \"Outros\".");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          email: form.email,
          senha: form.senha,
          interesse: form.interesse,
          cidade: form.cidade,
          uf: form.uf,
          especialidade: resolveSingle(form.especialidade, form.especialidadeOutro),
          dificuldade: resolveSingle(form.dificuldade, form.dificuldadeOutro)
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409 && data.error === "already_registered") {
          setSending(false);
          setError(
            data.field === "email"
              ? "Esse e-mail já está cadastrado. Use o link \"Entrar\" abaixo pra acessar sua conta."
              : "Esse telefone já está cadastrado. Use o link \"Entrar\" abaixo pra acessar sua conta."
          );
          return;
        }
        throw new Error("bad status");
      }

      const event_id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
      if (window.ttq) ttq.track("CompleteRegistration", {}, { event_id });

      onSuccess();
    } catch (err) {
      setSending(false);
      setError("Não deu pra enviar agora. Confere sua internet e tenta de novo.");
    }
  }

  return (
    <div className="prelaunch-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cadastro-card" onClick={(e) => e.stopPropagation()}>
        <button className="prelaunch-close" onClick={onClose} aria-label="Fechar">×</button>

        {step === "success" ? (
          <>
            <div className="prelaunch-badge">✅ CADASTRO CONCLUÍDO</div>
            <h3>Prontinho! Seu cadastro foi concluído.</h3>
            <p>Agora entra na nossa comunidade exclusiva no WhatsApp e garanta benefícios exclusivos, só pra quem chegou cedo.</p>
            <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="prelaunch-cta" onClick={() => { trackWhatsAppClick(); onClose(); }}>
              👉 Entrar na comunidade exclusiva
            </a>
          </>
        ) : step === "login" ? (
          <LoginForm onSuccess={onSuccess} onSwitchStep={onSwitchStep} />
        ) : (
          <>
            <div className="prelaunch-badge">🔥 VAGAS LIMITADAS · PRÉ-LANÇAMENTO</div>
            <h3>Garanta seu lugar na Labuu</h3>
            <p className="cadastro-lead">Preenche rapidinho pra gente te conhecer melhor — assim que o app abrir, seu cadastro já tá pronto.</p>
            <form className="cadastro-form" onSubmit={handleSubmit}>
              <label className="cadastro-label">
                Nome e sobrenome
                <input type="text" required autoComplete="name" value={form.nome}
                  onChange={(e) => update("nome", e.target.value)} placeholder="Seu nome completo" />
              </label>
              <label className="cadastro-label">
                Número de celular
                <input type="tel" required autoComplete="tel" value={form.telefone}
                  onChange={(e) => update("telefone", formatPhone(e.target.value))} placeholder="(11) 98765-4321" />
              </label>
              <label className="cadastro-label">
                E-mail
                <input type="email" required autoComplete="email" value={form.email}
                  onChange={(e) => update("email", e.target.value)} placeholder="seu@email.com" />
              </label>
              <label className="cadastro-label">
                Crie uma senha
                <input type="password" required autoComplete="new-password" value={form.senha}
                  onChange={(e) => update("senha", e.target.value)} placeholder="Mínimo 6 caracteres" />
              </label>
              <label className="cadastro-label">
                Confirme sua senha
                <input type="password" required autoComplete="new-password" value={form.confirmarSenha}
                  onChange={(e) => update("confirmarSenha", e.target.value)} placeholder="Repita a senha" />
              </label>

              <div className="cadastro-label" style={{ marginBottom: 0 }}>Seu interesse é encontrar oportunidade de serviço como...</div>
              <div className="cadastro-radio-row">
                <label className={"cadastro-radio" + (form.interesse === "ajudante" ? " on" : "")}>
                  <input type="radio" name="interesse" value="ajudante" checked={form.interesse === "ajudante"} onChange={() => update("interesse", "ajudante")} />
                  Ajudante
                </label>
                <label className={"cadastro-radio" + (form.interesse === "contratante" ? " on" : "")}>
                  <input type="radio" name="interesse" value="contratante" checked={form.interesse === "contratante"} onChange={() => update("interesse", "contratante")} />
                  Contratante
                </label>
              </div>

              <label className="cadastro-label" style={{ position: "relative" }}>
                Qual cidade você atua?
                <input type="text" required autoComplete="off" value={form.cidade}
                  onChange={(e) => handleCidadeChange(e.target.value)}
                  onFocus={() => cityList.length > 0 && setCityOpen(true)}
                  onBlur={() => setTimeout(() => setCityOpen(false), 150)}
                  placeholder="Ex: Guarulhos" />
                {cityOpen &&
                <div className="cadastro-suggest">
                  {cityList.map((c, i) =>
                  <button type="button" key={i} className="cadastro-suggest-item" onMouseDown={() => selectCidade(c)}>
                      {c.nome} <span>· {c.uf}</span>
                    </button>
                  )}
                </div>}
              </label>

              <div className="cadastro-label" style={{ marginBottom: 0 }}>Qual é sua especialidade?</div>
              <ChoiceGroup name="especialidade" options={ESPECIALIDADE_OPTIONS} selected={form.especialidade}
                onSelect={(v) => update("especialidade", v)}
                outroValue={form.especialidadeOutro} onOutroChange={(v) => update("especialidadeOutro", v)} />

              <div className="cadastro-label" style={{ marginBottom: 0 }}>Hoje, qual sua maior dificuldade pra conseguir serviço?</div>
              <ChoiceGroup name="dificuldade" options={DIFICULDADE_OPTIONS} selected={form.dificuldade}
                onSelect={(v) => update("dificuldade", v)}
                outroValue={form.dificuldadeOutro} onOutroChange={(v) => update("dificuldadeOutro", v)} />

              {error && <p className="cadastro-error">{error}</p>}

              <button type="submit" className="prelaunch-cta" disabled={sending}>
                {sending ? "Enviando..." : "Concluir cadastro"}
              </button>
              <p className="cadastro-note">Ao continuar, você concorda com os nossos <a href="termos.html" target="_blank" rel="noopener noreferrer">Termos de Uso</a>, com o tratamento dos seus dados conforme a LGPD (Lei 13.709/2018) e nossa <a href="privacidade.html" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. Seus dados ficam protegidos e são usados só pela Labuu.</p>
              <button type="button" className="cadastro-switch" onClick={() => onSwitchStep("login")}>
                Já tem cadastro? <b>Entrar</b>
              </button>
            </form>
          </>
        )}
      </div>
    </div>);

}

// ───────────────────── Login form ─────────────────────
function LoginForm({ onSuccess, onSwitchStep }) {
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, senha })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError("Telefone ou senha incorretos. Confere e tenta de novo.");
        setSending(false);
        return;
      }
      onSuccess();
    } catch (err) {
      setSending(false);
      setError("Não deu pra entrar agora. Tenta de novo em instantes.");
    }
  }

  return (
    <>
      <div className="prelaunch-badge">👋 BEM-VINDO DE VOLTA</div>
      <h3>Entrar no seu cadastro</h3>
      <p className="cadastro-lead">Já garantiu seu lugar? Confirma seu número de celular pra continuar.</p>
      <form className="cadastro-form" onSubmit={handleLogin}>
        <label className="cadastro-label">
          Número de celular
          <input type="tel" required autoComplete="tel" value={telefone}
            onChange={(e) => setTelefone(formatPhone(e.target.value))} placeholder="(11) 98765-4321" />
        </label>
        <label className="cadastro-label">
          Senha
          <input type="password" required autoComplete="current-password" value={senha}
            onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" />
        </label>

        {error && <p className="cadastro-error">{error}</p>}

        <button type="submit" className="prelaunch-cta" disabled={sending}>
          {sending ? "Entrando..." : "Entrar"}
        </button>
        <button type="button" className="cadastro-switch" onClick={() => onSwitchStep("form")}>
          Ainda não se cadastrou? <b>Criar cadastro</b>
        </button>
      </form>
    </>);

}

// ───────────────────── App ─────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [audience, setAudience] = useState("ajudante");
  const [modalStep, setModalStep] = useState("closed"); // closed | intro | form | login | success
  const [scrolled, setScrolled] = useState(false);
  const openCadastro = () => setModalStep("form");
  const closeModal = () => setModalStep("closed");

  useEffect(() => {
    document.documentElement.dataset.theme = t.dark ? "dark" : "light";
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-soft", hexToRgba(t.accent, t.dark ? .14 : .08));
    document.documentElement.style.setProperty("--accent-deep", darken(t.accent, 0.25));
  }, [t.dark, t.accent]);

  useEffect(() => {
    function onScroll() {setScrolled(window.scrollY > 600);}
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setModalStep((s) => s === "closed" ? "intro" : s), 1200);
    return () => clearTimeout(timer);
  }, []);

  const c = CONTENT[audience];
  const otherAudience = audience === "ajudante" ? "contratante" : "ajudante";

  return (
    <div data-screen-label="Labuu LP" data-audience={audience}>
      {modalStep === "intro" && <PrelaunchModal onClose={closeModal} onContinue={openCadastro} />}
      {(modalStep === "form" || modalStep === "login" || modalStep === "success") &&
        <CadastroModal step={modalStep} onClose={closeModal} onSuccess={() => setModalStep("success")} onSwitchStep={setModalStep} />}
      {/* Nav */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="logo">
            <img className="logo-wordmark" src="assets/labuu-wordmark-orange.png" alt="Labuu" />
          </div>
          <div className="nav-links">
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#faq">Dúvidas</a>
          </div>
          <button type="button" className="nav-cta" onClick={openCadastro}>
            Faça cadastro <span>→</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" data-screen-label="01 Hero">
        <div className="wrap hero-inner">
          <div className="hero-stack" key={audience}>
            <div className="hero-toprow">
              <AudienceToggle value={audience} onChange={setAudience} />
              <div className="hero-tag">
                <span className="dot"></span>
                <span>{c.tag}</span>
              </div>
            </div>
            <Headline data={c} which={t.headline} />
            <p className="sub">
              {c.sub[0]}<b>{c.sub[1]}</b>{c.sub[2]}<b>{c.sub[3]}</b>{c.sub[4]}<b>{c.sub[5]}</b>{c.sub[6]}
            </p>

            <div className="hero-cta">
              <PlayBadge orange big onOpen={openCadastro} />
              <div className="hero-micro">
                {c.micro[0] && <><b>{c.micro[0]}</b><br /></>}
                {c.micro[1]}
              </div>
            </div>

            <div style={{ marginTop: 32, marginBottom: -24, fontWeight: 700, fontSize: 19, color: "var(--ink)" }}>
              Na <span style={{ color: "var(--accent)" }}>Labuu</span> você tem ajudante:
            </div>
            <div className="proofstrip">
              {c.stats.map((s, i) =>
              <React.Fragment key={i}>
                  {i > 0 && <div className="divider"></div>}
                  <div className="stat" style={{ alignItems: "center", textAlign: "center" }}>
                    <div className="num" style={{ fontWeight: 400, fontSize: "clamp(18px, 1.6vw, 22px)", lineHeight: 1.25, letterSpacing: 0, whiteSpace: "pre-line" }}>{s.num}</div>
                    <div className="lbl">{s.lbl}</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          <PhoneMockup audience={audience} key={"phone-" + audience} />
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>servente</span><span>carregador</span><span>demolição</span>
          <span>limpeza pós-obra</span><span>diarista de obra</span>
          <span>servente</span><span>carregador</span><span>demolição</span>
          <span>limpeza pós-obra</span><span>diarista de obra</span>
        </div>
      </div>

      {/* Dor */}
      <section data-screen-label="02 Dor" key={"dor-" + audience}>
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-kicker">{c.painsKicker}</div>
            <h2 className="sec-title">{c.painsTitle}</h2>
            <p className="sec-lead">{c.painsLead}</p>
          </div>
          <div className="pains-intro">Chega <b>de</b></div>
          <div className="pains">
            {c.pains.map((p, i) =>
            <div key={i} className="pain">
                <div className="x">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
                  </svg>
                </div>
                <p>{p}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cross-promote the other side — placed between Pains and Solução */}
      <section className="cross-section" data-screen-label="Cross-promote">
        <div className="wrap">
          <div className="cross-promote">
            <div className="cross-inner">
              <div>
                <h3>{c.crossTitle}</h3>
                <p>{c.crossText}</p>
              </div>
              <button className="cross-btn" onClick={() => setAudience(otherAudience)}>
                {c.crossBtn}
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Solução */}
      <section id="como-funciona" className="sol-block" data-screen-label="03 Solução" key={"sol-" + audience}>
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-kicker">Como a Labuu resolve</div>
            <h2 className="sec-title">{c.solTitle}</h2>
            <p className="sec-lead">{c.solLead}</p>
          </div>
          <div className={`sol-steps sol-steps-${c.steps.length}`}>
            {c.steps.map((s, i) =>
            <div key={i} className="sol-step">
                <div className="n">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            )}
          </div>
          <div className="sol-quote">
            {c.quotePre}<em>{c.quoteEm}</em>{c.quotePost}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" data-screen-label="04 Benefícios" key={"ben-" + audience}>
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-kicker">O que muda na sua semana</div>
            <h2 className="sec-title">{c.benefitsTitle}</h2>
          </div>
          <div className="benefits">
            {c.benefits.map((b, i) =>
            <div key={i} className="benefit">
                <div className="check">✓</div>
                <div>
                  <h3>{b.t}</h3>
                  <p>{b.d}</p>
                </div>
              </div>
            )}
          </div>

          {/* end benefits */}
        </div>
      </section>

      {/* Garantia */}
      <div className="guarantee-wrap" data-screen-label="Garantia">
        <div className="wrap">
          <div className="guarantee">
            <div>
              <div className="gh-num">SUPORTE</div>
              <div className="gh-title">Problema na diária? A gente entra em ação.</div>
              <p>{c.guaranteeText}</p>
              <ul>
                {c.guaranteeItems.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div className="seal">
              <img src="assets/support-agent.jpeg" alt="Suporte Labuu" />
              <span className="seal-badge">Suporte humano</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" data-screen-label="07 FAQ">
        <div className="wrap">
          <div className="faq-wrap">
            <div className="sec-head" style={{ margin: 0 }}>
              <h2 className="sec-title">Perguntas frequentes:</h2>
              <p className="sec-lead">Não achou sua dúvida? Chama no WhatsApp da Labuu — o time do suporte está pronto para te ajudar.</p>
            </div>
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Footer (combined CTA + legal) */}
      <footer className="site-footer" data-screen-label="Footer">
        <div className="wrap footer-inner">
          <div className="footer-cta">
            <div className="footer-brand">
              <span className="footer-wordmark" role="img" aria-label="Labuu"></span>
              <p>O app que conecta ajudantes a quem precisa de reforço na obra. Dos dois lados do canteiro.</p>
            </div>
            <div className="footer-download">
              <div className="footer-eyebrow">Baixe agora · grátis</div>
              <PlayBadge orange big onOpen={openCadastro} />
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-left">
              <span>© 2026 Labuu</span>
              <span className="sep">·</span>
              <a href="privacidade.html">Privacidade</a>
              <span className="sep">·</span>
              <a href="termos.html">Termos de Uso</a>
              <span className="sep">·</span>
              <a href="https://wa.me/551129378525" target="_blank" rel="noopener noreferrer">Suporte</a>
            </div>
            <div className="footer-social">
              <a href="https://instagram.com/labuuapp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="https://facebook.com/labuuapp" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54v-2.2c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.85h2.78l-.44 2.91h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA (mobile) */}
      <button type="button" onClick={openCadastro}
      className={`sticky-cta ${scrolled ? "show" : ""}`}>
        <span>Faça cadastro</span>
        <span className="arrow">→</span>
      </button>

      {/* Tweaks */}
      <TweaksPanel title="Tweaks · Labuu">
        <TweakSection label="Audiência" />
        <TweakRadio label="Lado em foco" value={audience}
        options={["ajudante", "contratante"]}
        onChange={(v) => setAudience(v)} />

        <TweakSection label="Tema" />
        <TweakToggle label="Modo escuro" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakColor label="Cor de destaque" value={t.accent}
        options={["#E47310", "#FF5A1F", "#F4A300", "#1F8A5B", "#0D7DDB", "#0D0D0D"]}
        onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="Headline" />
        <TweakRadio label="Variação" value={t.headline}
        options={["A", "B", "C"]} onChange={(v) => setTweak("headline", v)} />
        <div style={{ fontSize: 10.5, color: "rgba(0,0,0,.55)", lineHeight: 1.4, marginTop: 4 }}>
          {t.headline === "A" && "A — Ângulo de oportunidade"}
          {t.headline === "B" && "B — Ângulo de reputação"}
          {t.headline === "C" && "C — Quebra de comportamento"}
        </div>
      </TweaksPanel>
    </div>);

}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = bigint >> 16 & 255,g = bigint >> 8 & 255,b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function darken(hex, amount) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = bigint >> 16 & 255,g = bigint >> 8 & 255,b = bigint & 255;
  r = Math.max(0, Math.round(r * (1 - amount)));
  g = Math.max(0, Math.round(g * (1 - amount)));
  b = Math.max(0, Math.round(b * (1 - amount)));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);