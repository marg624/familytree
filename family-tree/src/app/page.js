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

    <main className="flex min-h-screen flex-col items-center justify-between p-12">
    {
      !isAuthenticated && 
 
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
  
    }

     { isAuthenticated &&
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
                 Link to <a href="https://app.smartdraw.com/share.aspx/?pubDocShare=43013295ACEFE9A2EA2076684BCE2BBD3DC"><i>SmartDraw</i></a> Campana Family Tree project.
              </h2>
              <i className="text-sm">Please email marg624@gmail.com with modifications to the tree or access to edit on SmartDraw.</i><br/><br/>
            </div>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative"
                src="https://app.smartdraw.com/cloudstorage/43013295ACEFE9A2EA2076684BCE2BBD3DC/preview2.png"
                alt="Lola Campana Family Tree"
                width={800}
                height={37}
                priority
              />
              
            </div>
             
          </div>


          <div className={tabs[1]}>
            <div className={`mb-4`}>
              <h2 className={`text-large`}>
                 Link to <a href="https://app.smartdraw.com/share.aspx/?pubDocShare=1C26B2FCC8499781C4B0407F12A14C927A5"><i>SmartDraw</i></a> Guerrero Family Tree project.
            </h2>
              <i className="text-sm">Please email marg624@gmail.com with modifications to the tree or access to edit on SmartDraw.</i><br/><br/>
            </div>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="https://app.smartdraw.com/cloudstorage/1C26B2FCC8499781C4B0407F12A14C927A5/preview2.png"
                alt="Lola Guerrero Family Tree"
                width={800}
                height={37}
                priority
              />
            </div>
          </div>

          <div className={tabs[2]}>
            <div className={`mb-4`}>
              <h2 className={`text-large`}>
                 Link to <a href="https://app.smartdraw.com/share.aspx/?pubDocShare=452468C51A481580818FD4D8A98A3C53518"><i>SmartDraw</i></a> Miranda Family Tree project.
            </h2>
              <i className="text-sm">Please email marg624@gmail.com with modifications to the tree or access to edit on SmartDraw.</i><br/><br/>
            </div>
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="https://app.smartdraw.com/cloudstorage/452468C51A481580818FD4D8A98A3C53518/preview2.png"
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