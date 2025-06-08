"use client";
import { useState, useEffect } from 'react';
import { buildFamilyTree } from '../lib/sheetsApi';
import { createRelationshipCalculator } from '../lib/relationshipCalculator';
import RelationshipFinder from './RelationshipFinder';

export default function FamilyTree({ familyName }) {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showRelationshipFinder, setShowRelationshipFinder] = useState(false);
  const [relationshipCalculator, setRelationshipCalculator] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await buildFamilyTree(familyName);
        setFamilyData(data);
        
        // Create relationship calculator
        if (data.length > 0) {
          setRelationshipCalculator(createRelationshipCalculator(data));
        }
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

  // Filter people based on search term
  const filteredData = familyData.filter(person => {
    if (!searchTerm) return true;
    const fullName = `${person.First_Name} ${person.Last_Name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const PersonCard = ({ person, level = 0, isSearchResult = false }) => {
    const hasChildren = person.children && person.children.length > 0;
    const isExpanded = expandedNodes.has(person.ID);
    const isSelected = selectedPerson?.ID === person.ID;
    
    // Better mobile indentation - use smaller increments and max out sooner
    const mobileIndent = Math.min(level * 2, 8); // Max 8 (32px)
    const desktopIndent = Math.min(level * 6, 24); // Max 24 (96px)
    
    return (
      <div className={`${!isSearchResult ? `ml-${mobileIndent} sm:ml-${desktopIndent}` : ''} mb-3 sm:mb-4`}>
        <div 
          className={`relative group bg-white border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            isSelected 
              ? 'border-emerald-500 bg-emerald-50 shadow-md' 
              : 'border-slate-200 hover:border-emerald-300'
          }`}
          onClick={() => setSelectedPerson(person)}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Photo placeholder - smaller on mobile */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                {person.Photo_URL ? (
                  <img 
                    src={person.Photo_URL} 
                    alt={`${person.First_Name} ${person.Last_Name}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(person.ID);
                  }}
                  className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
                    isExpanded 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 text-slate-600 hover:bg-emerald-200'
                  }`}
                  title={isExpanded ? 'Collapse family' : 'Expand to see family'}
                >
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Person info - better mobile layout */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                {person.First_Name} {person.Last_Name}
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                {person.Birth_Date && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                    Born {person.Birth_Date}
                  </span>
                )}
                {person.spouse && !isExpanded && (
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full whitespace-nowrap">
                    ♥ {person.spouse.First_Name} {person.spouse.Last_Name}
                  </span>
                )}
              </div>
            </div>

            {/* Expand indicator */}
            {isSelected && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Children with Parents Header - better mobile indentation */}
        {hasChildren && isExpanded && (
          <div className="mt-3 sm:mt-4 ml-3 sm:ml-6 border-l-2 border-slate-200 pl-3 sm:pl-6">
            {/* Spouse Section */}
            {person.spouse && (
              <div className="mb-4">
                <h4 className="text-xs sm:text-sm font-medium text-slate-500 mb-2 flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Spouse
                </h4>
                <div 
                  className="bg-white border-2 border-pink-200 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-pink-50 transition-colors mb-4"
                  onClick={() => setSelectedPerson(person.spouse)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                      {person.spouse.Photo_URL ? (
                        <img 
                          src={person.spouse.Photo_URL} 
                          alt={`${person.spouse.First_Name} ${person.spouse.Last_Name}`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-pink-900 text-sm leading-tight">
                        {person.spouse.First_Name} {person.spouse.Last_Name}
                      </h5>
                      {person.spouse.Birth_Date && (
                        <p className="text-xs text-pink-600">Born {person.spouse.Birth_Date}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Children Section */}
            <h4 className="text-xs sm:text-sm font-medium text-slate-500 mb-2 sm:mb-3 flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Children ({person.children.length})
            </h4>
            {person.children.map(child => (
              <PersonCard key={child.ID} person={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };


  const TreeView = () => {
    const displayData = searchTerm ? filteredData : familyData;
    
    if (searchTerm) {
      return (
        <div className="space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 px-1">
            Found {filteredData.length} people matching "{searchTerm}"
          </div>
          {filteredData.map(person => (
            <PersonCard key={person.ID} person={person} isSearchResult={true} />
          ))}
        </div>
      );
    }

    // Find root nodes (people with no parents)
    const rootNodes = displayData.filter(person => 
      !person.parents || person.parents.length === 0
    );

    if (rootNodes.length === 0 && displayData.length > 0) {
      return (
        <div className="space-y-4">
          {displayData.map(person => (
            <PersonCard key={person.ID} person={person} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {rootNodes.map(person => (
          <PersonCard key={person.ID} person={person} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <div className="text-lg font-medium text-slate-700">Loading family tree...</div>
        <div className="text-sm text-slate-500">Fetching data from spreadsheet</div>
      </div>
    );
  }

  if (familyData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No family data found</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Please check that the Google Spreadsheet is accessible and contains data in the correct format.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {familyName} Family Tree
            </h2>
            <p className="text-slate-600 mt-1">
              {filteredData.length} family member{filteredData.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Search and Relationship Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative min-w-0 flex-1 sm:flex-initial">
              {!isSearchExpanded ? (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="w-full sm:w-auto px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center shadow-sm border-2 bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Search Family</span>
                  <span className="sm:hidden">Search</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search family members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => {
                      if (!searchTerm) {
                        setIsSearchExpanded(false);
                      }
                    }}
                    autoFocus
                    className="w-full pl-10 pr-10 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchExpanded(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 text-xs text-slate-600 bg-white px-3 py-1 rounded border shadow-sm">
                      {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Relationship Finder */}
            <button
              onClick={() => setShowRelationshipFinder(!showRelationshipFinder)}
              className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex items-center shadow-sm border-2 ${
                showRelationshipFinder 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 105.656-5.656l-1.102 1.102m-6.364 6.364L8 12l4-4" />
              </svg>
              <span className="hidden sm:inline">{showRelationshipFinder ? 'Hide Relationships' : 'Find Relationships'}</span>
              <span className="sm:hidden">Relations</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${
                showRelationshipFinder ? 'rotate-180' : ''
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Relationship Finder */}
      {showRelationshipFinder && (
        <div className="mb-8">
          <RelationshipFinder 
            familyData={familyData}
            selectedPerson={selectedPerson}
            onPersonSelect={setSelectedPerson}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex gap-8">
        {/* Tree View */}
        <div className={`${selectedPerson ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-6 min-h-96 overflow-x-auto">
            <TreeView />
          </div>
        </div>
        
        {/* Detail Panel */}
        {selectedPerson && (
          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Person Details</h3>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Photo */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    {selectedPerson.Photo_URL ? (
                      <img 
                        src={selectedPerson.Photo_URL} 
                        alt={`${selectedPerson.First_Name} ${selectedPerson.Last_Name}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900">
                    {selectedPerson.First_Name} {selectedPerson.Last_Name}
                  </h4>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  {selectedPerson.Birth_Date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Birth Date:</span>
                      <span className="text-slate-600">{selectedPerson.Birth_Date}</span>
                    </div>
                  )}
                  {selectedPerson.Death_Date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Death Date:</span>
                      <span className="text-slate-600">{selectedPerson.Death_Date}</span>
                    </div>
                  )}
                  {selectedPerson.Birth_Place && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Birth Place:</span>
                      <span className="text-slate-600">{selectedPerson.Birth_Place}</span>
                    </div>
                  )}
                </div>

                {/* Relationships */}
                {selectedPerson.spouse && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">Spouse</h5>
                    <div 
                      className="bg-pink-50 rounded-lg p-3 cursor-pointer hover:bg-pink-100 transition-colors"
                      onClick={() => setSelectedPerson(selectedPerson.spouse)}
                    >
                      <div className="font-medium text-pink-900">
                        {selectedPerson.spouse.First_Name} {selectedPerson.spouse.Last_Name}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPerson.parents && selectedPerson.parents.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">Parents</h5>
                    <div className="space-y-2">
                      {selectedPerson.parents.map(parent => {
                        const relationship = relationshipCalculator ? 
                          relationshipCalculator.calculateRelationship(selectedPerson.ID, parent.ID) : '';
                        return (
                          <div 
                            key={parent.ID} 
                            className="bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                            onClick={() => setSelectedPerson(parent)}
                          >
                            <div className="font-medium text-blue-900">
                              {parent.First_Name} {parent.Last_Name}
                            </div>
                            {relationship && (
                              <div className="text-xs text-blue-600 capitalize">
                                {relationship}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedPerson.children && selectedPerson.children.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">
                      Children ({selectedPerson.children.length})
                    </h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedPerson.children.map(child => {
                        const relationship = relationshipCalculator ? 
                          relationshipCalculator.calculateRelationship(selectedPerson.ID, child.ID) : '';
                        return (
                          <div 
                            key={child.ID} 
                            className="bg-emerald-50 rounded-lg p-3 cursor-pointer hover:bg-emerald-100 transition-colors"
                            onClick={() => setSelectedPerson(child)}
                          >
                            <div className="font-medium text-emerald-900">
                              {child.First_Name} {child.Last_Name}
                            </div>
                            {relationship && (
                              <div className="text-xs text-emerald-600 capitalize">
                                {relationship}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile detail modal */}
      {selectedPerson && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Person Details</h3>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Same content as desktop detail panel */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                    {selectedPerson.Photo_URL ? (
                      <img 
                        src={selectedPerson.Photo_URL} 
                        alt={`${selectedPerson.First_Name} ${selectedPerson.Last_Name}`}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <svg className="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900">
                    {selectedPerson.First_Name} {selectedPerson.Last_Name}
                  </h4>
                </div>

                <div className="space-y-3 text-sm">
                  {selectedPerson.Birth_Date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Birth Date:</span>
                      <span className="text-slate-600">{selectedPerson.Birth_Date}</span>
                    </div>
                  )}
                  {selectedPerson.Death_Date && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Death Date:</span>
                      <span className="text-slate-600">{selectedPerson.Death_Date}</span>
                    </div>
                  )}
                  {selectedPerson.Birth_Place && (
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Birth Place:</span>
                      <span className="text-slate-600">{selectedPerson.Birth_Place}</span>
                    </div>
                  )}
                </div>

                {selectedPerson.spouse && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">Spouse</h5>
                    <div className="bg-pink-50 rounded-lg p-3">
                      <div className="font-medium text-pink-900">
                        {selectedPerson.spouse.First_Name} {selectedPerson.spouse.Last_Name}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPerson.parents && selectedPerson.parents.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">Parents</h5>
                    <div className="space-y-2">
                      {selectedPerson.parents.map(parent => {
                        const relationship = relationshipCalculator ? 
                          relationshipCalculator.calculateRelationship(selectedPerson.ID, parent.ID) : '';
                        return (
                          <div 
                            key={parent.ID} 
                            className="bg-blue-50 rounded-lg p-3"
                            onClick={() => setSelectedPerson(parent)}
                          >
                            <div className="font-medium text-blue-900">
                              {parent.First_Name} {parent.Last_Name}
                            </div>
                            {relationship && (
                              <div className="text-xs text-blue-600 capitalize">
                                {relationship}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedPerson.children && selectedPerson.children.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-medium text-slate-700 mb-2">
                      Children ({selectedPerson.children.length})
                    </h5>
                    <div className="space-y-2">
                      {selectedPerson.children.map(child => {
                        const relationship = relationshipCalculator ? 
                          relationshipCalculator.calculateRelationship(selectedPerson.ID, child.ID) : '';
                        return (
                          <div 
                            key={child.ID} 
                            className="bg-emerald-50 rounded-lg p-3"
                            onClick={() => setSelectedPerson(child)}
                          >
                            <div className="font-medium text-emerald-900">
                              {child.First_Name} {child.Last_Name}
                            </div>
                            {relationship && (
                              <div className="text-xs text-emerald-600 capitalize">
                                {relationship}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}