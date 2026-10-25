"""Pull the full NHTSA UTQG ratings dataset. API caps max=100/page; sort keys are non-unique,
so we union several sort orders and dedupe by id until we reach the reported total."""
import json, time, urllib.request, datetime, sys
B="https://api.nhtsa.gov/tires?dataSet=ratings&max=100&sort=%s&order=%s&offset="
def get(u):
    for a in range(6):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"tire-site-prototype"}),timeout=90))
        except Exception as e: print("retry",u[-60:],e,file=sys.stderr); time.sleep(4)
    raise SystemExit("failed "+u)
byid={}; total=None; log=[]
for sort,order in [("productName","asc"),("productName","desc"),("size","asc"),("wear","desc"),("size","desc"),("wear","asc")]:
    off=0; n=0
    while True:
        d=get(B%(sort,order)+str(off)); p=d["meta"]["pagination"]; total=p["total"]; r=d["results"]
        if not r: break
        for x in r: byid[x["id"]]=x
        n+=len(r); off+=len(r)
        if off>=total: break
        time.sleep(0.15)
    log.append({"sort":sort,"order":order,"rows_read":n,"unique_ids_so_far":len(byid)}); print(log[-1],flush=True)
    if len(byid)>=total: break
json.dump({"source":"https://api.nhtsa.gov/tires?dataSet=ratings","pulled_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),"reported_total":total,"unique_ids":len(byid),"pull_log":log,"results":sorted(byid.values(),key=lambda x:x["id"])},open("data/raw/nhtsa_ratings_raw.json","w"))
print("reported",total,"unique",len(byid))
