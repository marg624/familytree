#!/usr/bin/env node

// Script to complete parent relationships: if spouse1 is parent of child, then spouse2 is also parent of child
const SPREADSHEET_ID = '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80';
const RELATIONSHIPS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Relationship`;

async function fetchRelationships() {
  try {
    const response = await fetch(RELATIONSHIPS_URL);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const relationships = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length >= 3) {
        const person1_id = parts[0].replace(/"/g, '').trim();
        const person2_id = parts[1].replace(/"/g, '').trim();
        const relationship_type = parts[2].replace(/"/g, '').trim();
        
        if (person1_id && person2_id && relationship_type) {
          relationships.push({
            Person1_ID: person1_id,
            Person2_ID: person2_id,
            Relationship_Type: relationship_type
          });
        }
      }
    }
    
    return relationships;
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return [];
  }
}

async function completeParentRelationships() {
  console.log('🔄 Fetching current relationships...\n');
  
  const relationships = await fetchRelationships();
  console.log(`📊 Found ${relationships.length} total relationships\n`);
  
  // Separate by type
  const spouseRelationships = relationships.filter(rel => 
    rel.Relationship_Type.toLowerCase() === 'spouse'
  );
  const parentRelationships = relationships.filter(rel => 
    rel.Relationship_Type.toLowerCase() === 'parent'
  );
  
  console.log(`👫 Spouse relationships: ${spouseRelationships.length}`);
  console.log(`👨‍👩‍👧‍👦 Parent relationships: ${parentRelationships.length}\n`);
  
  const newParentRelationships = [];
  
  // For each parent-child relationship, check if the parent's spouse is also listed as parent
  for (const parentRel of parentRelationships) {
    const parentId = parentRel.Person1_ID;
    const childId = parentRel.Person2_ID;
    
    // Find the parent's spouse
    const spouseRel = spouseRelationships.find(spouse => 
      spouse.Person1_ID === parentId || spouse.Person2_ID === parentId
    );
    
    if (spouseRel) {
      // Get the spouse's ID
      const spouseId = spouseRel.Person1_ID === parentId 
        ? spouseRel.Person2_ID 
        : spouseRel.Person1_ID;
      
      // Check if spouse is already listed as parent of this child
      const spouseIsParent = parentRelationships.some(rel =>
        rel.Person1_ID === spouseId && rel.Person2_ID === childId
      );
      
      if (!spouseIsParent) {
        newParentRelationships.push({
          Person1_ID: spouseId,
          Person2_ID: childId,
          Relationship_Type: 'parent'
        });
      }
    }
  }
  
  console.log('🔗 ADDITIONAL PARENT RELATIONSHIPS NEEDED:');
  console.log('=' .repeat(50));
  
  if (newParentRelationships.length === 0) {
    console.log('✅ All spouses are already listed as parents!');
    console.log('Your relationship data is complete.');
  } else {
    console.log(`Found ${newParentRelationships.length} missing parent relationships:\n`);
    
    newParentRelationships.forEach((rel, index) => {
      console.log(`${index + 1}. Person ${rel.Person1_ID} should be parent of Person ${rel.Person2_ID}`);
    });
    
    console.log('\n📋 ADD THESE ROWS TO YOUR RELATIONSHIP TAB:');
    console.log('=' .repeat(50));
    console.log('Person1_ID,Person2_ID,Relationship_Type');
    
    newParentRelationships.forEach(rel => {
      console.log(`${rel.Person1_ID},${rel.Person2_ID},${rel.Relationship_Type}`);
    });
    
    console.log('\n📥 COMPLETE UPDATED RELATIONSHIP TAB:');
    console.log('=' .repeat(50));
    console.log('Person1_ID,Person2_ID,Relationship_Type');
    
    // Output all relationships (existing + new)
    const allRelationships = [...relationships, ...newParentRelationships];
    allRelationships.forEach(rel => {
      console.log(`${rel.Person1_ID},${rel.Person2_ID},${rel.Relationship_Type}`);
    });
  }
  
  console.log('\n💡 LOGIC:');
  console.log('If Person A is married to Person B, and Person A is parent of Person C,');
  console.log('then Person B is also parent of Person C (married couples share children).');
}

completeParentRelationships().catch(console.error);