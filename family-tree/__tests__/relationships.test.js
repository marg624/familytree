// Relationship validation tests for family tree
// These tests ensure the relationship calculator works correctly

// Convert the ES modules to work with Jest using dynamic imports
let buildFamilyTree;
let createRelationshipCalculator;

describe('Family Tree Relationship Calculator', () => {
  let familyData;
  let calculator;
  let people;

  beforeAll(async () => {
    // Dynamically import the ES modules
    const sheetsModule = await import('../src/lib/sheetsApi.js');
    const calculatorModule = await import('../src/lib/relationshipCalculator.js');
    
    buildFamilyTree = sheetsModule.buildFamilyTree;
    createRelationshipCalculator = calculatorModule.createRelationshipCalculator;
    
    // Build the family tree with REAL data
    familyData = await buildFamilyTree('campana');
    calculator = createRelationshipCalculator(familyData);
    
    console.log(`🔍 Testing with REAL data: ${familyData.length} people loaded`);
    
    // Create a lookup map for easier testing
    people = {};
    familyData.forEach(person => {
      const key = person.First_Name?.toLowerCase().replace(/[^a-z]/g, '');
      if (key) {
        people[key] = person;
      }
    });
    
    console.log('Available people for testing:', Object.keys(people).sort());
  });

  // Helper function to get person by partial name match
  const findPerson = (partialName) => {
    const key = partialName.toLowerCase().replace(/[^a-z]/g, '');
    const person = people[key] || familyData.find(p => 
      p.First_Name?.toLowerCase().includes(partialName.toLowerCase())
    );
    if (!person) {
      throw new Error(`Person not found: ${partialName}. Available: ${Object.keys(people).join(', ')}`);
    }
    return person;
  };

  describe('Required Relationship Tests', () => {
    test('Basilia → Anicia: grandparent', () => {
      const basilia = findPerson('basilia');
      const anicia = findPerson('anicia'); // This should match 'aniciaaning'
      
      console.log(`Debug: Found Basilia: ${basilia?.First_Name} (${basilia?.ID})`);
      console.log(`Debug: Found Anicia: ${anicia?.First_Name} (${anicia?.ID})`);
      
      // Debug the family tree structure
      const felix = familyData.find(p => p.First_Name?.includes('Felix'));
      console.log(`Debug: Felix: ${felix?.First_Name} (${felix?.ID})`);
      console.log(`Debug: Felix parents: ${felix?.parents?.map(p => `${p.First_Name}(${p.ID})`).join(', ') || 'None'}`);
      console.log(`Debug: Felix children: ${felix?.children?.map(p => `${p.First_Name}(${p.ID})`).join(', ') || 'None'}`);
      console.log(`Debug: Anicia parents: ${anicia?.parents?.map(p => `${p.First_Name}(${p.ID})`).join(', ') || 'None'}`);
      console.log(`Debug: Basilia children: ${basilia?.children?.map(p => `${p.First_Name}(${p.ID})`).join(', ') || 'None'}`);
      
      // Debug the relationship calculation
      const aniciaAncestors = calculator.getAllAncestors(anicia);
      console.log(`Debug: Anicia's ancestors: ${aniciaAncestors.map(a => `${a.person.First_Name}(${a.person.ID}):d${a.distance}`).join(', ')}`);
      
      const relationship = calculator.calculateRelationship(basilia.ID, anicia.ID);
      console.log(`Debug: Relationship result: ${relationship}`);
      expect(relationship).toBe('grandparent');
    });

    test('Anicia → Basilia: grandchild', () => {
      const anicia = findPerson('anicia');
      const basilia = findPerson('basilia');
      
      const relationship = calculator.calculateRelationship(anicia.ID, basilia.ID);
      expect(relationship).toBe('grandchild');
    });

    test('Anicia → Hilaria: cousin', () => {
      const anicia = findPerson('anicia');
      const hilaria = findPerson('hilaria');
      
      const relationship = calculator.calculateRelationship(anicia.ID, hilaria.ID);
      expect(relationship).toBe('cousin');
    });

    test('Fortunato → Tomasa: parent', () => {
      const fortunato = findPerson('fortunato');
      const tomasa = findPerson('tomasa');
      
      const relationship = calculator.calculateRelationship(fortunato.ID, tomasa.ID);
      expect(relationship).toBe('parent');
    });

    test('Tomasa → Fortunato: child', () => {
      const tomasa = findPerson('tomasa');
      const fortunato = findPerson('fortunato');
      
      const relationship = calculator.calculateRelationship(tomasa.ID, fortunato.ID);
      expect(relationship).toBe('child');
    });
  });

  describe('Additional Relationship Validation', () => {
    test('Basilia → Hilaria: grandparent', () => {
      const basilia = findPerson('basilia');
      const hilaria = findPerson('hilaria');
      
      const relationship = calculator.calculateRelationship(basilia.ID, hilaria.ID);
      expect(relationship).toBe('grandparent');
    });

    test('Isabel → Hilaria: aunt/uncle', () => {
      const isabel = findPerson('isabel');
      const hilaria = findPerson('hilaria');
      
      const relationship = calculator.calculateRelationship(isabel.ID, hilaria.ID);
      expect(relationship).toBe('aunt/uncle');
    });

    test('Hilaria → Isabel: niece/nephew', () => {
      const hilaria = findPerson('hilaria');
      const isabel = findPerson('isabel');
      
      const relationship = calculator.calculateRelationship(hilaria.ID, isabel.ID);
      expect(relationship).toBe('niece/nephew');
    });

    test('Isabel → Tomasa: sibling', () => {
      const isabel = findPerson('isabel');
      const tomasa = findPerson('tomasa');
      
      const relationship = calculator.calculateRelationship(isabel.ID, tomasa.ID);
      expect(relationship).toBe('sibling');
    });

    test('Basilia → Fortunato: spouse', () => {
      const basilia = findPerson('basilia');
      const fortunato = findPerson('fortunato');
      
      let relationship = calculator.calculateRelationship(basilia.ID, fortunato.ID);
      expect(relationship).toBe('spouse');

      relationship = calculator.calculateRelationship(fortunato.ID, basilia.ID);
      expect(relationship).toBe('spouse');
    });

    test('Pablo (Pabling) → Anicia: spouse', () => {
      const pabling = findPerson('pabling');
      const anicia = findPerson('anicia');

      let relationship = calculator.calculateRelationship(pabling.ID, anicia.ID);
      expect(relationship).toBe('spouse');

      relationship = calculator.calculateRelationship(anicia.ID, pabling.ID);
      expect(relationship).toBe('spouse');
    });

    test('Basilia → Maxima: parent', () => {
      const basilia = findPerson('basilia');
      const maxima = findPerson('maxima');

      let relationship = calculator.calculateRelationship(basilia.ID, maxima.ID);
      expect(relationship).toBe('parent');

      relationship = calculator.calculateRelationship(maxima.ID, basilia.ID);
      expect(relationship).toBe('child');
    });

    test('Tato → Joaquin: parent', () => {
      const tato = findPerson('tato');
      const joaquin = findPerson('joaquin');

      let relationship = calculator.calculateRelationship(tato.ID, joaquin.ID);
      expect(relationship).toBe('parent');

      relationship = calculator.calculateRelationship(joaquin.ID, tato.ID);
      expect(relationship).toBe('child');
    });

  });

  describe('Relationship Context Tests', () => {
    test('Relationships should not have incorrect in-law context', () => {
      const basilia = findPerson('basilia');
      const tomasa = findPerson('tomasa');
      
      const relationshipWithContext = calculator.getRelationshipWithContext(basilia.ID, tomasa.ID);
      expect(relationshipWithContext.relationship).toBe('parent');
      expect(relationshipWithContext.context).toBe(''); // Should not be marked as in-law
    });

    test('Full description should be grammatically correct', () => {
      const basilia = findPerson('basilia');
      const hilaria = findPerson('hilaria');
      
      const relationshipWithContext = calculator.getRelationshipWithContext(basilia.ID, hilaria.ID);
      expect(relationshipWithContext.fullDescription).toContain('grandparent');
      expect(relationshipWithContext.fullDescription).toMatch(/^[A-Z]/); // Should start with capital letter
    });
  });

  describe('Edge Cases', () => {
    test('Self relationship should return "self"', () => {
      const basilia = findPerson('basilia');
      
      const relationship = calculator.calculateRelationship(basilia.ID, basilia.ID);
      expect(relationship).toBe('self');
    });

    test('Unknown person should return "unknown"', () => {
      const basilia = findPerson('basilia');
      
      const relationship = calculator.calculateRelationship(basilia.ID, '99999');
      expect(relationship).toBe('unknown');
    });

    test('Path finding should work for related people', () => {
      const basilia = findPerson('basilia');
      const hilaria = findPerson('hilaria');
      
      const path = calculator.findShortestPath(basilia.ID, hilaria.ID);
      expect(path).toBeTruthy();
      expect(path.length).toBeGreaterThan(1);
      expect(path[0].ID).toBe(basilia.ID);
      expect(path[path.length - 1].ID).toBe(hilaria.ID);
    });
  });

  describe('Data Integrity', () => {
    test('Family tree should have expected number of people', () => {
      expect(familyData.length).toBeGreaterThan(50); // Should have substantial family data
    });

    test('All people should have valid IDs', () => {
      familyData.forEach(person => {
        expect(person.ID).toBeDefined();
        expect(typeof person.ID).toBe('string');
      });
    });

    test('Key family members should be present', () => {
      const keyMembers = ['basilia', 'fortunato', 'hilaria', 'tomasa', 'isabel'];
      keyMembers.forEach(name => {
        expect(() => findPerson(name)).not.toThrow();
      });
    });

    test('Parent-child relationships should be bidirectional', () => {
      const basilia = findPerson('basilia');
      const tomasa = findPerson('tomasa');
      
      // Basilia should have Tomasa as a child
      expect(basilia.children.some(child => child.ID === tomasa.ID)).toBe(true);
      
      // Tomasa should have Basilia as a parent
      expect(tomasa.parents.some(parent => parent.ID === basilia.ID)).toBe(true);
    });
  });
});