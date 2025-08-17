# FM Client App - Complete Data Structure Documentation

## Core Data Overview

The FM Client App uses a single, comprehensive data file (`roles.json`) containing **85 tactical roles** with **40 attributes** each, totaling **3,400 data points** that define how to evaluate players for each tactical position in Football Manager.

## Attribute List (40 Total)

### Technical Attributes
- **Cor** - Corners
- **Cro** - Crossing  
- **Dri** - Dribbling
- **Fin** - Finishing
- **Fir** - First Touch
- **Fla** - Flair
- **Hea** - Heading
- **Lon** - Long Shots
- **Mar** - Marking
- **Pas** - Passing
- **Tck** - Tackling
- **Tec** - Technique

### Mental Attributes
- **Agg** - Aggression
- **Ant** - Anticipation
- **Bra** - Bravery
- **Cmp** - Composure
- **Cnt** - Concentration
- **Dec** - Decisions
- **Det** - Determination
- **Fla** - Flair
- **Ldr** - Leadership
- **OtB** - Off the Ball
- **Pos** - Positioning
- **Tea** - Teamwork
- **Vis** - Vision
- **Wor** - Work Rate

### Physical Attributes
- **Acc** - Acceleration
- **Agi** - Agility
- **Bal** - Balance
- **Jum** - Jumping Reach
- **Pac** - Pace
- **Sta** - Stamina
- **Str** - Strength

### Goalkeeper Attributes
- **1v1** - One on Ones
- **Aer** - Aerial Reach
- **Cmd** - Command of Area
- **Han** - Handling
- **Kic** - Kicking
- **Ref** - Reflexes
- **TRO** - Tendency to Rush Out
- **Thr** - Throwing

## Role Categories and Codes

### Forwards (24 roles)
| Role | Code | Duties |
|------|------|--------|
| Advanced Forward | af | Attack |
| Complete Forward | cf | Attack, Support |
| Deep Lying Forward | dlf | Attack, Support |
| False Nine | f9 | Support |
| Poacher | p | Attack |
| Pressing Forward | pf | Attack, Support, Defend |
| Target Forward | tf | Attack, Support |
| Trequartista | tre | Attack |
| Wide Target Forward | wtf | Attack, Support |

### Attacking Midfielders/Wingers (21 roles)
| Role | Code | Duties |
|------|------|--------|
| Advanced Playmaker | ap | Attack, Support |
| Attacking Midfielder | am | Attack, Support |
| Defensive Winger | dw | Support, Defend |
| Enganche | eng | Support |
| Inside Forward | if | Attack, Support |
| Inverted Winger | iw | Attack, Support |
| Raumdeuter | rau | Attack |
| Shadow Striker | ss | Attack |
| Wide Midfielder | wm | Attack, Support, Defend |
| Wide Playmaker | wp | Attack, Support |
| Winger | w | Attack, Support |

### Central Midfielders (16 roles)
| Role | Code | Duties |
|------|------|--------|
| Ball Winning Midfielder | bwm | Support, Defend |
| Box To Box Midfielder | b2b | Support |
| Carrilero | car | Support |
| Central Midfielder | cm | Attack, Support, Defend |
| Deep Lying Playmaker | dlp | Support, Defend |
| Defensive Midfielder | dm | Support, Defend |
| Half Back | hb | Defend |
| Mezzala | mez | Attack, Support |
| Regista | reg | Support |
| Roaming Playmaker | rp | Support |
| Segundo Volante | sv | Attack, Support |

### Defenders (21 roles)
| Role | Code | Duties |
|------|------|--------|
| Anchor | a | Defend |
| Ball Playing Defender | bpd | Defend, Stopper, Cover |
| Central Defender | cd | Defend, Stopper, Cover |
| Full Back | fb | Attack, Support, Defend |
| Inverted Full Back | ifb | Defend |
| Inverted Wing Back | iwb | Attack, Support, Defend |
| Libero | l | Support, Defend |
| No-nonsense Centre Back | ncb | Defend, Stopper, Cover |
| No-nonsense Full Back | nfb | Defend |
| Wide Centre Back | wcb | Attack, Support, Defend |
| Wing Back | wb | Attack, Support, Defend |
| Complete Wing Back | cwb | Attack, Support |

