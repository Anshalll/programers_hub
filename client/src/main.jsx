import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { Store } from './redux/store.js'

import { GoogleOAuthProvider } from '@react-oauth/google'
createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_GOOGLE}>


    <Provider store={Store}>
      <StrictMode>

        <App />
      </StrictMode>

    </Provider>

  </GoogleOAuthProvider> 


  
)
