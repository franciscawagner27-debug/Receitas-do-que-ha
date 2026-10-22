import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../src/lib/catalogueCache.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { createCatalogueCache, CATALOGUE_KEY, CATALOGUE_TTL } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
function disk() { const map = new Map(); return { map, getItem: k => map.get(k), setItem: (k,v) => map.set(k,v), removeItem: k => map.delete(k) }; }
test('simultaneous pages share one request and cannot mutate each other', async () => {
  let calls = 0; const cache = createCatalogueCache({ readPage: async () => { calls++; return [{id:'a', tags:['original']}]; } });
  const [a,b] = await Promise.all([cache.read(), cache.read()]); a[0].tags.push('changed');
  assert.equal(calls,1); assert.deepEqual(b[0].tags,['original']); assert.deepEqual((await cache.read())[0].tags,['original']);
});
test('reload uses stored catalogue; expiry fetches current recipes', async () => {
  const storage=disk(); let now=10, calls=0;
  const options={storage, now:()=>now, readPage:async()=>[{id:String(++calls)}]};
  await createCatalogueCache(options).read(); assert.equal((await createCatalogueCache(options).read())[0].id,'1');
  now+=CATALOGUE_TTL; assert.equal((await createCatalogueCache(options).read())[0].id,'2');
});
test('complete catalogue survives API pagination', async () => {
  const all=Array.from({length:7},(_,i)=>({id:String(i)})); const ranges=[];
  const cache=createCatalogueCache({pageSize:3,readPage:async(from,to)=>{ranges.push([from,to]);return all.slice(from,to+1);}});
  assert.deepEqual(await cache.read(),all); assert.deepEqual(ranges,[[0,2],[3,5],[6,8]]);
});
test('corrupt or unavailable disk does not hide recipes',async()=>{
  for(const storage of [{getItem:()=>'{broken',setItem:()=>{},removeItem:()=>{}},{getItem:()=>{throw Error('denied');},setItem:()=>{throw Error('quota');},removeItem:()=>{throw Error('denied');}}]) {
    const cache=createCatalogueCache({storage,readPage:async()=>[{id:'ok'}]});
    assert.equal((await cache.read())[0].id,'ok'); cache.invalidate(); assert.equal((await cache.read())[0].id,'ok');
  }
});
test('failed requests are retried rather than cached as an empty catalogue',async()=>{
  let calls=0; const cache=createCatalogueCache({readPage:async()=>{if(++calls===1)throw Error('offline');return [{id:'ok'}];}});
  await assert.rejects(cache.read(),/offline/); assert.equal((await cache.read())[0].id,'ok');
});
test('Admin invalidation preserves favourites and Auth and prevents stale resurrection',async()=>{
  const storage=disk();storage.setItem('sb-auth-token','session');storage.setItem('favorites','a');
  let resolve;let calls=0;
  const cache=createCatalogueCache({storage,readPage:()=>++calls===1?new Promise(r=>resolve=r):Promise.resolve([{id:'new'}])});
  const old=cache.read();cache.invalidate();assert.equal((await cache.read())[0].id,'new');resolve([{id:'old'}]);await old;
  assert.equal((await cache.read())[0].id,'new');assert.equal(storage.getItem('sb-auth-token'),'session');assert.equal(storage.getItem('favorites'),'a');
});
test('another tab can replace the catalogue without losing its disk entry',async()=>{
  const storage=disk();const cache=createCatalogueCache({storage,now:()=>20,readPage:async()=>[{id:'old'}]});await cache.read();
  storage.setItem(CATALOGUE_KEY,JSON.stringify({version:1,savedAt:20,rows:[{id:'new'}]}));cache.externalChange();
  assert.equal((await cache.read())[0].id,'new');assert.ok(storage.getItem(CATALOGUE_KEY));
});
