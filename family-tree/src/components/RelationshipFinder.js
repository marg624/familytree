"use client";
import { useState, useEffect } from 'react';
import { createRelationshipCalculator } from '../lib/relationshipCalculator';

export default function RelationshipFinder({ familyData, selectedPerson, onPersonSelect }) {
  const [person1, setPerson1] = useState(selectedPerson || null);
  const [person2, setPerson2] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [relationship, setRelationship] = useState(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [calculator, setCalculator] = useState(null);

  useEffect(() => {
    if (familyData.length > 0) {
      setCalculator(createRelationshipCalculator(familyData));
    }
  }, [familyData]);

  useEffect(() => {
    if (selectedPerson) {
      setPerson1(selectedPerson);
      setSearchTerm1(`${selectedPerson.First_Name} ${selectedPerson.Last_Name}`);
    }
  }, [selectedPerson]);

  const filteredPeople1 = familyData.filter(person => {
    if (!searchTerm1) return true;
    const fullName = `${person.First_Name} ${person.Last_Name}`.toLowerCase();
    return fullName.includes(searchTerm1.toLowerCase());
  });

  const filteredPeople2 = familyData.filter(person => {
    if (!searchTerm2) return true;
    const fullName = `${person.First_Name} ${person.Last_Name}`.toLowerCase();
    return fullName.includes(searchTerm2.toLowerCase());
  });

  const calculateRelationship = () => {
    if (!person1 || !person2 || !calculator) {
      setRelationship(null);
      return;
    }

    const result = calculator.getRelationshipWithContext(person1.ID, person2.ID);
    setRelationship(result);
  };

  useEffect(() => {
    calculateRelationship();
  }, [person1, person2, calculator]);

  const selectPerson1 = (person) => {
    setPerson1(person);
    setSearchTerm1(`${person.First_Name} ${person.Last_Name}`);
    setShowDropdown1(false);
    if (onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const selectPerson2 = (person) => {
    setPerson2(person);
    setSearchTerm2(`${person.First_Name} ${person.Last_Name}`);
    setShowDropdown2(false);
  };

  const clearSelection = () => {
    setPerson1(null);
    setPerson2(null);
    setSearchTerm1('');
    setSearchTerm2('');
    setRelationship(null);
    setShowDropdown1(false);
    setShowDropdown2(false);
  };

  const swapPeople = () => {
    const temp = person1;
    const tempSearch = searchTerm1;
    setPerson1(person2);
    setPerson2(temp);
    setSearchTerm1(searchTerm2);
    setSearchTerm2(tempSearch);
  };

  const getRelationshipColor = (rel) => {
    if (!rel) return 'text-slate-600';
    
    const relationshipType = rel.relationship.toLowerCase();
    if (relationshipType.includes('parent') || relationshipType.includes('child')) {
      return 'text-blue-600';
    } else if (relationshipType.includes('sibling')) {
      return 'text-purple-600';
    } else if (relationshipType.includes('cousin')) {
      return 'text-emerald-600';
    } else if (relationshipType.includes('spouse')) {
      return 'text-pink-600';
    } else if (relationshipType.includes('grand')) {
      return 'text-indigo-600';
    } else {
      return 'text-amber-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 105.656-5.656l-1.102 1.102m-6.364 6.364L8 12l4-4" />
          </svg>
          Relationship Finder
        </h3>
        <button
          onClick={clearSelection}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          title="Clear all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Person 1 Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Person
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a person..."
              value={searchTerm1}
              onChange={(e) => {
                setSearchTerm1(e.target.value);
                setShowDropdown1(true);
                if (!e.target.value) setPerson1(null);
              }}
              onFocus={() => setShowDropdown1(true)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
            {person1 && (
              <div className="absolute right-2 top-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {showDropdown1 && searchTerm1 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredPeople1.slice(0, 10).map(person => (
                <button
                  key={person.ID}
                  onClick={() => selectPerson1(person)}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-900">
                    {person.First_Name} {person.Last_Name}
                  </div>
                  {person.Birth_Date && (
                    <div className="text-xs text-slate-500">Born {person.Birth_Date}</div>
                  )}
                </button>
              ))}
              {filteredPeople1.length === 0 && (
                <div className="px-4 py-2 text-slate-500 text-sm">No people found</div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapPeople}
            disabled={!person1 || !person2}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Swap people"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Person 2 Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Second Person
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for another person..."
              value={searchTerm2}
              onChange={(e) => {
                setSearchTerm2(e.target.value);
                setShowDropdown2(true);
                if (!e.target.value) setPerson2(null);
              }}
              onFocus={() => setShowDropdown2(true)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            />
            {person2 && (
              <div className="absolute right-2 top-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {showDropdown2 && searchTerm2 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredPeople2.slice(0, 10).map(person => (
                <button
                  key={person.ID}
                  onClick={() => selectPerson2(person)}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                >
                  <div className="font-medium text-slate-900">
                    {person.First_Name} {person.Last_Name}
                  </div>
                  {person.Birth_Date && (
                    <div className="text-xs text-slate-500">Born {person.Birth_Date}</div>
                  )}
                </button>
              ))}
              {filteredPeople2.length === 0 && (
                <div className="px-4 py-2 text-slate-500 text-sm">No people found</div>
              )}
            </div>
          )}
        </div>

        {/* Relationship Result */}
        {person1 && person2 && relationship && (
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">Relationship</div>
              <div className={`text-lg font-semibold ${getRelationshipColor(relationship)}`}>
                {relationship.relationship}
                {relationship.context && (
                  <span className="text-sm text-slate-500 ml-1">
                    {relationship.context}
                  </span>
                )}
              </div>
              {relationship.fullDescription && (
                <div className="text-sm text-slate-600 mt-2 italic">
                  {relationship.fullDescription}
                </div>
              )}
            </div>
          </div>
        )}

        {person1 && person2 && relationship?.relationship === 'not related' && (
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-center">
              <div className="text-amber-800 font-medium">Not Related</div>
              <div className="text-sm text-amber-600 mt-1">
                No family connection found between these people
              </div>
            </div>
          </div>
        )}

        {person1 && person2 && relationship?.relationship === 'self' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-blue-800 font-medium">Same Person</div>
              <div className="text-sm text-blue-600 mt-1">
                You selected the same person twice
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside handlers */}
      {(showDropdown1 || showDropdown2) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowDropdown1(false);
            setShowDropdown2(false);
          }}
        />
      )}
    </div>
  );
}