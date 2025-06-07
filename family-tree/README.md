# Interactive Family Tree Website

This is an interactive family tree website that displays family data from a Google Spreadsheet, built with Next.js and Tailwind CSS.

## Features

- **Interactive Family Tree**: Click on family members to view detailed information
- **Expandable Nodes**: Use + buttons to expand and see children/descendants  
- **Three Family Sections**: Separate tabs for Campana, Guerrero, and Miranda families
- **Real-time Data**: Automatically fetches data from Google Spreadsheet
- **Responsive Design**: Works on desktop and mobile devices
- **Password Protection**: Secure access with family password

## Data Source

The family tree data is sourced from this Google Spreadsheet:
https://docs.google.com/spreadsheets/d/18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80/edit

Each family spreadsheet should have two tabs:
- **People**: Contains family member details (ID, First_Name, Last_Name, Birth_Date, Death_Date, Birth_Place)
- **Relationship**: Contains relationships between people (Person1_ID, Person2_ID, Relationship_Type)

## Required Spreadsheet Format

### People Tab:
| ID | First_Name | Last_Name | Birth_Date | Death_Date | Birth_Place |
|----|------------|-----------|------------|------------|-------------|
| 1 | Fortunato (Tato) | Campana | | | |
| 2 | Basilia | Acuna | | | |

### Relationship Tab:
| Person1_ID | Person2_ID | Relationship_Type |
|------------|------------|-------------------|
| 1 | 2 | spouse |
| 1 | 3 | parent |

**Notes:**
- First_Name can include nicknames in parentheses
- Relationship_Type should be: "parent", "spouse"
- Only one row needed per relationship (no reverse rows)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser

4. Enter the family password: `hilaria`

## How It Works

- **Data Fetching**: The app fetches family data from the public Google Spreadsheet using CSV export
- **Tree Building**: Relationships are processed to create parent-child and spouse connections
- **Interactive Display**: Family members are displayed in an expandable tree structure
- **Detail Panel**: Click any person to see their detailed information in a side panel

## Deployment

The site is deployed on Vercel at: https://familytree-miranda.vercel.app/

To deploy updates:
1. Push changes to the main branch
2. Vercel will automatically build and deploy

## Adding New Family Spreadsheets

To add Guerrero and Miranda family spreadsheets:
1. Create new Google Spreadsheets with the same format as the Campana spreadsheet
2. Update the spreadsheet IDs in `/src/lib/sheetsApi.js`:
```javascript
const FAMILY_SPREADSHEETS = {
  campana: '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80',
  guerrero: 'YOUR_GUERRERO_SPREADSHEET_ID_HERE',
  miranda: 'YOUR_MIRANDA_SPREADSHEET_ID_HERE'
};
```

## Updating Family Data

To add or modify family information:
1. Update the respective Google Spreadsheet directly
2. The website will automatically fetch the latest data on page refresh
3. No code changes needed for data updates

## Technical Details

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets (public CSV export)
- **Deployment**: Vercel