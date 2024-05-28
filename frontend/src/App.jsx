import React, { lazy,Suspense } from 'react'
import {BrowserRouter,Routes,Route,Outlet, Link} from 'react-router-dom'
import { ModeToggle } from './Components/mode-toggle.jsx'
import Loader from './Components/Loader.jsx';



const components = [
  { path:'*' ,page: lazy(()=>import('./pages/Error'))},
  { path:'signup' ,page: lazy(()=>import('./pages/Signup'))},
  { path:'signin' ,page: lazy(()=>import('./pages/Signin'))},
  { path:'dashboard' ,page: lazy(()=>import('./pages/Dashboard'))},
  { path:'sendmoney' ,page: lazy(()=>import('./pages/SendMoney.jsx'))},
]


function App() {
  return (
    <div>
    {/* <ModeToggle/> */}
    <BrowserRouter>
    <Routes>
       
        {components.map((component,idx)=>{

          return <Route key={idx} path={component.path} 
           element={
           <Suspense fallback={<Loader/>}> 
                <component.page /> 
           </Suspense>
          } />
        })}
    </Routes>
    </BrowserRouter>
    </div>
  );
}














export default App
