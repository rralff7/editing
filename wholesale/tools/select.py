import json, sys, collections
W=sys.argv[1]
P=json.load(open(f"{W}/props.json"))
ok=[p for p in P if (p["beds"] or 0)>=2 and (p["baths"] or 0)>=1 and (p["sqft"] or 0)>=700 and p["price"]<=325000]
for p in ok: p["ppsf"]=round(p["price"]/p["sqft"],1)
sel=[]
for st in ["TX","FL","GA","TN","NC"]:
    s=sorted([p for p in ok if p["state"]==st], key=lambda p:p["ppsf"])[:50]
    print(st, len([p for p in ok if p["state"]==st]), "eligible ->", len(s))
    sel+=s
zips=sorted({p["zip"] for p in sel})
print("selected",len(sel),"unique zips",len(zips))
json.dump(sel,open(f"{W}/sel.json","w"))
json.dump(zips,open(f"{W}/zips.json","w"))