### Goalkeepers (3 roles)
| Role | Code | Duties |
|------|------|--------|
| Goalkeeper | gk | Defend |
| Sweeper Keeper | sk | Attack, Support, Defend |

## Weighting System

The app uses a 0-5 scale for attribute importance:
- **0** - Not Important (59.4% of all values)
- **1** - Minor Importance (15.9% of all values)
- **3** - Important (15.8% of all values)
- **5** - Critical (9.4% of all values)

Note: Values 2 and 4 are NOT used, creating clear distinctions between importance levels.

## Calculated Metrics

The app derives three additional metrics from base attributes:

```javascript
Speed = (Pace + Acceleration) / 2
Workrate = (Work Rate + Stamina) / 2
Set Pieces = (Corners + Free Kicks + Penalties + Throw Ins) / 4
```

## Data Structure Format

Each role in `roles.json` follows this exact structure:

```json
{
  "Role": "Advanced Forward Attack",  // Full role name with duty
  "RoleCode": "afa",                  // Abbreviated code
  "1v1": 0,                           // Goalkeeper attribute
  "Acc": 5,                           // Acceleration importance
  "Aer": 0,                           // Aerial Reach importance
  "Agg": 0,                           // Aggression importance
  "Agi": 1,                           // Agility importance
  "Ant": 1,                           // Anticipation importance
  "Bal": 1,                           // Balance importance
  "Bra": 1,                           // Bravery importance
  "Cmd": 0,                           // Command of Area importance
  "Cnt": 1,                           // Concentration importance
  "Cmp": 3,                           // Composure importance
  "Cro": 0,                           // Crossing importance
  "Dec": 1,                           // Decisions importance
  "Det": 0,                           // Determination importance
  "Dri": 3,                           // Dribbling importance
  "Fin": 5,                           // Finishing importance
  "Fir": 3,                           // First Touch importance
  "Fla": 1,                           // Flair importance
  "Han": 0,                           // Handling importance
  "Hea": 1,                           // Heading importance
  "Jum": 0,                           // Jumping Reach importance
  "Kic": 0,                           // Kicking importance
  "Ldr": 0,                           // Leadership importance
  "Lon": 1,                           // Long Shots importance
  "Mar": 0,                           // Marking importance
  "OtB": 5,                           // Off the Ball importance
  "Pac": 5,                           // Pace importance
  "Pas": 1,                           // Passing importance
  "Pos": 0,                           // Positioning importance
  "Ref": 0,                           // Reflexes importance
  "Sta": 1,                           // Stamina importance
  "Str": 1,                           // Strength importance
  "Tck": 0,                           // Tackling importance
  "Tea": 0,                           // Teamwork importance
  "Tec": 3,                           // Technique importance
  "Thr": 0,                           // Throwing importance
  "TRO": 0,                           // Tendency to Rush Out importance
  "Vis": 0,                           // Vision importance
  "Wor": 3,                           // Work Rate importance
  "Cor": 0                            // Corners importance
}
```

## Complete Role List (85 Total)

### Attack Duties (26)
1. Advanced Forward Attack (afa)
2. Advanced Playmaker Attack (apa)
3. Attacking Midfielder Attack (ama)
4. Central Midfielder Attack (cma)
5. Complete Forward Attack (cfa)
6. Complete Wing Back Attack (cwba)
7. Deep Lying Forward Attack (dlfa)
8. Full Back Attack (fba)
9. Inside Forward Attack (ifa)
10. Inverted Winger Attack (iwa)
11. Inverted Wing Back Attack (iwba)
12. Mezzala Attack (meza)
13. Poacher Attack (pa)
14. Pressing Forward Attack (pfa)
15. Raumdeuter Attack (raua)
16. Segundo Volante Attack (sva)
17. Shadow Striker Attack (ssa)
18. Sweeper Keeper Attack (ska)
19. Target Forward Attack (tfa)
20. Trequartista Attack (trea)
21. Wide Centre Back Attack (wcba)
22. Wide Midfielder Attack (wma)
23. Wide Playmaker Attack (wpa)
24. Wide Target Forward Attack (wtfa)
25. Winger Attack (wa)
26. Wing Back Attack (wba)

