const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    try {
        // Test 1: Get all residentials
        console.log('Testing GET /api/residentials...');
        const allResidentials = await fetch(`${API_BASE_URL}/residentials`);
        const allData = await allResidentials.json();
        console.log(`Found ${allData.length} residentials`);

        // Test 2: Search residentials
        console.log('\nTesting GET /api/residentials/search?query=claremont...');
        const searchResults = await fetch(`${API_BASE_URL}/residentials/search?query=claremont`);
        const searchData = await searchResults.json();
        console.log(`Found ${searchData.length} matching residentials`);

        // Test 3: Get residential by ID
        console.log('\nTesting GET /api/residentials/1...');
        const singleResidential = await fetch(`${API_BASE_URL}/residentials/1`);
        const singleData = await singleResidential.json();
        console.log('Residential details:', singleData);

    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testEndpoints(); 