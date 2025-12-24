// Native fetch in Node 20+, no require needed

const API_URL = 'http://localhost:3000/api';

async function testApi() {
    try {
        console.log('--- Testing Registration ---');
        const email = `test${Date.now()}@example.com`;
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123', name: 'Test User' })
        });
        let regData;
        const regText = await regRes.text();
        try {
            regData = JSON.parse(regText);
        } catch (e) {
            console.error('Registration Response NOT JSON:', regText);
            throw new Error('Server returned non-JSON response');
        }
        console.log('Registration Status:', regRes.status);


        if (regRes.status !== 201) throw new Error('Registration failed');
        const token = regData.token;

        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);

        console.log('\n--- Testing Create Training ---');
        const trainingRes = await fetch(`${API_URL}/trainings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                date: new Date().toISOString(),
                type: 'run',
                durationMinutes: 45,
                feeling: 'good',
                notes: 'Test run via API'
            })
        });
        const trainingData = await trainingRes.json();
        console.log('Create Training Status:', trainingRes.status);
        console.log('Created Training:', trainingData);

        console.log('\n--- Testing Get Trainings ---');
        const listRes = await fetch(`${API_URL}/trainings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();
        console.log('List Status:', listRes.status);
        console.log('Trainings Count:', listData.length);

        console.log('\n✅ API Verification Successful!');

    } catch (error) {
        console.error('\n❌ API Verification Failed:', error);
    }
}

testApi();
