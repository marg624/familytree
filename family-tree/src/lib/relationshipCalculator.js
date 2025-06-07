// Relationship Calculator for Family Tree
// Handles up to 7+ generations with complex relationships

export class RelationshipCalculator {
  constructor(familyData) {
    this.familyData = familyData;
    this.personMap = new Map();
    this.buildPersonMap();
  }

  buildPersonMap() {
    this.familyData.forEach(person => {
      this.personMap.set(person.ID, person);
    });
  }

  // Find the relationship between two people
  calculateRelationship(person1Id, person2Id) {
    if (person1Id === person2Id) {
      return "self";
    }

    const person1 = this.personMap.get(person1Id);
    const person2 = this.personMap.get(person2Id);

    if (!person1 || !person2) {
      console.log(`Debug: Person not found - P1: ${person1Id} (${person1 ? 'found' : 'missing'}), P2: ${person2Id} (${person2 ? 'found' : 'missing'})`);
      return "unknown";
    }

    // Check for direct relationships first
    const directRelationship = this.checkDirectRelationship(person1, person2);
    if (directRelationship) {
      return directRelationship;
    }

    // Find common ancestors
    const commonAncestors = this.findCommonAncestors(person1, person2);
    
    if (commonAncestors.length === 0) {
      return "not related";
    }

    // Calculate relationship through common ancestors
    return this.calculateRelationshipThroughAncestors(person1, person2, commonAncestors);
  }

  checkDirectRelationship(person1, person2) {
    // Check if they are spouses
    if (person1.spouse && person1.spouse.ID === person2.ID) {
      return "spouse";
    }
    if (person2.spouse && person2.spouse.ID === person1.ID) {
      return "spouse";
    }

    // Check parent-child relationships
    if (person1.children && person1.children.some(child => child.ID === person2.ID)) {
      return "parent";  // person1 is parent of person2
    }
    if (person2.children && person2.children.some(child => child.ID === person1.ID)) {
      return "child";   // person1 is child of person2
    }

    // Check if they are siblings (same parents)
    if (this.areSiblings(person1, person2)) {
      return "sibling";
    }

    return null;
  }

  areSiblings(person1, person2) {
    if (!person1.parents || !person2.parents || 
        person1.parents.length === 0 || person2.parents.length === 0) {
      return false;
    }

    // Check if they share at least one parent
    return person1.parents.some(parent1 => 
      person2.parents.some(parent2 => parent1.ID === parent2.ID)
    );
  }

  findCommonAncestors(person1, person2) {
    const ancestors1 = this.getAllAncestors(person1);
    const ancestors2 = this.getAllAncestors(person2);

    ancestors1.push({ person: person1, distance: 0 });
    ancestors2.push({ person: person2, distance: 0 });

    const commonAncestors = [];
    
    // Note: Removed special case logic for direct ancestors as it was causing issues
    // The regular common ancestor logic below should handle all cases correctly
    
    // Check for shared ancestors
    ancestors1.forEach(ancestor1 => {
      ancestors2.forEach(ancestor2 => {
        if (ancestor1.person.ID === ancestor2.person.ID) {
          commonAncestors.push({
            ancestor: ancestor1.person,
            distance1: ancestor1.distance,
            distance2: ancestor2.distance
          });
        }
      });
    });

    // Sort by closest common ancestor
    commonAncestors.sort((a, b) => (a.distance1 + a.distance2) - (b.distance1 + b.distance2));
    
    return commonAncestors;
  }

  getAllAncestors(person, distance = 0, visited = new Set()) {
    if (visited.has(person.ID)) {
      return [];
    }
    visited.add(person.ID);

    let ancestors = [];
    
    if (person.parents && person.parents.length > 0) {
      person.parents.forEach(parent => {
        ancestors.push({ person: parent, distance: distance + 1 });
        // Create a new visited set for each recursive call to avoid blocking valid paths
        const newVisited = new Set(visited);
        ancestors = ancestors.concat(this.getAllAncestors(parent, distance + 1, newVisited));
      });
    }

    return ancestors;
  }

