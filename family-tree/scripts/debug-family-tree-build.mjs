#!/usr/bin/env node

// Debug script to check how the family tree is being built
const SPREADSHEET_ID = '18QyYByrlq1aPp_jyI2FW4AD5DQGQhlJ_FXxmICXKb80';

// Import the actual API functions
import { buildFamilyTree } from '../src/lib/sheetsApi.js';
import { createRelationshipCalculator } from '../src/lib/relationshipCalculator.js';

async function debugFamilyTreeBuild() {
  console.log('🔍 Debugging family tree building process...\n');
  
  try {
    // Build the family tree using the actual API
    const familyData = await buildFamilyTree('campana');
    console.log(`📊 Built family tree with ${familyData.length} people\n`);
    
    // Find Basilia and Hilaria
    const basilia = familyData.find(p => p.First_Name && p.First_Name.includes('Basilia'));
    const hilaria = familyData.find(p => p.First_Name && p.First_Name.includes('Hilaria'));
    
    console.log('👤 People found in family tree:');
    console.log(`Basilia: ID ${basilia?.ID} - ${basilia?.First_Name} ${basilia?.Last_Name}`);
    console.log(`  Parents: ${basilia?.parents?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}`);
    console.log(`  Children: ${basilia?.children?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}`);
    console.log(`  Spouse: ${basilia?.spouse ? `${basilia.spouse.First_Name} ${basilia.spouse.Last_Name}` : 'None'}\n`);
    
    console.log(`Hilaria: ID ${hilaria?.ID} - ${hilaria?.First_Name} ${hilaria?.Last_Name}`);
    console.log(`  Parents: ${hilaria?.parents?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}`);
    console.log(`  Children: ${hilaria?.children?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}`);
    console.log(`  Spouse: ${hilaria?.spouse ? `${hilaria.spouse.First_Name} ${hilaria.spouse.Last_Name}` : 'None'}\n`);
    
    // Check if Tomasa is in Basilia's children
    console.log('🔗 Checking connection through Tomasa:');
    const tomasa = familyData.find(p => p.First_Name && p.First_Name.includes('Tomasa'));
    console.log(`Tomasa: ID ${tomasa?.ID} - ${tomasa?.First_Name} ${tomasa?.Last_Name}`);
    console.log(`  Parents: ${tomasa?.parents?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}`);
    console.log(`  Children: ${tomasa?.children?.map(p => `${p.First_Name} ${p.Last_Name}`).join(', ') || 'None'}\n`);
    
    // Test the relationship calculator
    if (basilia && hilaria && tomasa) {
      console.log('🧮 Testing relationship calculator:');
      const calculator = createRelationshipCalculator(familyData);
      
      // Test Basilia → Hilaria
      const relationship = calculator.calculateRelationship(basilia.ID, hilaria.ID);
      const relationshipWithContext = calculator.getRelationshipWithContext(basilia.ID, hilaria.ID);
      console.log(`Basilia → Hilaria: "${relationship}"`);
      console.log(`With context: "${relationshipWithContext.relationship}" - ${relationshipWithContext.fullDescription}`);
      
      // Test Basilia → Tomasa
      const tomasaRelationship = calculator.calculateRelationship(basilia.ID, tomasa.ID);
      const tomasaRelationshipWithContext = calculator.getRelationshipWithContext(basilia.ID, tomasa.ID);
      console.log(`\nBasilia → Tomasa: "${tomasaRelationship}"`);
      console.log(`With context: "${tomasaRelationshipWithContext.relationship}" - ${tomasaRelationshipWithContext.fullDescription}`);
      
      // Test the path finding
      const path = calculator.findShortestPath(basilia.ID, hilaria.ID);
      if (path) {
        console.log('\n🛤️  Shortest path found (Basilia → Hilaria):');
        path.forEach((person, index) => {
          console.log(`  ${index + 1}. ${person.First_Name} ${person.Last_Name} (ID: ${person.ID})`);
        });
      } else {
        console.log('\n❌ No path found between Basilia and Hilaria');
      }
      
      // Check ancestors
      console.log('\n👴 Hilaria\'s ancestors:');
      const hilariaAncestors = calculator.getAllAncestors(hilaria);
      hilariaAncestors.forEach(ancestor => {
        console.log(`  Distance ${ancestor.distance}: ${ancestor.person.First_Name} ${ancestor.person.Last_Name} (ID: ${ancestor.person.ID})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugFamilyTreeBuild().catch(console.error);