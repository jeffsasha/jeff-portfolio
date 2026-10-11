"use client";
import { useEffect, useState } from 'react';
import { Moon, Sun, ShieldCheck, Calculator } from 'lucide-react';
import DotField from './DotField';

function Github({size=17}:{size?:number}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.72-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>}
function Linkedin({size=17}:{size?:number}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.53 2.8-1.53 2.99 0 3.57 1.97 3.57 4.53Z"/></svg>}
const symbols = [['NASDAQ:AAPL','AAPL'],['NASDAQ:MSFT','MSFT'],['NASDAQ:GOOGL','GOOGL'],['NASDAQ:AMZN','AMZN'],['NASDAQ:NVDA','NVDA'],['NASDAQ:META','META'],['NASDAQ:TSLA','TSLA'],['COINBASE:BTCUSD','BTC'],['COINBASE:ETHUSD','ETH'],['COINBASE:SOLUSD','SOL']];

type Quote = {symbol:string;price:number;change:number};
function MarketTape() {
  const [quotes,setQuotes]=useState<Quote[]>([]);
  const [unavailable,setUnavailable]=useState(false);
  useEffect(()=>{
    let active=true;
    const controller=new AbortController();
    async function refresh(){
      try {
        const response=await fetch('/api/markets',{signal:controller.signal});
        if(!response.ok)throw new Error('Feed unavailable');
        const data=await response.json() as {quotes:Quote[];stale?:boolean};
        if(active){setQuotes(data.quotes);setUnavailable(Boolean(data.stale));}
      } catch {if(active)setUnavailable(true);}
    }
    refresh();const interval=window.setInterval(refresh,60000);
    return()=>{active=false;controller.abort();clearInterval(interval);};
  },[]);
  const bySymbol=new Map(quotes.map(q=>[q.symbol,q]));
  return <section className="market" aria-label="Market ticker">
    <div className="market-wrap" tabIndex={0} aria-label="Live prices; hover or focus to pause scrolling">
      <div className="ticker-track">{[0,1].map(copy=><div className="ticker-group" key={copy} aria-hidden={copy===1?true:undefined}>
        {symbols.map(([provider,symbol])=>{const q=bySymbol.get(symbol);return <a key={symbol} className={`ticker-item ${q?(q.change>0?'is-up':q.change<0?'is-down':'is-flat'):'is-loading'}`} href={`https://www.tradingview.com/symbols/${provider.replace(':','-')}/`} target="_blank" rel="noreferrer" tabIndex={copy===1?-1:0}>
          <span className="ticker-symbol">{symbol}</span><span className="ticker-price">{q?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(q.price):'—'}</span><span className="ticker-change">{q?`${q.change>0?'+':''}${q.change.toFixed(2)}%`:unavailable?'Unavailable':'···'}</span>
        </a>})}
      </div>)}</div>
    </div>
    <div className="market-caption"><span>US: session change · Crypto: 24h <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">TradingView</a></span>{unavailable&&<span className="feed-status" role="status">{quotes.length?'Last available quotes':'Market feed unavailable'}</span>}</div>
  </section>;
}

function Signature(){return <svg className="signature" viewBox="0 0 150 65" role="img" aria-label="Jeff handwritten signature"><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path className="signature-stroke" pathLength="1" d="M18 24 C36 20 68 10 70 12 C62 25 54 45 46 52 C32 65 22 47 33 43 C39 41 44 44 45 48 M39 18 C55 18 76 13 90 14"/><path className="signature-stroke second" pathLength="1" d="M58 39 C78 34 75 28 69 32 C59 38 61 48 75 40 C83 33 93 19 95 11 C99 -1 84 17 81 29 C77 43 77 52 78 54 M74 32 L103 26 M83 39 C100 30 112 14 113 7 C111 -1 98 18 96 31 C94 42 96 50 96 53 M90 29 L120 24"/><path className="signature-stroke underline" pathLength="1" d="M33 57 C62 52 104 49 134 47"/></g></svg>}

export default function Home(){
 const[theme,setTheme]=useState('dark');
 useEffect(()=>{const saved=localStorage.getItem('jeff-theme');if(saved==='light'||saved==='dark')setTheme(saved);},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('jeff-theme',theme);},[theme]);
 function toggleTheme(){const next=theme==='dark'?'light':'dark';const doc=document as Document&{startViewTransition?:(callback:()=>void)=>unknown};if(doc.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)doc.startViewTransition(()=>setTheme(next));else setTheme(next);}
 return <><div className="background" aria-hidden="true"><DotField dotRadius={2.6} dotSpacing={20} cursorRadius={330} bulgeStrength={75} waveAmplitude={4} gradientFrom={theme==='dark'?'rgba(160,175,169,0.32)':'rgba(65,91,77,0.27)'} gradientTo={theme==='dark'?'rgba(160,175,169,0.19)':'rgba(65,91,77,0.15)'}/></div>
 <MarketTape/>
 <header className="header"><a href="#about" className="signature-link" aria-label="Jeff Lu home"><Signature/></a><nav aria-label="Main navigation"><a href="#experience">Experience</a><a href="#connect">Connect</a><button className="theme-toggle" onClick={toggleTheme} aria-label={theme==='dark'?'Switch to light theme':'Switch to dark theme'}>{theme==='dark'?<Sun size={19}/>:<Moon size={19}/>}</button></nav></header>
 <main id="about" className="content"><section className="intro enter"><p className="eyebrow">REAL ESTATE · FINANCE · TECHNOLOGY</p><h1 className="interactive-name" aria-label="Jeff Lu"><span aria-hidden="true">{Array.from("Jeff Lu").map((letter,index)=><span className="name-letter" key={index}>{letter === " " ? "\u00a0" : letter}</span>)}</span><span className="name-dot" aria-hidden="true">.</span></h1><p className="lead">I work at the intersection of <strong>commercial real estate</strong>, financial research, and applied AI.</p><p>Based in Houston, I analyze properties, markets, and investment opportunities—turning complex information into clear, actionable insights.</p><p>My work spans underwriting, valuation, financial data modeling, due diligence, and lease & acquisition analysis.</p><p>I also build <strong>AI research and automation workflows</strong> for investment research, document analysis, and quantitative investing.</p><div className="socials"><a href="https://github.com/jeffsasha" target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a><a href="https://www.linkedin.com/in/junfeng-jeff-lu/" target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a></div></section>
 <section id="experience" className="experience enter later"><h2>Experience<span className="section-line"/></h2><ul className="roles"><li><span className="brand skw"><img src={theme === "dark" ? "/logos/skw-light.png" : "/logos/skw-dark.png"} alt="SKW Realty" width="32" height="15"/></span><div><h3>SKW CRE GROUP</h3><p>Commercial real estate · Financial & market analysis</p></div><time>May 2025 — Present</time></li><li><span className="brand tulane"><img src={theme === "dark" ? "/logos/tulane-dark.svg" : "/logos/tulane-light.svg"} alt="Tulane University" width="20" height="28"/></span><div><h3>Private Company</h3><p>Research Assistant</p></div></li><li><span className="brand role-mark"><ShieldCheck size={23} aria-hidden="true"/></span><div><h3>Insurance Analyst</h3><p>Insurance & financial analysis</p></div></li><li><span className="brand role-mark"><Calculator size={23} aria-hidden="true"/></span><div><h3>Tax Consultant</h3><p>Tax preparation & client support</p></div></li><li><span className="brand fifa"><img src="/logos/fifa.png" alt="FIFA" width="31" height="12"/></span><div><h3>FIFA Volunteer</h3><p>Event & team support</p></div></li></ul></section>
 <section className="education enter later"><h2>Education<span className="section-line"/></h2><div className="education-row"><span className="brand tulane"><img src={theme === "dark" ? "/logos/tulane-dark.svg" : "/logos/tulane-light.svg"} alt="Tulane University" width="20" height="28"/></span><div><h3>Master of Finance</h3><p>Tulane University · A. B. Freeman School of Business</p></div></div></section>
 <footer id="connect"><div className="location"><span className="green-dot"/> HOUSTON, TX</div><div className="footer-links"><a href="https://github.com/jeffsasha" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/junfeng-jeff-lu/" target="_blank" rel="noreferrer">LinkedIn</a></div><span className="copyright"><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a> 2026 © Jeff Lu</span></footer></main></>;
}