  calculateRelationshipThroughAncestors(person1, person2, commonAncestors) {
    if (commonAncestors.length === 0) {
      return "not related";
    }

    const closest = commonAncestors[0];
    const distance1 = closest.distance1;
    const distance2 = closest.distance2;

    // Special cases for direct ancestor/descendant relationships
    if (distance1 === 0 && distance2 > 0) {
      // person1 is an ancestor of person2
      return this.getDescendantRelationship(distance2 - 1, "ancestor");
    }
    if (distance2 === 0 && distance1 > 0) {
      // person2 is an ancestor of person1
      return this.getDescendantRelationship(distance1 - 1, "descendant");
    }

    // Special cases for direct descendant relationships (when not self)
    // Only apply when the difference is more than 1 generation (not aunt/uncle case)
    if (distance1 === 1 && distance2 > 2) {
      return this.getDescendantRelationship(distance2 - 1, "descendant");
    }
    if (distance2 === 1 && distance1 > 2) {
      return this.getDescendantRelationship(distance1 - 1, "ancestor");
    }

    // Aunt/Uncle and Niece/Nephew relationships
    if (distance1 === 1 && distance2 === 2) {
      // person1 is sibling of person2's parent → person1 is person2's aunt/uncle
      return "aunt/uncle";
    }
    if (distance1 === 2 && distance2 === 1) {
      // person1 is child of person2's sibling → person1 is person2's niece/nephew
      return "niece/nephew";
    }

    // Both are descendants of the common ancestor
    if (distance1 === distance2) {
      // Same generation - cousins
      if (distance1 === 2) {
        return "cousin";
      } else if (distance1 === 3) {
        return "2nd cousin";
      } else if (distance1 === 4) {
        return "3rd cousin";
      } else if (distance1 > 4) {
        return `${this.getOrdinal(distance1 - 1)} cousin`;
      }
    } else {
      // Different generations - removed cousins
      const minDistance = Math.min(distance1, distance2);
      const maxDistance = Math.max(distance1, distance2);
      const removal = maxDistance - minDistance;

      if (minDistance === 2) {
        return `cousin ${removal}x removed`;
      } else if (minDistance === 3) {
        return `2nd cousin ${removal}x removed`;
      } else if (minDistance === 4) {
        return `3rd cousin ${removal}x removed`;
      } else {
        return `${this.getOrdinal(minDistance - 1)} cousin ${removal}x removed`;
      }
    }

    return "distant relative";
  }

  getDescendantRelationship(generations, direction) {
    if (generations === 1) {
      return direction === "ancestor" ? "grandparent" : "grandchild";
    } else if (generations === 2) {
      return direction === "ancestor" ? "great-grandparent" : "great-grandchild";
    } else if (generations === 3) {
      return direction === "ancestor" ? "great-great-grandparent" : "great-great-grandchild";
    } else {
      const greats = "great-".repeat(generations - 1);
      return direction === "ancestor" ? `${greats}grandparent` : `${greats}grandchild`;
    }
  }

  getOrdinal(number) {
    const ordinals = {
      1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th",
      6: "6th", 7: "7th", 8: "8th", 9: "9th", 10: "10th"
    };
    return ordinals[number] || `${number}th`;
  }

  // Get relationship with additional context
  getRelationshipWithContext(person1Id, person2Id) {
    const relationship = this.calculateRelationship(person1Id, person2Id);
    const person1 = this.personMap.get(person1Id);
    const person2 = this.personMap.get(person2Id);

    if (!person1 || !person2) {
      return { relationship: "unknown", context: "" };
    }

    let context = "";
    
    // Add context for in-law relationships
    if (this.isInLaw(person1, person2)) {
      context = " (in-law)";
    }

    // Add context for step relationships
    if (this.isStepRelationship(person1, person2)) {
      context = " (step)";
    }

    // Add context for half relationships
    if (this.isHalfRelationship(person1, person2)) {
      context = " (half)";
    }

    return {
      relationship: relationship,
      context: context,
      fullDescription: `${person1.First_Name} is ${person2.First_Name}'s ${relationship}${context}`
    };
  }

  isInLaw(person1, person2) {
    // Check if they have a direct blood relationship first - if so, they're not in-laws
    const directRelationship = this.checkDirectRelationship(person1, person2);
    if (directRelationship) { //&& directRelationship !== 'spouse') {
      return false; // Direct blood relatives are not in-laws
    }

    // Check if person2 is spouse's family member (but not person1's direct relative)
    if (person1.spouse) {
      const spouseFamily = this.getAllRelatives(person1.spouse);
      if (spouseFamily.some(relative => relative.ID === person2.ID)) {
        // Make sure person2 is not person1's direct blood relative
        const isDirectRelative = this.isDirectBloodRelative(person1, person2);
        return !isDirectRelative;
      }
    }

    // Check if person1 is spouse's family member (but not person2's direct relative)
    if (person2.spouse) {
      const spouseFamily = this.getAllRelatives(person2.spouse);
      if (spouseFamily.some(relative => relative.ID === person1.ID)) {
        // Make sure person1 is not person2's direct blood relative
        const isDirectRelative = this.isDirectBloodRelative(person2, person1);
        return !isDirectRelative;
      }
    }

    return false;
  }

