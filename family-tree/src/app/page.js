"use client";
import Image from 'next/image'
import { useState } from "react";

export default function Home() {

  const [pw, setPw] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const notSelect = "w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
  const select = "w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
  const [tabsOnSelect, setTabsOnSelect] = useState([select, notSelect, notSelect]);
  const [tabs, setTabs] = useState(["visible", "hidden", "hidden"]);

    const notSelect2 = "inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group" 
  const select2 = "inline-flex p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group"
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

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {
      !isAuthenticated && 
 
            <div className="flex-wrap items-center justify-center">
                <h2 className={`mb-3 text-2xl font-semibold`}>
                Welcome to the [Campana, Guerrero, Miranda] Family Tree Site! <br/>
                </h2>
                <div className="flex-wrap items-center justify-center">
                  Please enter the password to view:<br/>
                  <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /><br/>
                  <button onClick={checkPassword} className="bg-blue-500 text-white font-bold py-2 px-3 rounded">
                      SUBMIT
                  </button>
                </div>
              </div>
  
    }

     { isAuthenticated &&
      <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mt-4 text-center">Family Tree</h1>
            <i className="text-center">Have updates to the tree? Please email marg624@gmail.com</i><br/>
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
            <h2 className={`mb-3 text-2xl font-semibold`}>
                  Campana Family Tree
            </h2>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="/lola_campana.png"
                alt="Lola Campana Family Tree"
                width={800}
                height={37}
                priority
              />
            </div>
          </div>

          <div className={tabs[1]}>
            <h2 className={`mb-3 text-2xl font-semibold`}>
                  Guerrero Family Tree
            </h2>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="/lola_guerrero.png"
                alt="Lola Guerrero Family Tree"
                width={800}
                height={37}
                priority
              />
            </div>
          </div>

          <div className={tabs[2]}>
            <h2 className={`mb-3 text-2xl font-semibold`}>
                  Miranda Family Tree
            </h2>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="/lolo.png"
                alt="Lolo Miranda Family Tree"
                width={800}
                height={37}
                priority
              />
            </div>
          </div>
        </div>
      }
    </main>
  )
}