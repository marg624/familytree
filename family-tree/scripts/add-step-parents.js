#!/usr/bin/env node

// Script to analyze current relationships and show what step-parent relationships would be added
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
    
    if (row.ID && row.ID !== '') {
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

async function analyzeStepRelationships() {
  console.log('🔄 Fetching current data...\n');
  
  const [people, relationships] = await Promise.all([
    fetchCSV(PEOPLE_URL),
    fetchCSV(RELATIONSHIPS_URL)
  ]);
  
  console.log(`📊 Found ${people.length} people and ${relationships.length} relationships\n`);
  
  // Create person lookup
  const personMap = new Map();
  people.forEach(person => {
    personMap.set(person.ID, person);
  });
  
  // Separate relationships by type
  const spouseRelationships = relationships.filter(rel => rel.Relationship_Type === 'spouse');
  const parentRelationships = relationships.filter(rel => rel.Relationship_Type === 'parent');
  
  console.log(`👫 Found ${spouseRelationships.length} spouse relationships`);
  console.log(`👨‍👩‍👧‍👦 Found ${parentRelationships.length} parent-child relationships\n`);
  
  // Find step-parent relationships that would be added
  const newStepRelationships = [];
  
  for (const parentRel of parentRelationships) {
    const parentId = parentRel.Person1_ID;
    const childId = parentRel.Person2_ID;
    
    // Find if this parent has a spouse
    const spouseRel = spouseRelationships.find(spouse => 
      spouse.Person1_ID === parentId || spouse.Person2_ID === parentId
    );
    
    if (spouseRel) {
      // Get the spouse's ID
      const spouseId = spouseRel.Person1_ID === parentId 
        ? spouseRel.Person2_ID 
        : spouseRel.Person1_ID;
      
      // Check if this step-parent relationship already exists
      const stepRelExists = parentRelationships.some(rel =>
        rel.Person1_ID === spouseId && rel.Person2_ID === childId
      );
      
      if (!stepRelExists) {
        const parent = personMap.get(parentId);
        const stepParent = personMap.get(spouseId);
        const child = personMap.get(childId);
        
        newStepRelationships.push({
          Person1_ID: spouseId,
          Person2_ID: childId,
          Relationship_Type: 'parent',
          description: `${stepParent?.First_Name || stepParent?.Name || 'Person ' + spouseId} (step-parent) → ${child?.First_Name || child?.Name || 'Person ' + childId} (step-child)`
        });
      }
    }
  }
  
  console.log('🔗 NEW STEP-PARENT RELATIONSHIPS TO ADD:');
  console.log('=' .repeat(60));
  
  if (newStepRelationships.length === 0) {
    console.log('✅ No new step-parent relationships needed!');
    console.log('All children already have relationships with both parents and step-parents.');
  } else {
    console.log(`Found ${newStepRelationships.length} step-parent relationships to add:\n`);
    
    newStepRelationships.forEach((rel, index) => {
      console.log(`${index + 1}. ${rel.description}`);
    });
    
    console.log('\n📋 ADD THESE ROWS TO YOUR RELATIONSHIP TAB:');
    console.log('=' .repeat(60));
    
    newStepRelationships.forEach(rel => {
      console.log(`${rel.Person1_ID},${rel.Person2_ID},${rel.Relationship_Type}`);
    });
  }
  
  console.log('\n💡 EXPLANATION:');
  console.log('These relationships ensure that children are connected to both their');
  console.log('biological parent AND their step-parent (parent\'s spouse).');
  console.log('This creates more complete family connections in the tree.');
  
  console.log('\n🎯 EXAMPLE:');
  console.log('If Fortunato has children with Basilia, and Fortunato is married to someone else,');
  console.log('then those children would also be step-children of Fortunato\'s spouse.');
}

analyzeStepRelationships().catch(console.error);