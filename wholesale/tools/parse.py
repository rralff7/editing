import json, re, sys, collections
W = sys.argv[1]
props = {}
for f in ["tx.json","fl.json","gtn_a.json","gtn_b.json"]:
    d = json.load(open(f"{W}/{f}"))
    print(f, d["resultCounts"])
    for r in d["results"]:
        x = r["result"]; a = x["formattedAddress"]
        url = x["homeDetailsPageUrl"].split("?")[0]
        zpid = re.search(r"/(\d+)_zpid", url).group(1)
        props[zpid] = dict(zpid=zpid, address=a["line1"], city=a["city"], state=a["stateOrProvince"], zip=a["postalCode"],
            price=x["price"]["filteredPrice"], beds=x.get("bedroomCount"), baths=x.get("bathroomCount"),
            sqft=x.get("livingAreaSquareFeet"), type=x["homeType"], url=url)
c = collections.Counter(p["state"] for p in props.values())
print(c)
json.dump(list(props.values()), open(f"{W}/props.json","w"), indent=0)
