import json,sys,csv,collections
W,OUT=sys.argv[1],sys.argv[2]
S=json.load(open(f"{W}/sel.json"))
r500=lambda v:int(round(v/500.0)*500)
rows=[]
for p in S:
    if p["comp_ppsf"]:
        arv=p["comp_ppsf"]*p["sqft"]; src=f"ZIP sold median ${p['comp_ppsf']}/sqft ({p['ncomps']} sales, last 6 mo)"
    else:
        arv=0.95*p["price"]; src="95% of list price - no public sold comps (TX is non-disclosure) - verify"
    arv=r500(arv); rep=r500(max(8000,15*p["sqft"])); mx=0.70*arv-rep
    walk=r500(min(mx-3500,p["price"])); opn=r500(min(mx-10000,0.85*p["price"]))
    pct=round(100*walk/p["price"])
    flag=""
    if mx-3500>1.2*p["price"]: flag="Priced far below ZIP sales: check for mobile home / land lease / 55+ / heavy damage before calling"
    grade="X" if opn<=0 else "A" if pct>=80 else "B" if pct>=65 else "C"
    rows.append({"Grade":grade,"State":p["state"],"City":p["city"],"Address":p["address"],"ZIP":p["zip"],"Metro area":"Yes" if p["metro"] else "No",
      "List price":p["price"],"Beds":p["beds"],"Baths":p["baths"],"Sqft":p["sqft"],"Type":p["type"],"List $/sqft":p["ppsf"],
      "Est. ARV":arv,"ARV basis":src,"Est. light repairs ($15/sqft)":rep,"Investor max (70% rule)":r500(mx),
      "Opening offer":max(opn,0),"Walk-away max (keeps >= $3,500 fee)":max(walk,0),"Walk-away as % of list":pct,
      "Check first":flag,"Zillow listing":p["url"],"Status":"","Notes":""})
order={"A":0,"B":1,"C":2,"X":3}
rows.sort(key=lambda r:(order[r["Grade"]],r["State"],r["Metro area"]!="Yes",-r["Walk-away as % of list"]))
with open(OUT,"w",newline="") as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print(collections.Counter((r["State"],r["Grade"]) for r in rows))
for r in rows:
    if r["Grade"] in "AB": print(r["Grade"],r["State"],r["City"],r["Address"],r["List price"],"open",r["Opening offer"],"walk",r["Walk-away max (keeps >= $3,500 fee)"],"flag" if r["Check first"] else "")
