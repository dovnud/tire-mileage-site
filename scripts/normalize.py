"""Normalize raw NHTSA UTQG records -> records.csv/json, lines.json, sizes.json, summary.json.
No values are invented: every number below is NHTSA-reported or computed from NHTSA-reported values."""
import json, re, csv, statistics as st, collections as C, datetime
raw=json.load(open('data/raw/nhtsa_ratings_raw.json'))
R=raw['results']
def squeeze(s): return re.sub(r'\s+',' ',(s or '').strip())
def key(s): return re.sub(r'[^a-z0-9]+','',squeeze(s).lower())
def slug(s): return re.sub(r'[^a-z0-9]+','-',squeeze(s).lower()).strip('-')
def best_name(variants):
    c=C.Counter(variants)
    mixed=[v for v in c if v!=v.upper() and v!=v.lower()]
    pool=mixed or list(c)
    v=max(pool,key=lambda v:(c[v],v))
    if not mixed and v==v.upper() and len(v)>3 and ' ' not in v and v.isalpha(): v=v.title()
    return v
brandvars=C.defaultdict(list); linevars=C.defaultdict(list)
for x in R:
    bk=key(x['brand']); brandvars[bk].append(squeeze(x['brand']))
    linevars[(bk,key(x['tireline']))].append(squeeze(x['tireline']))
brandname={k:best_name(v) for k,v in brandvars.items()}
brandslug={}; used=set()
for k,n in sorted(brandname.items()):
    s=slug(n) or k; b=s; i=2
    while s in used: s=f"{b}-{i}"; i+=1
    used.add(s); brandslug[k]=s
linename={k:best_name(v) for k,v in linevars.items()}
lineslug={}; used=C.defaultdict(set)
for (bk,lk),n in sorted(linename.items()):
    s=slug(n) or lk or 'line'; b=s; i=2
    while s in used[bk]: s=f"{b}-{i}"; i+=1
    used[bk].add(s); lineslug[(bk,lk)]=s
SIZE=re.compile(r'^\s*(P|LT|ST|T)?\s*-?\s*(\d{3})\s*/\s*(\d{2})\s*([A-Z]{0,2})\s*[R\-]?\s*(\d{2})(?!\d)(.*)$',re.I)
def parse_size(s):
    m=SIZE.match(s or '')
    if not m: return None
    pre,w,a,_,rim,rest=m.groups()
    return {'type':(pre or '').upper(),'width':int(w),'aspect':int(a),'rim':int(rim),'key':f"{w}-{a}r{rim}",'label':f"{w}/{a}R{rim}",'suffix':squeeze(rest)}
recs=[]
for x in R:
    bk=key(x['brand']); lk=key(x['tireline']); sz=parse_size(x['size'])
    flags=[]
    wear=int(x['wear']) if x['wear'] and x['wear'].isdigit() else None
    if wear is None: flags.append('treadwear missing'); 
    elif wear<=0: flags.append('treadwear 0 treated as invalid'); wear=None
    trac=x['trac'] if x['trac'] in ('AA','A','B','C') else None
    if x['trac'] and trac is None: flags.append(f"traction '{x['trac']}' not a valid UTQG grade")
    temp=x['temp'] if x['temp'] in ('A','B','C') else None
    if x['temp'] and temp is None: flags.append(f"temperature '{x['temp']}' not a valid UTQG grade")
    recs.append({'id':x['id'],'brand':brandname[bk],'brand_slug':brandslug[bk],'line':linename[(bk,lk)],'line_slug':lineslug[(bk,lk)],
      'size_raw':squeeze(x['size']),'size_key':sz['key'] if sz else '', 'size_label':sz['label'] if sz else '','size_type':sz['type'] if sz else '',
      'size_suffix':sz['suffix'] if sz else '','treadwear':wear,'traction':trac,'temperature':temp,'brand_raw':x['brand'],'quality_flags':'; '.join(flags)})
