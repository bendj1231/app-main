const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Mock wallet UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Mock Walt.id Wallet</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .wallet { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .credential { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .accept-btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
            .accept-btn:hover { background: #0056b3; }
            .success { color: #28a745; text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="wallet">
            <div class="header">
                <h1>🔐 Mock Walt.id Wallet</h1>
                <p>Credential Offer Received</p>
            </div>
            
            <div class="credential">
                <h3>PilotConnectionVC</h3>
                <p><strong>Issuer:</strong> PilotRecognition</p>
                <p><strong>Platform:</strong> PilotRecognition</p>
                <p><strong>Status:</strong> Wallet Connected</p>
                <p><strong>Connection Date:</strong> ${new Date().toISOString()}</p>
            </div>
            
            <div style="text-align: center;">
                <button class="accept-btn" onclick="acceptCredential()">Accept Credential</button>
            </div>
            
            <div id="success" class="success" style="display: none;">
                ✅ Credential successfully added to wallet!
            </div>
        </div>
        
        <script>
            function acceptCredential() {
                document.getElementById('success').style.display = 'block';
                document.querySelector('.accept-btn').style.display = 'none';
                
                // Notify parent window about successful credential acceptance
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'wallet_credential_accepted',
                        wallet: 'walt.id',
                        status: 'success'
                    }, '*');
                }
                
                // Close wallet after 2 seconds
                setTimeout(() => {
                    window.close();
                }, 2000);
            }
        </script>
    </body>
    </html>
  `);
});

// Handle credential offer parsing
app.get('/offer', (req, res) => {
  const credentialOffer = req.query.credential_offer_uri;
  console.log('Received credential offer:', credentialOffer);
  
  // Redirect to main wallet page
  res.redirect('/');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mock-walt-id-wallet' });
});

app.listen(port, () => {
  console.log(`🔐 Mock Walt.id Wallet running at http://localhost:${port}`);
  console.log(`📱 Wallet UI: http://localhost:${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
});
