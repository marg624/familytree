# Interactive Family Tree Website

This is an interactive family tree website that displays family data from a Google Spreadsheet, built with Next.js and Tailwind CSS.

## Features

- **Modern Interactive Design**: Clean, card-based interface with smooth animations
- **Advanced Relationship Calculator**: Find relationships between any two people (up to 7+ generations)
- **Relationship Finder Tool**: Interactive tool to discover how any two family members are related
- **Search Functionality**: Quickly find any family member by name
- **Multiple View Modes**: Switch between Tree view and Grid view
- **Photo Support**: Display family photos (add Photo_URL column to spreadsheet)
- **Mobile Responsive**: Optimized for phones, tablets, and desktops
- **Expandable Family Tree**: Click + buttons to expand and see descendants
- **Detailed Person Profiles**: Click any person to see comprehensive information with relationship context
- **Three Family Sections**: Separate data sources for Campana, Guerrero, and Miranda families
- **Real-time Data**: Automatically fetches latest data from Google Spreadsheet
- **Password Protection**: Secure access with family password

## Data Source

The family tree data is sourced from this Google Spreadsheet:
https://docs.google.com/spreadsheets/d/18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80/edit

Each family spreadsheet should have two tabs:
- **People**: Contains family member details (ID, First_Name, Last_Name, Birth_Date, Death_Date, Birth_Place)
- **Relationship**: Contains relationships between people (Person1_ID, Person2_ID, Relationship_Type)

## Required Spreadsheet Format

### People Tab:
| ID | First_Name | Last_Name | Birth_Date | Death_Date | Birth_Place | Photo_URL |
|----|------------|-----------|------------|------------|-------------|-----------|
| 1 | Fortunato (Tato) | Campana | | | | https://example.com/photo1.jpg |
| 2 | Basilia | Acuna | | | | |

### Relationship Tab:
| Person1_ID | Person2_ID | Relationship_Type |
|------------|------------|-------------------|
| 1 | 2 | spouse |
| 1 | 3 | parent |

**Notes:**
- First_Name can include nicknames in parentheses
- Photo_URL is optional - add direct links to photos (Google Drive, etc.)
- Relationship_Type should be: "parent", "spouse"
- Only one row needed per relationship (no reverse rows)

## New Design Features

### 🎨 Modern Interface
- Clean card-based design with hover effects
- Gradient backgrounds and smooth animations
- Consistent color scheme using emerald/slate palette
- Professional typography and spacing

### 📱 Mobile-First Design
- Responsive layout that works on all screen sizes
- Touch-friendly buttons and interactions
- Mobile-optimized detail modal
- Sticky header for easy navigation

### 🔍 Search & Navigation
- Real-time search as you type
- Search results with highlighting
- Quick family switching with tabs
- Tree view and grid view options

### 👤 Person Profiles
- Large photo display with fallback avatars
- Detailed information panels with relationship context
- Clickable relationship links to navigate between family members
- Color-coded badges for different info types

### 🔗 Relationship Calculator
- **Advanced Algorithm**: Calculates complex relationships through common ancestors
- **7+ Generation Support**: Handles great-great-grandparents and beyond
- **Comprehensive Relationships**: Supports all standard family relationships:
  - Direct: parent, child, sibling, spouse
  - Extended: grandparent, great-grandparent, aunt/uncle, niece/nephew
  - Cousins: 1st cousin, 2nd cousin, 3rd cousin, etc.
  - Removed: cousin 1x removed, cousin 2x removed, etc.
  - Complex: in-laws, half-siblings, step-relationships
- **Interactive Finder**: Dedicated tool to find relationships between any two people
- **Real-time Context**: Shows relationships in person detail panels

## Relationship Examples

The relationship calculator can determine complex family connections:

### Simple Relationships
- **Basilia** to **Hilaria**: `grandparent` (parent's parent)
- **Tranquilino** to **Fortunato**: `grandchild` (child's child)
- **Isabel** to **Tomasa**: `sibling` (same parents)

### Complex Relationships  
- **Cousins**: People with same grandparents are 1st cousins
- **2nd Cousins**: People with same great-grandparents are 2nd cousins
- **Removed Cousins**: A cousin's child is "1x removed" (one generation difference)
- **Great Relations**: Great-grandparent, great-great-grandparent, etc.

### In-Law Relationships
- Spouse's family members are marked as "in-law"
- Half-siblings (sharing one parent) are marked as "half"

### Usage
1. Click the **"Relationships"** button in the family tree
2. Search for two people using the dropdown menus
3. See their relationship instantly calculated
4. Click on any person in detail panels to see their relationships

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