# lines
lines=C.OrderedDict()
for r in recs: lines.setdefault((r['brand_slug'],r['line_slug']),[]).append(r)
allmed=[]
L=[]
for (bs,ls),rs in lines.items():
    ws=[r['treadwear'] for r in rs if r['treadwear'] is not None]
    explicit=[r for r in rs if r['size_key']]
    L.append({'brand':rs[0]['brand'],'brand_slug':bs,'line':rs[0]['line'],'line_slug':ls,'records':len(rs),
      'records_with_explicit_size':len(explicit),'explicit_sizes':len({r['size_key'] for r in explicit}),
      'wear_min':min(ws) if ws else None,'wear_max':max(ws) if ws else None,'wear_median':st.median(ws) if ws else None,
      'traction':dict(C.Counter(r['traction'] for r in rs if r['traction'])),'temperature':dict(C.Counter(r['temperature'] for r in rs if r['temperature'])),
      'brand_variants':sorted({r['brand_raw'] for r in rs})})
meds=sorted(l['wear_median'] for l in L if l['wear_median'] is not None)
import bisect
for l in L:
    m=l['wear_median']
    l['wear_percentile']=round(100*bisect.bisect_left(meds,m)/len(meds),1) if m is not None else None  # % of lines with strictly lower median
# brand rank by median wear within brand
byb=C.defaultdict(list)
for l in L:
    if l['wear_median'] is not None: byb[l['brand_slug']].append(l)
for bs,ls_ in byb.items():
    ls_.sort(key=lambda l:(-l['wear_median'],l['line']))
    for i,l in enumerate(ls_,1): l['brand_rank']=i; l['brand_lines_rated']=len(ls_)
# sizes
sizes=C.defaultdict(lambda:{'rows':{}})
for r in recs:
    if not r['size_key']: continue
    s=sizes[r['size_key']]; s['label']=r['size_label']; s['key']=r['size_key']
    k=(r['brand_slug'],r['line_slug']); row=s['rows'].setdefault(k,{'brand':r['brand'],'brand_slug':r['brand_slug'],'line':r['line'],'line_slug':r['line_slug'],'wears':[],'tracs':[],'temps':[],'types':set()})
    if r['treadwear'] is not None: row['wears'].append(r['treadwear'])
    if r['traction']: row['tracs'].append(r['traction'])
    if r['temperature']: row['temps'].append(r['temperature'])
    if r['size_type']: row['types'].add(r['size_type'])
S=[]
for k,s in sizes.items():
    rows=[]
    for row in s['rows'].values():
        rows.append({'brand':row['brand'],'brand_slug':row['brand_slug'],'line':row['line'],'line_slug':row['line_slug'],
          'wear_min':min(row['wears']) if row['wears'] else None,'wear_max':max(row['wears']) if row['wears'] else None,
          'traction':C.Counter(row['tracs']).most_common(1)[0][0] if row['tracs'] else None,
          'temperature':C.Counter(row['temps']).most_common(1)[0][0] if row['temps'] else None,
          'size_types':sorted(row['types'])})
    S.append({'key':k,'label':s['label'],'lines':len(rows),'rows':rows})
S.sort(key=lambda s:(-s['lines'],s['key']))
summary={'source':raw['source'],'pulled_at':raw['pulled_at'],'raw_records':len(R),'reported_total':raw['reported_total'],
 'raw_brand_strings':len({x['brand'] for x in R}),'normalized_brands':len(brandname),'raw_product_names':len({x['productName'] for x in R}),'normalized_lines':len(L),
 'records_with_explicit_size':sum(1 for r in recs if r['size_key']),'records_all_sizes_or_range':sum(1 for r in recs if not r['size_key']),
 'distinct_explicit_sizes':len(S),'sizes_with_ge10_lines':sum(1 for s in S if s['lines']>=10),'sizes_with_ge5_lines':sum(1 for s in S if s['lines']>=5),
 'lines_with_any_explicit_size':sum(1 for l in L if l['records_with_explicit_size']),
 'records_missing_or_invalid_treadwear':sum(1 for r in recs if r['treadwear'] is None),
 'records_with_quality_flags':sum(1 for r in recs if r['quality_flags']),
 'active_true_count':sum(1 for x in R if x['active']),'complaints_recalls_nonzero':sum(1 for x in R if x['complaintsCount'] or x['recallsCount'] or x['investigationsCount'] or x['manufacturerCommunicationsCount']),
 'treadwear_overall_median':st.median(meds),'generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
json.dump(recs,open('data/normalized/records.json','w'))
with open('data/normalized/records.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(recs[0])); w.writeheader(); w.writerows(recs)
json.dump(L,open('data/normalized/lines.json','w')); json.dump(S,open('data/normalized/sizes.json','w')); json.dump(summary,open('data/normalized/summary.json','w'),indent=1)
print(json.dumps(summary,indent=1))
