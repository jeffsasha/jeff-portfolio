export const runtime = 'nodejs';
export const maxDuration = 20;

const stockSymbols = ['AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA'];
const cryptoSymbols = ['BTC','ETH','SOL'];
type Quote = {symbol:string;price:number;change:number};
let cached: {quotes:Quote[];updatedAt:number;stale:boolean} | undefined;
let pending: Promise<{quotes:Quote[];updatedAt:number;stale:boolean}> | undefined;

async function readMarket(region:string, symbols:string[], prefix:string, suffix='') {
  const response = await fetch(`https://scanner.tradingview.com/${region}/scan`, {
    method:'POST', cache:'no-store', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({symbols:{tickers:symbols.map(s=>`${prefix}:${s}${suffix}`)},columns:['close','change']}),
    signal:AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`Market provider ${response.status}`);
  const body = await response.json() as {data:{s:string;d:[number,number]}[]};
  return body.data.flatMap(row => {
    const symbol = row.s.split(':')[1].replace(/USD$/,'');
    return Number.isFinite(row.d[0]) && Number.isFinite(row.d[1]) ? [{symbol,price:row.d[0],change:row.d[1]}] : [];
  });
}
async function readCrypto() {
  const results = await Promise.allSettled(cryptoSymbols.map(async symbol=>{
    const response = await fetch(`https://api.exchange.coinbase.com/products/${symbol}-USD/stats`,{cache:'no-store',signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error(`Crypto provider ${response.status}`);
    const stats=await response.json() as {open:string;last:string};
    const price=Number(stats.last),open=Number(stats.open);
    if (!Number.isFinite(price)||!Number.isFinite(open)||open<=0) throw new Error('Invalid crypto quote');
    return {symbol,price,change:(price/open-1)*100};
  }));
  return results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);
}
async function refresh() {
  const result = await Promise.allSettled([
    readMarket('america',stockSymbols,'NASDAQ'),
    readCrypto()
  ]);
  const quotes = result.flatMap(r=>r.status==='fulfilled'?r.value:[]);
  if (!quotes.length) throw new Error('Market data unavailable');
  // Preserve the last known value if one provider is temporarily unavailable.
  const merged = new Map(cached?.quotes.map(q=>[q.symbol,q]));
  quotes.forEach(q=>merged.set(q.symbol,q));
  return cached = {quotes:[...merged.values()],updatedAt:Date.now(),stale:quotes.length!==stockSymbols.length+cryptoSymbols.length};
}
export async function GET() {
  try {
    if (!cached || Date.now()-cached.updatedAt>60000) {
      pending ??= refresh().finally(()=>{pending=undefined});
      await pending;
    }
    return Response.json(cached,{headers:{'Cache-Control':'public, max-age=0, s-maxage=60, stale-while-revalidate=300'}});
  } catch {
    if (cached) return Response.json({...cached,stale:true},{headers:{'Cache-Control':'no-store'}});
    return Response.json({quotes:[],error:'Market data unavailable'},{status:503});
  }
}
