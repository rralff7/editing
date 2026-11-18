import json,sys
W=sys.argv[1]
M={"TX":"Houston,San Antonio,Humble,Conroe,Baytown,Katy,Pasadena,Crosby,Dallas,Carrollton,El Paso,Corpus Christi,Lubbock,Midland,Odessa,Waco,Temple,College Station,McAllen,Pharr,Edinburg,Beaumont,Port Arthur,Wichita Falls,San Angelo,Seguin,Alvin,Angleton,Cleburne,Denison,Greenville",
"FL":"Ocala,Kissimmee,Jacksonville,Fort Myers,Sarasota,Fort Pierce,Lake Wales,Riverview,Tamarac,Fort Lauderdale,Lantana,Winter Garden,Largo,Palm Coast,Bradenton,Tallahassee,Rockledge,Port Charlotte,Titusville,Palm Bay,Lutz,Zephyrhills,Holiday,Brooksville,Leesburg,Tavares,Mount Dora,Crestview,Pace,Safety Harbor,Ellenton,Sebring,Venice,Naples",
"GA":"Augusta,Martinez,Macon,Warner Robins,Savannah,Jonesboro,Powder Springs,Peachtree Corners,Decatur,Stockbridge,Lithia Springs,Locust Grove,Gainesville,Valdosta,Cumming,Brunswick,Gray,Bloomingdale,Guyton",
"TN":"Clarksville,Memphis,Millington,La Vergne,Antioch,Nashville,Kingsport,Sevierville,Alcoa,Cleveland,Gray",
"NC":"Hope Mills,Fayetteville,Greenville,Gastonia,Charlotte,Raleigh,Wake Forest,Rocky Mount,Wilson,Goldsboro,Salisbury,Havelock,New Bern,Sanford,Angier,Lillington,Creedmoor,Denver,Asheville,Browns Summit,Roanoke Rapids,Granite Falls,Valdese"}
M={k:set(v.split(",")) for k,v in M.items()}
S=json.load(open(f"{W}/sel.json"))
for p in S: p["metro"]= p["city"] in M[p["state"]]
json.dump(S,open(f"{W}/sel.json","w"))
mz=sorted({p["zip"] for p in S if p["metro"]})
print("metro props",sum(p["metro"] for p in S),"zips",len(mz))
for i in range(0,len(mz),20):
    print(json.dumps([{"name":x,"regionDisplayName":x} for x in mz[i:i+20]],separators=(",",":")))
