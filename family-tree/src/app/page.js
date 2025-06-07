"use client";
import Image from 'next/image'
import { useState } from "react";
import FamilyTree from '../components/FamilyTree';

export default function Home() {

  const [pw, setPw] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const notSelect = "w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
  const select = "w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
  const [tabsOnSelect, setTabsOnSelect] = useState([select, notSelect, notSelect]);
  const [tabs, setTabs] = useState(["visible", "hidden", "hidden"]);

  const notSelect2 = "inline-flex p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group" 
  const select2 = "inline-flex p-2 text-lime-800 border-b-2 border-lime-800 rounded-t-lg active dark:text-lime-800 dark:border-lime-800 group"
  const [tabsOnSelect2, setTabsOnSelect2] = useState([select2, notSelect2, notSelect2]);

  function checkPassword() {
    if (pw == "hilaria") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password. For access, please email marg624@gmail.com")
      setIsAuthenticated(false)
    }
  }

  return (
    <div>
    {
      !isAuthenticated && 
        <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-[url('/tree.png')]">
            <div className="flex-wrap items-center justify-center text-center">
                <h2 className={`mb-4 text-3xl font-semibold`}>
                Welcome to the <br/>[Campana, Guerrero, Miranda]<br/> Family Tree Site! <br/>
                </h2>
                <div className="flex-wrap items-center justify-center space-y-3">
                  Please enter the password to view:<br/>
                  <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="border-2 border-slate-950 rounded" /><br/>
                  <button onClick={checkPassword} className="bg-lime-800 text-white font-bold py-2 px-3 rounded">
                      SUBMIT
                  </button>
                </div>
              </div>
        </main>
  
    }

     { isAuthenticated &&
      <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-[url('/tree.png')]">
        <div className="text-center">
                <h2 className={`mb-4 text-3xl font-semibold`}>
                Welcome to the <br/>[Campana, Guerrero, Miranda]<br/> Family Tree Site! 
                </h2>
                <div className="text-medium">
                  Click below on the different family name tabs to view.<br/><br/>
                </div>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li className="mr-2">
                        <a onClick={() => {setTabs(["visible", "hidden", "hidden"]); setTabsOnSelect([select, notSelect, notSelect]);setTabsOnSelect2([select2, notSelect2, notSelect2]);}} className={tabsOnSelect2[0]} >
                            CAMPANA
                        </a>
                    </li>
                    <li className="mr-2">
                        <a  onClick={() => {setTabs(["hidden", "visible", "hidden"]);setTabsOnSelect([notSelect, select, notSelect]);setTabsOnSelect2([notSelect2, select2, notSelect2]);}}  className={tabsOnSelect2[1]}>
                            GUERRERO
                        </a>
                    </li>
                    <li className="mr-2">
                        <a onClick={() => {setTabs(["hidden", "hidden", "visible"]); setTabsOnSelect([notSelect, notSelect, select]); setTabsOnSelect2([notSelect2, notSelect2, select2]);}}  className={tabsOnSelect2[2]}>             
                            MIRANDA
                        </a>
                    </li>
                </ul>
              </div>


          <div className={tabs[0]}>
            <div className={`mb-4`}>
              <h2 className={`text-large`}>
                  <br/>
                 Interactive Campana Family Tree
              </h2>
              <i className="text-sm">Click on family members to see details. Use + button to expand and see children.</i>
            </div>
            <div className="relative bg-white shadow-2xl rounded-lg p-6">
              <FamilyTree familyName="Campana" />
            </div>
             
          </div>


          <div className={tabs[1]}>
            <div className={`mb-4`}>
              <h2 className={`text-large`}>
              <br/>
                 Interactive Guerrero Family Tree
            </h2>
              <i className="text-sm">Click on family members to see details. Use + button to expand and see children.</i>
            </div>
            <div className="relative bg-white shadow-2xl rounded-lg p-6">
              <FamilyTree familyName="Guerrero" />
            </div>
          </div>

          <div className={tabs[2]}>
            <div className={`mb-4`}>
              <h2 className={`text-large`}>
                <br/>
                 Interactive Miranda Family Tree
            </h2>
              <i className="text-sm">Click on family members to see details. Use + button to expand and see children.</i>
            </div>
            <div className="relative bg-white shadow-2xl rounded-lg p-6">
              <FamilyTree familyName="Miranda" />
            </div>
          </div>
        </div>
        </main>
      }
    </div>
  )
}