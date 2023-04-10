# ffvb-ranking-calendar
non officiel

Les informations nécessaires peuvent être trouvées dans l'URL du calendrier du site ffvb officiel :

```
https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=20XX/20XX&codent=XXXX&poule=XXX
```

2 routes sont disponibles (avec **_api/..._** sur netlify) : 
- **_calendar/raw_**  pour obtenir les valeur brute en json
- **_calendar/ics_**  pour obtenir un fichier .ics (pouvant être importer dans les calendrier)