  isDirectBloodRelative(person1, person2) {
    // Check for direct parent-child relationships
    if (person1.children && person1.children.some(child => child.ID === person2.ID)) {
      return true;
    }
    if (person1.parents && person1.parents.some(parent => parent.ID === person2.ID)) {
      return true;
    }
    
    // Check for siblings (same parents)
    if (this.areSiblings(person1, person2)) {
      return true;
    }
    
    // Check for grandparent/grandchild relationships
    const commonAncestors = this.findCommonAncestors(person1, person2);
    if (commonAncestors.length > 0) {
      return true; // Any common ancestor means they're blood relatives
    }
    
    return false;
  }

  isStepRelationship(person1, person2) {
    // This would require additional data about marriages and step-relationships
    // For now, return false, but this could be enhanced with more complex family data
    return false;
  }

  isHalfRelationship(person1, person2) {
    if (!this.areSiblings(person1, person2)) {
      return false;
    }

    // Check if they share exactly one parent (half siblings)
    if (!person1.parents || !person2.parents) {
      return false;
    }

    const sharedParents = person1.parents.filter(parent1 => 
      person2.parents.some(parent2 => parent1.ID === parent2.ID)
    );

    return sharedParents.length === 1 && 
           (person1.parents.length === 2 || person2.parents.length === 2);
  }

  getAllRelatives(person, visited = new Set()) {
    if (visited.has(person.ID)) {
      return [];
    }
    visited.add(person.ID);

    let relatives = [];

    // Add parents
    if (person.parents) {
      relatives = relatives.concat(person.parents);
      person.parents.forEach(parent => {
        relatives = relatives.concat(this.getAllRelatives(parent, new Set(visited)));
      });
    }

    // Add children
    if (person.children) {
      relatives = relatives.concat(person.children);
      person.children.forEach(child => {
        relatives = relatives.concat(this.getAllRelatives(child, new Set(visited)));
      });
    }

    // Add spouse
    if (person.spouse) {
      relatives.push(person.spouse);
    }

    return relatives;
  }

  // Find the shortest path between two people (for debugging)
  findShortestPath(person1Id, person2Id) {
    const person1 = this.personMap.get(person1Id);
    const person2 = this.personMap.get(person2Id);

    if (!person1 || !person2) {
      return null;
    }

    const queue = [{ person: person1, path: [person1] }];
    const visited = new Set([person1.ID]);

    while (queue.length > 0) {
      const { person, path } = queue.shift();

      if (person.ID === person2.ID) {
        return path;
      }

      // Add connected people (parents, children, spouse)
      const connections = [];
      
      if (person.parents) connections.push(...person.parents);
      if (person.children) connections.push(...person.children);
      if (person.spouse) connections.push(person.spouse);

      connections.forEach(connected => {
        if (!visited.has(connected.ID)) {
          visited.add(connected.ID);
          queue.push({
            person: connected,
            path: [...path, connected]
          });
        }
      });
    }

    return null;
  }
}

// Utility function to create relationship calculator
export function createRelationshipCalculator(familyData) {
  return new RelationshipCalculator(familyData);
}

// Example relationships for testing
export const EXAMPLE_RELATIONSHIPS = {
  "parent": "Fortunato is Isabel's parent",
  "child": "Isabel is Fortunato's child", 
  "sibling": "Isabel and Tomasa are siblings",
  "spouse": "Fortunato and Basilia are spouses",
  "grandparent": "Fortunato is Tranquilino's grandparent",
  "grandchild": "Tranquilino is Fortunato's grandchild",
  "great-grandparent": "Fortunato is a great-grandparent to some descendants",
  "cousin": "Two people with the same grandparents are cousins",
  "2nd cousin": "Two people with the same great-grandparents are 2nd cousins",
  "cousin 1x removed": "A cousin's child is a cousin once removed"
};