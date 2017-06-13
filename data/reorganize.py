#f= file('Australia.csv', 'r')
ftotal= file('reOECD.csv', 'a+')

inds= ["HO_BASE", "HO_HISH", "HO_NUMR", "IW_HADI", "IW_HNFW", "JE_EMPL", "JE_LTUR", "JE_PEARN", "SC_SNTWS", "ES_EDUA", "ES_STCS", "ES_EDUEX", "EQ_AIRP", "EQ_WATER", "CG_VOTO", "HS_LEB", "HS_SFRH", "SW_LIFS", "PS_REPH", "WL_EWLH", "WL_TNOW", "JE_LMIS", "CG_SENG", "PS_FSAFEN"]

oecd= [
  "Netherlands",
  "New Zealand",
  "Norway" 
]

for i in range(len(oecd)):
    cname= oecd[i]
    f= file(cname+".csv", 'r')
    country= dict()
    
    #waste one line(header)
    line= f.readline()

    while True:
        line= f.readline()
        if not line: break
        parsed= line.split(",")
        indicator= parsed[2]
        indicator= indicator.replace("\"", "")
        print indicator
        value= parsed[14]
        index= inds.index(indicator)
        country[index]=value

    keylist= country.keys()
    keylist.sort()

    #ftotal.write(cname+",")

    i=0
    for key in keylist:
        ftotal.write(country[key])
        if(i!= (len(keylist)-1) ):
            ftotal.write(",")
        i=i+1

    ftotal.write("\n")
