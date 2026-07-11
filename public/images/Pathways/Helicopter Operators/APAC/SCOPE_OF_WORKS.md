# APAC Helicopter & General Aviation Operator Logos — Scope of Works

## Overview
This document outlines the scope of works for collecting, organizing, and downloading
logos for helicopter operators, general aviation companies, air ambulance services,
agricultural aviation operators, flight training schools, scenic flight operators,
and private jet charter companies across the APAC (Asia-Pacific) region.

## Folder Structure
```
public/images/operator-logos/APAC/
  apac-region.json          # Regional overview
  manifest.json             # Download manifest (all operators)
  <country>/
    country-info.json       # Country-level operator data
    helicopter-operators/   # Helicopter operator logos
    general-aviation/       # General aviation operator logos
    air-ambulance/          # Air ambulance & medical logos
    agricultural-aviation/  # Agricultural aviation logos
    flight-training/        # Flight training school logos
    scenic/                 # Scenic & tourism operator logos
    private-jet/            # Private jet charter logos
```

## Statistics
- **Total countries with operators:** 29
- **Total operators identified:** 157
- **Logo format:** SVG (preferred), PNG/JPG (fallback)

## Categories
- **Helicopter Operators** (`helicopter`)
- **General Aviation** (`general_aviation`)
- **Air Ambulance & Medical** (`air_ambulance`)
- **Agricultural Aviation** (`agricultural`)
- **Flight Training** (`flight_training`)
- **Scenic & Tourism** (`scenic`)
- **Private Jet Charter** (`private_jet`)

## Countries & Operator Counts
- **australia**: 27 operators (Helicopter Operators: 5, General Aviation: 6, Air Ambulance & Medical: 7, Agricultural Aviation: 4, Flight Training: 5)
- **new-zealand**: 19 operators (Helicopter Operators: 8, General Aviation: 6, Scenic & Tourism: 5)
- **bangladesh**: 10 operators (Helicopter Operators: 10)
- **india**: 8 operators (Helicopter Operators: 3, Flight Training: 5)
- **japan**: 7 operators (Helicopter Operators: 4, General Aviation: 3)
- **indonesia**: 7 operators (Helicopter Operators: 7)
- **nepal**: 7 operators (Helicopter Operators: 7)
- **kazakhstan**: 7 operators (Helicopter Operators: 7)
- **china**: 6 operators (Helicopter Operators: 6)
- **papua-new-guinea**: 6 operators (Helicopter Operators: 6)
- **vietnam**: 5 operators (Helicopter Operators: 5)
- **sri-lanka**: 5 operators (Helicopter Operators: 5)
- **singapore**: 4 operators (Helicopter Operators: 1, Private Jet Charter: 3)
- **thailand**: 4 operators (Helicopter Operators: 4)
- **philippines**: 4 operators (Helicopter Operators: 4)
- **malaysia**: 3 operators (Helicopter Operators: 3)
- **taiwan**: 3 operators (Helicopter Operators: 3)
- **hong-kong**: 3 operators (Helicopter Operators: 3)
- **fiji**: 3 operators (Helicopter Operators: 3)
- **cambodia**: 3 operators (Helicopter Operators: 3)
- **new-caledonia**: 3 operators (Helicopter Operators: 3)
- **laos**: 2 operators (Helicopter Operators: 2)
- **uzbekistan**: 2 operators (Helicopter Operators: 2)
- **azerbaijan**: 2 operators (Helicopter Operators: 2)
- **vanuatu**: 2 operators (Helicopter Operators: 2)
- **french-polynesia**: 2 operators (Helicopter Operators: 2)
- **south-korea**: 1 operators (Helicopter Operators: 1)
- **myanmar**: 1 operators (Helicopter Operators: 1)
- **solomon-islands**: 1 operators (Helicopter Operators: 1)

## Methodology
1. Research and identify all helicopter and general aviation operators in each APAC country
2. Create geographic folder structure mirroring the airline-logos pattern
3. Download SVG logos from Wikimedia Commons where available
4. Fall back to PNG/JPG from official websites or Wikipedia where SVG is unavailable
5. Generate country-info.json for each country with operator metadata
6. Generate apac-region.json with regional overview
7. Generate manifest.json tracking download status for each operator

## Next Steps
- [ ] Download SVG logos from Wikimedia Commons for all identified operators
- [ ] For operators without SVG logos on Commons, search official websites for logo assets
- [ ] Create a TypeScript data file (similar to aircraft-manufacturers.ts) for operator metadata
- [ ] Build UI components to display operators by country and category
- [ ] Integrate with career pathways for helicopter/general aviation pilot routes