### Support Duties (32)
1. Advanced Playmaker Support (aps)
2. Attacking Midfielder Support (ams)
3. Ball Winning Midfielder Support (bwms)
4. Box To Box Midfielder Support (b2bs)
5. Carrilero Support (cars)
6. Central Midfielder Support (cms)
7. Complete Forward Support (cfs)
8. Complete Wing Back Support (cwbs)
9. Deep Lying Forward Support (dlfs)
10. Deep Lying Playmaker Support (dlps)
11. Defensive Midfielder Support (dms)
12. Defensive Winger Support (dws)
13. Enganche Support (engs)
14. False Nine Support (f9s)
15. Full Back Support (fbs)
16. Inside Forward Support (ifs)
17. Inverted Winger Support (iws)
18. Inverted Wing Back Support (iwbs)
19. Libero Support (ls)
20. Mezzala Support (mezs)
21. Pressing Forward Support (pfs)
22. Regista Support (regs)
23. Roaming Playmaker Support (rps)
24. Segundo Volante Support (svs)
25. Sweeper Keeper Support (sks)
26. Target Forward Support (tfs)
27. Wide Centre Back Support (wcbs)
28. Wide Midfielder Support (wms)
29. Wide Playmaker Support (wps)
30. Wide Target Forward Support (wtfs)
31. Winger Support (ws)
32. Wing Back Support (wbs)

### Defend Duties (25)
1. Anchor Defend (ad)
2. Ball Playing Defender Defend (bpdd)
3. Ball Winning Midfielder Defend (bwmd)
4. Central Defender Defend (cdd)
5. Central Midfielder Defend (cmd)
6. Deep Lying Playmaker Defend (dlpd)
7. Defensive Midfielder Defend (dmd)
8. Defensive Winger Defend (dwd)
9. Full Back Defend (fbd)
10. Goalkeeper Defend (gkd)
11. Half Back Defend (hbd)
12. Inverted Full Back Defend (ifbd)
13. Inverted Wing Back Defend (iwbd)
14. Libero Defend (ld)
15. No-nonsense Centre Back Defend (ncbd)
16. No-nonsense Full Back Defend (nfbd)
17. Pressing Forward Defend (pfd)
18. Sweeper Keeper Defend (skd)
19. Wide Centre Back Defend (wcbd)
20. Wide Midfielder Defend (wmd)
21. Wing Back Defend (wbd)

### Stopper/Cover Duties (2)
1. Ball Playing Defender Cover (bpdc)
2. Ball Playing Defender Stopper (bpds)
3. Central Defender Cover (cdc)
4. Central Defender Stopper (cds)
5. No-nonsense Centre Back Cover (ncbc)
6. No-nonsense Centre Back Stopper (ncbs)

## Input Data Format

The app expects HTML files with player data tables containing these columns:
- **Name** - Player name
- **Nationality** - Player's nation
- **Club** - Current club
- **Position** - Playing position(s)
- All 40 attributes listed above

Values can be:
- Single numbers: "15"
- Ranges: "14-16" (converted to average: 15)
- Missing: "-" (treated as 0)

## Usage in Tauri App

When creating the Tauri version, this exact data structure must be preserved to ensure:
1. Compatibility with existing FM exports
2. Accurate player scoring calculations
3. Consistent role evaluation logic
4. Proper UI display of all roles and attributes

The `roles.json` file should be included as a static asset in the Tauri app and loaded at initialization.