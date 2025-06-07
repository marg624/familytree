#!/usr/bin/env node

// Debug script to trace Basilia → Hilaria relationship
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
    const row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').replace(/"/g, '').trim();
    });
    
    // For relationships, check Person1_ID instead of ID
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

async function debugRelationship() {
  console.log('🔍 Debugging Basilia → Hilaria relationship...\n');
  
  const [people, relationships] = await Promise.all([
    fetchCSV(PEOPLE_URL),
    fetchCSV(RELATIONSHIPS_URL)
  ]);
  
  console.log(`📊 Found ${people.length} people and ${relationships.length} relationships\n`);
  
  // Find Basilia and Hilaria
  const basilia = people.find(p => p.First_Name && p.First_Name.includes('Basilia'));
  const hilaria = people.find(p => p.First_Name && p.First_Name.includes('Hilaria'));
  
  console.log('👤 People found:');
  console.log(`Basilia: ID ${basilia?.ID} - ${basilia?.First_Name} ${basilia?.Last_Name}`);
  console.log(`Hilaria: ID ${hilaria?.ID} - ${hilaria?.First_Name} ${hilaria?.Last_Name}\n`);
  
  if (!basilia || !hilaria) {
    console.log('❌ Could not find both people!');
    return;
  }
  
  // Check relationships involving Basilia (ID 2)
  console.log('🔗 Relationships involving Basilia (ID 2):');
  const basiliaRelationships = relationships.filter(rel => 
    rel.Person1_ID === basilia.ID || rel.Person2_ID === basilia.ID
  );
  
  basiliaRelationships.forEach(rel => {
    const other = rel.Person1_ID === basilia.ID ? rel.Person2_ID : rel.Person1_ID;
    const otherPerson = people.find(p => p.ID === other);
    const direction = rel.Person1_ID === basilia.ID ? '→' : '←';
    console.log(`  ${direction} ${rel.Relationship_Type} with ID ${other} (${otherPerson?.First_Name} ${otherPerson?.Last_Name})`);
  });
  
  // Check relationships involving Hilaria (ID 21)
  console.log('\n🔗 Relationships involving Hilaria (ID 21):');
  const hilariaRelationships = relationships.filter(rel => 
    rel.Person1_ID === hilaria.ID || rel.Person2_ID === hilaria.ID
  );
  
  hilariaRelationships.forEach(rel => {
    const other = rel.Person1_ID === hilaria.ID ? rel.Person2_ID : rel.Person1_ID;
    const otherPerson = people.find(p => p.ID === other);
    const direction = rel.Person1_ID === hilaria.ID ? '→' : '←';
    console.log(`  ${direction} ${rel.Relationship_Type} with ID ${other} (${otherPerson?.First_Name} ${otherPerson?.Last_Name})`);
  });
  
  // Trace the expected path: Basilia → Tomasa → Hilaria
  console.log('\n🛤️  Expected path: Basilia → Tomasa → Hilaria');
  
  // Step 1: Basilia (2) → parent → Tomasa (5)
  const basiliaToTomasa = relationships.find(rel => 
    rel.Person1_ID === '2' && rel.Person2_ID === '5' && rel.Relationship_Type === 'parent'
  );
  console.log(`Step 1 - Basilia (2) parent of Tomasa (5): ${basiliaToTomasa ? '✅ Found' : '❌ Missing'}`);
  
  // Step 2: Tomasa (5) → parent → Hilaria (21)  
  const tomasaToHilaria = relationships.find(rel => 
    rel.Person1_ID === '5' && rel.Person2_ID === '21' && rel.Relationship_Type === 'parent'
  );
  console.log(`Step 2 - Tomasa (5) parent of Hilaria (21): ${tomasaToHilaria ? '✅ Found' : '❌ Missing'}`);
  
  if (basiliaToTomasa && tomasaToHilaria) {
    console.log('\n✅ Path exists! Basilia should be Hilaria\'s grandparent');
    console.log('🐛 Issue might be in the relationship calculator algorithm');
  } else {
    console.log('\n❌ Path is broken - missing relationship data');
  }
  
  // Check if Tomasa exists
  const tomasa = people.find(p => p.ID === '5');
  console.log(`\n👤 Tomasa (ID 5): ${tomasa?.First_Name} ${tomasa?.Last_Name}`);
}

debugRelationship().catch(console.error);