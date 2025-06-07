#!/usr/bin/env node

// Script to transform the current family tree spreadsheet format
// to the new interactive format

const SPREADSHEET_ID = '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80';
const PEOPLE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=People`;
const RELATIONSHIPS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Relationship`;

async function fetchCSV(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return parseCSV(csvText);
}

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(header => 
    header.replace(/"/g, '').trim()
  );
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
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

function parseName(fullName) {
  // Parse names like "Fortunato (Tato) Campana" or "Basilia Acuna"
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  // Find if there's a nickname in parentheses
  const nicknameMatch = fullName.match(/\(([^)]+)\)/);
  let firstName = '';
  let lastName = '';
  
  if (nicknameMatch) {
    // Extract first name with nickname
    const beforeParen = fullName.substring(0, fullName.indexOf('(')).trim();
    const afterParen = fullName.substring(fullName.indexOf(')') + 1).trim();
    
    firstName = beforeParen + ' ' + nicknameMatch[0];
    lastName = afterParen;
  } else {
    // No nickname, split normally
    lastName = parts[parts.length - 1];
    firstName = parts.slice(0, -1).join(' ');
  }
  
  return { firstName: firstName.trim(), lastName: lastName.trim() };
}

async function transformData() {
  console.log('🔄 Fetching current spreadsheet data...\n');
  
  const [peopleData, relationshipData] = await Promise.all([
    fetchCSV(PEOPLE_URL),
    fetchCSV(RELATIONSHIPS_URL)
  ]);
  
  console.log(`📊 Found ${peopleData.length} people and ${relationshipData.length} relationships\n`);
  
  // Transform people data
  const transformedPeople = [];
  const spouseConnections = [];
  let currentId = 1;
  
  // Process each person and their spouse
  for (const person of peopleData) {
    const originalId = person.ID;
    const originalName = person.Name;
    const spouseName = person.Spouse;
    
    if (!originalName) continue;
    
    // Add the main person
    const mainPersonName = parseName(originalName);
    transformedPeople.push({
      ID: currentId,
      originalId: originalId,
      First_Name: mainPersonName.firstName,
      Last_Name: mainPersonName.lastName,
      Birth_Date: '',
      Death_Date: '',
      Birth_Place: ''
    });
    
    const mainPersonNewId = currentId;
    currentId++;
    
    // Add spouse if they exist
    if (spouseName && spouseName.trim() && spouseName.trim() !== '""' && spouseName.trim() !== '') {
      const spousePersonName = parseName(spouseName);
      transformedPeople.push({
        ID: currentId,
        originalId: null, // Spouse doesn't have original ID
        First_Name: spousePersonName.firstName,
        Last_Name: spousePersonName.lastName,
        Birth_Date: '',
        Death_Date: '',
        Birth_Place: ''
      });
      
      // Record spouse connection
      spouseConnections.push({
        Person1_ID: mainPersonNewId,
        Person2_ID: currentId,
        Relationship_Type: 'spouse'
      });
      
      currentId++;
    }
  }
  
  // Create mapping from original ID to new ID
  const idMapping = {};
  for (const person of transformedPeople) {
    if (person.originalId) {
      idMapping[person.originalId] = person.ID;
    }
  }
  
  // Transform relationship data
  const transformedRelationships = [...spouseConnections];
  
  for (const rel of relationshipData) {
    const parentOriginalId = rel.ID_Parent;
    const childOriginalId = rel.ID_Child;
    
    const parentNewId = idMapping[parentOriginalId];
    const childNewId = idMapping[childOriginalId];
    
    if (parentNewId && childNewId) {
      transformedRelationships.push({
        Person1_ID: parentNewId,
        Person2_ID: childNewId,
        Relationship_Type: 'parent'
      });
    }
  }
  
  // Output the results
  console.log('📋 COPY THIS TO YOUR PEOPLE TAB:');
  console.log('=' .repeat(80));
  console.log('ID,First_Name,Last_Name,Birth_Date,Death_Date,Birth_Place');
  
  for (const person of transformedPeople) {
    console.log(`${person.ID},"${person.First_Name}","${person.Last_Name}","${person.Birth_Date}","${person.Death_Date}","${person.Birth_Place}"`);
  }
  
  console.log('\n📋 COPY THIS TO YOUR RELATIONSHIP TAB:');
  console.log('=' .repeat(80));
  console.log('Person1_ID,Person2_ID,Relationship_Type');
  
  for (const rel of transformedRelationships) {
    console.log(`${rel.Person1_ID},${rel.Person2_ID},${rel.Relationship_Type}`);
  }
  
  console.log('\n✅ Transformation complete!');
  console.log(`📊 Generated ${transformedPeople.length} people and ${transformedRelationships.length} relationships`);
  console.log('\n📝 Instructions:');
  console.log('1. Copy the People data above and paste it into your People tab');
  console.log('2. Copy the Relationship data above and paste it into your Relationship tab');
  console.log('3. Make sure to replace ALL existing data in both tabs');
  console.log('4. Your interactive family tree will then work automatically!');
}

// Run the transformation
transformData().catch(console.error);