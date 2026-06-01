async function test() {
  try {
    console.log('Logging in as doctor@maclinic.com...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'doctor@maclinic.com', password: 'password123' })
    });
    
    if (loginRes.status !== 200) {
      console.error('Login failed! Status:', loginRes.status, await loginRes.json());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful! Token acquired.');
    
    console.log('\n--- Fetching Notifications ---');
    const notifRes = await fetch('http://localhost:5000/api/notifications', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Notifications status:', notifRes.status);
    console.log('Notifications JSON:', await notifRes.json());
    
    console.log('\n--- Sending Chat Message ---');
    const chatRes = await fetch('http://localhost:5000/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: 'Hello, this is a real flow test!', receiver: null })
    });
    console.log('Chat send status:', chatRes.status);
    console.log('Chat send JSON:', await chatRes.json());
    
  } catch (error) {
    console.error('Error during HTTP flow test:', error);
  }
}

test();
