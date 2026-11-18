import json,sys,glob,statistics as st,collections
W=sys.argv[1]
sold=collections.defaultdict(list)
for f in glob.glob(f"{W}/sold_*.json"):
    d=json.load(open(f))
    for r in d["results"]:
        x=r["result"]; s=x.get("livingAreaSquareFeet"); p=x.get("price",{}).get("filteredPrice")
        if s and p and s>=600: sold[x["formattedAddress"]["postalCode"]].append(p/s)
extra={"33898":[(285000,1148),(305000,1508),(326245,2107),(287000,1209),(290000,1618),(319000,1669),(316000,2054),(390000,2298),(120000,888)],"33854":[(150000,888)],"33855":[(450000,1778)]}
for z,l in extra.items(): sold[z]+= [p/s for p,s in l]
S=json.load(open(f"{W}/sel.json"))
cov=0
for p in S:
    c=sold.get(p["zip"],[])
    p["ncomps"]=len(c)
    p["comp_ppsf"]=round(st.median(c),1) if len(c)>=3 else None
    if p["metro"] and p["comp_ppsf"]: cov+=1
print("zips with comps:",sum(1 for z,c in sold.items() if len(c)>=3),"metro props covered:",cov,"of",sum(p['metro'] for p in S))
json.dump(S,open(f"{W}/sel.json","w"))
