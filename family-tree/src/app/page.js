"use client";
import Image from 'next/image'
import { useState } from "react";

export default function Home() {

  const [pw, setPw] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                Welcome to the Miranda Family Tree! <br/>
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
      <div>
          <h2 className={`mb-3 text-2xl font-semibold`}>
                Campana Family Tree
          </h2>
          <i>Have updates to the tree? Please email marg624@gmail.com</i>
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

          <h2 className={`mb-3 text-2xl font-semibold`}>
                Guerrero Family Tree
          </h2>
          <i>Have updates to the tree? Please email marg624@gmail.com</i>
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

          <h2 className={`mb-3 text-2xl font-semibold`}>
                Miranda Family Tree
          </h2>
          <i>Have updates to the tree? Please email marg624@gmail.com</i>
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
      }
    </main>
  )
}