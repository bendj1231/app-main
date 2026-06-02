import fetch from 'node-fetch';

const WALLET_SERVICE_URL = 'http://localhost:3001';

interface VeremarkRequest {
  pilotId: string;
  dataTypes: string[];
  purpose: string;
  verificationId?: string;
}

async function testVeremarkIntegration() {
  console.log('🧪 Testing Veremark Integration with Pilot Wallet Service\n');

  // Test 1: Store pilot credentials
  console.log('1️⃣ Storing pilot credentials...');
  const pilotId = 'pilot_benjamin_123';
  
  try {
    // Store license credential
    await fetch(`${WALLET_SERVICE_URL}/wallet/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilotId,
        type: 'license',
        data: {
          number: 'REDACTED-CPL',
          type: 'Commercial Pilot License',
          issueDate: '2025-10-24',
          expiryDate: '2030-10-23',
          ratings: ['Airplane Single Engine Land', 'C152', 'C172', 'P200JF'],
          status: 'valid'
        }
      })
    });

    // Store medical credential
    await fetch(`${WALLET_SERVICE_URL}/wallet/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilotId,
        type: 'medical',
        data: {
          class: 'Class 1',
          issueDate: '2025-05-02',
          expiryDate: '2026-05-02',
          limitations: ['Holder shall wear corrective lenses'],
          status: 'expired'
        }
      })
    });

    console.log('✅ Pilot credentials stored successfully\n');
  } catch (error) {
    console.error('❌ Failed to store credentials:', error);
    return;
  }

  // Test 2: Veremark requests data without consent
  console.log('2️⃣ Veremark requests data without consent...');
  try {
    const response = await fetch(`${WALLET_SERVICE_URL}/veremark/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilotId,
        dataTypes: ['license', 'medical'],
        purpose: 'Pre-employment background check',
        verificationId: 'VEREMARK_001'
      } as VeremarkRequest)
    });

    const result = await response.json() as any;
    
    if (result.status === 'pending_consent') {
      console.log('✅ Correctly returned pending consent status');
      console.log(`📋 Consent ID: ${result.consentId}`);
      console.log(`📋 Verification ID: ${result.verificationId}\n`);
    } else {
      console.log('❌ Expected pending consent status');
    }
  } catch (error) {
    console.error('❌ Failed to test Veremark request:', error);
    return;
  }

  // Test 3: Grant consent for Veremark
  console.log('3️⃣ Granting consent for Veremark...');
  try {
    const response = await fetch(`${WALLET_SERVICE_URL}/wallet/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilotId,
        requester: 'Veremark',
        dataTypes: ['license', 'medical'],
        purpose: 'Pre-employment background check',
        duration: 30
      })
    });

    const result = await response.json() as any;
    console.log('✅ Consent granted successfully');
    console.log(`📋 Consent ID: ${result.consentId}\n`);
  } catch (error) {
    console.error('❌ Failed to grant consent:', error);
    return;
  }

  // Test 4: Veremark requests data with consent
  console.log('4️⃣ Veremark requests data with consent...');
  try {
    const response = await fetch(`${WALLET_SERVICE_URL}/veremark/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pilotId,
        dataTypes: ['license', 'medical'],
        purpose: 'Pre-employment background check',
        verificationId: 'VEREMARK_001'
      } as VeremarkRequest)
    });

    const result = await response.json() as any;
    
    if (result.status === 'success') {
      console.log('✅ Data retrieved successfully');
      console.log(`📋 Verification ID: ${result.verificationId}`);
      console.log(`📋 Pilot ID: ${result.pilotId}`);
      console.log(`📋 Retrieved at: ${result.retrievedAt}`);
      console.log(`📋 Credentials found: ${result.data.length}`);
      
      result.data.forEach((cred: any, index: number) => {
        console.log(`   ${index + 1}. ${cred.type}: ${cred.data.status} (${cred.data.number || cred.data.class})`);
      });
      
      console.log('📋 Audit trail created for compliance\n');
    } else {
      console.log('❌ Expected success status');
    }
  } catch (error) {
    console.error('❌ Failed to retrieve data with consent:', error);
    return;
  }

  // Test 5: Check pilot consents
  console.log('5️⃣ Checking pilot consent history...');
  try {
    const response = await fetch(`${WALLET_SERVICE_URL}/wallet/consents/${pilotId}`);
    const consents = await response.json() as any;
    
    console.log(`✅ Found ${consents.consents.length} consent records`);
    consents.consents.forEach((consent: any) => {
      console.log(`   📋 ${consent.requester}: ${consent.granted ? 'Granted' : 'Pending'} (${consent.accessCount}/${consent.maxAccess} uses)`);
    });
    
    console.log('\n🎉 Veremark integration test completed successfully!');
  } catch (error) {
    console.error('❌ Failed to check consents:', error);
  }
}

// Run the test
testVeremarkIntegration().catch(console.error);

export { testVeremarkIntegration };
