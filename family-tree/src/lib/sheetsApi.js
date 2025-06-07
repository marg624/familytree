// Google Sheets API integration for family tree data
// Default spreadsheet (Campana family)
const DEFAULT_SPREADSHEET_ID = '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb8';

// Spreadsheet configurations for different families
const FAMILY_SPREADSHEETS = {
  campana: '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80',
  guerrero: '', // Update with actual Guerrero spreadsheet ID
  miranda: ''   // Update with actual Miranda spreadsheet ID
};

function getSpreadsheetUrls(familyName) {
  const spreadsheetId = FAMILY_SPREADSHEETS[familyName?.toLowerCase()] || DEFAULT_SPREADSHEET_ID;
  return {
    people: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=People`,
    relationships: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=Relationship`
  };
}

export async function fetchPeopleData(familyName) {
  try {
    const urls = getSpreadsheetUrls(familyName);
    const response = await fetch(urls.people);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching people data:', error);
    return [];
  }
}

export async function fetchRelationshipsData(familyName) {
  try {
    const urls = getSpreadsheetUrls(familyName);
    const response = await fetch(urls.relationships);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching relationships data:', error);
    return [];
  }
}

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  // Parse header row
  const headers = lines[0].split(',').map(header => 
    header.replace(/"/g, '').trim()
  );
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').replace(/"/g, '').trim();
    });
    
    // Add row if it has required fields
    if ((row.ID && row.ID !== '') || (row.Person1_ID && row.Person1_ID !== '')) {
      data.push(row);
    }
  }
  
  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export async function buildFamilyTree(familyName) {
  const [people, relationships] = await Promise.all([
    fetchPeopleData(familyName),
    fetchRelationshipsData(familyName)
  ]);
  
  // Create a map of people by ID
  const peopleMap = new Map();
  people.forEach(person => {
    // Ensure ID is string for consistent matching
    const personId = String(person.ID);
    peopleMap.set(personId, {
      ...person,
      ID: personId, // Ensure ID property is also string
      children: [],
      parents: [],
      spouse: null
    });
  });
  
  // Process relationships
  relationships.forEach(rel => {
    // Ensure IDs are strings for consistent matching
    const person1Id = String(rel.Person1_ID);
    const person2Id = String(rel.Person2_ID);
    const person1 = peopleMap.get(person1Id);
    const person2 = peopleMap.get(person2Id);
    
    
    if (!person1 || !person2) {
      // Debug missing people
      if (!person1) console.log(`Debug: Person1 with ID ${rel.Person1_ID} not found in peopleMap`);
      if (!person2) console.log(`Debug: Person2 with ID ${rel.Person2_ID} not found in peopleMap`);
      return;
    }
    
    switch (rel.Relationship_Type?.toLowerCase()) {
      case 'parent':
        person1.children.push(person2);
        person2.parents.push(person1);
        break;
      case 'child':
        person2.children.push(person1);
        person1.parents.push(person2);
        break;
      case 'spouse':
        person1.spouse = person2;
        person2.spouse = person1;
        break;
    }
  });
  
  return Array.from(peopleMap.values());
}