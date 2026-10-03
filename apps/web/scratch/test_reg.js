async function testServer() {
  try {
    const res = await fetch('http://127.0.0.1:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test' + Date.now() + '@oudnomad.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Customer',
      }),
    });
    const data = await res.json();
    console.log('REGISTRATION_RESPONSE:', JSON.stringify(data));
  } catch (err) {
    console.error('FETCH_ERROR:', err);
  }
}
testServer();
