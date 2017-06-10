f= open("OECD.csv", 'r')

oecd= ["Australia",
  "Austria",
  "Belgium",
  "Canada",
  "Czech Republic",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Japan",
  "Korea, Republic of",
  "Luxembourg",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Poland",
  "Portugal",
  "Slovakia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "United Kingdom",
  "United States",
  "Brazil",
  "Chile",
  "Estonia",
  "Israel",
  "Russian Federation",
  "Slovenia"
]

while True:
    line= f.readline()
    if not line: break
    for c
