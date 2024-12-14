import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MetaMaskProvider } from "@metamask/sdk-react"
import './index.css'
import App from './App.jsx'

const infuraAPIKey = import.meta.env.INFURA_API_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey: infuraAPIKey,
        // Other options.
      }}
    >
      <App />
    </MetaMaskProvider>
  </StrictMode>,
)
