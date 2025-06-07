"use client";
import { useState, useEffect } from 'react';
import { buildFamilyTree } from '../lib/sheetsApi';

export default function FamilyTree({ familyName }) {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await buildFamilyTree(familyName);
        setFamilyData(data);
      } catch (error) {
        console.error('Error loading family data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [familyName]);

  const toggleExpand = (personId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId);
    } else {
      newExpanded.add(personId);
    }
    setExpandedNodes(newExpanded);
  };

  const PersonNode = ({ person, level = 0 }) => {
    const hasChildren = person.children && person.children.length > 0;
    const isExpanded = expandedNodes.has(person.ID);
    
    return (
      <div className={`ml-${level * 4} mb-4`}>
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedPerson?.ID === person.ID 
              ? 'border-lime-800 bg-lime-50' 
              : 'border-gray-300 bg-white hover:border-lime-600 hover:bg-lime-25'
          }`}
          onClick={() => setSelectedPerson(person)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {person.First_Name} {person.Last_Name}
              </h3>
              {person.Birth_Date && (
                <p className="text-sm text-gray-600">Born: {person.Birth_Date}</p>
              )}
              {person.Death_Date && (
                <p className="text-sm text-gray-600">Died: {person.Death_Date}</p>
              )}
              {person.spouse && (
                <p className="text-sm text-blue-600">
                  Spouse: {person.spouse.First_Name} {person.spouse.Last_Name}
                </p>
              )}
            </div>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(person.ID);
                }}
                className="ml-4 px-3 py-1 bg-lime-800 text-white rounded hover:bg-lime-700"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-2 ml-6 border-l-2 border-gray-200 pl-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Children:</h4>
            {person.children.map(child => (
              <PersonNode key={child.ID} person={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const TreeView = () => {
    // Find root nodes (people with no parents)
    const rootNodes = familyData.filter(person => 
      !person.parents || person.parents.length === 0
    );

    if (rootNodes.length === 0 && familyData.length > 0) {
      // If no clear root, show all people
      return (
        <div className="space-y-4">
          {familyData.map(person => (
            <PersonNode key={person.ID} person={person} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {rootNodes.map(person => (
          <PersonNode key={person.ID} person={person} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading family tree data...</div>
      </div>
    );
  }

  if (familyData.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">No family data found.</p>
        <p className="text-sm text-gray-500 mt-2">
          Please check that the Google Spreadsheet is accessible and contains data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex gap-6">
        {/* Tree View */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4">
            {familyName ? `${familyName} Family Tree` : 'Family Tree'}
          </h3>
          <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
            <TreeView />
          </div>
        </div>
        
        {/* Detail Panel */}
        {selectedPerson && (
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Person Details</h3>
            <div className="space-y-3">
              <div>
                <strong>Name:</strong> {selectedPerson.First_Name} {selectedPerson.Last_Name}
              </div>
              {selectedPerson.Birth_Date && (
                <div>
                  <strong>Birth Date:</strong> {selectedPerson.Birth_Date}
                </div>
              )}
              {selectedPerson.Death_Date && (
                <div>
                  <strong>Death Date:</strong> {selectedPerson.Death_Date}
                </div>
              )}
              {selectedPerson.Birth_Place && (
                <div>
                  <strong>Birth Place:</strong> {selectedPerson.Birth_Place}
                </div>
              )}
              {selectedPerson.parents && selectedPerson.parents.length > 0 && (
                <div>
                  <strong>Parents:</strong>
                  <ul className="ml-4 mt-1">
                    {selectedPerson.parents.map(parent => (
                      <li key={parent.ID} className="text-sm">
                        {parent.First_Name} {parent.Last_Name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedPerson.children && selectedPerson.children.length > 0 && (
                <div>
                  <strong>Children:</strong>
                  <ul className="ml-4 mt-1">
                    {selectedPerson.children.map(child => (
                      <li key={child.ID} className="text-sm">
                        {child.First_Name} {child.Last_Name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedPerson.spouse && (
                <div>
                  <strong>Spouse:</strong> {selectedPerson.spouse.First_Name} {selectedPerson.spouse.Last_Name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}