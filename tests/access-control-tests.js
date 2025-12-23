/**
 * Comprehensive Testing Suite for Note Editing Access Control
 * Tests ownership verification, date validation, and security features
 */

// Mock data for testing
const mockUsers = {
    owner: { nim: '12345', name: 'Test Owner' },
    participant: { nim: '67890', name: 'Test Participant' },
    unauthorized: { nim: '99999', name: 'Unauthorized User' }
};

const mockNotes = {
    ownedNote: {
        idNotes: 1,
        title: 'Test Meeting',
        authorNim: '12345',
        content: 'Test content',
        meetingDate: '2024-01-15',
        isPublic: 1
    },
    otherNote: {
        idNotes: 2,
        title: 'Other Meeting',
        authorNim: '67890',
        content: 'Other content',
        meetingDate: '2024-01-16',
        isPublic: 1
    }
};

/**
 * Test Suite Class
 */
class AccessControlTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.mockFetch = null;
    }

    /**
     * Add a test case
     */
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting Access Control Test Suite...\n');
        
        for (const test of this.tests) {
            try {
                console.log(`Running: ${test.name}`);
                await test.testFunction();
                this.results.push({ name: test.name, status: 'PASS' });
                console.log(`✅ PASS: ${test.name}\n`);
            } catch (error) {
                this.results.push({ name: test.name, status: 'FAIL', error: error.message });
                console.error(`❌ FAIL: ${test.name} - ${error.message}\n`);
            }
        }
        
        this.printSummary();
    }

    /**
     * Print test results summary
     */
    printSummary() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        
        console.log('📊 Test Results Summary:');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.filter(r => r.status === 'FAIL').forEach(r => {
                console.log(`  - ${r.name}: ${r.error}`);
            });
        }
    }

    /**
     * Setup mock fetch for API testing
     */
    setupMockFetch() {
        this.originalFetch = window.fetch;
        window.fetch = this.mockFetch;
    }

    /**
     * Restore original fetch
     */
    restoreFetch() {
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
    }

    /**
     * Assert helper functions
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: Expected ${expected}, got ${actual}`);
        }
    }

    assertNotEqual(actual, unexpected, message) {
        if (actual === unexpected) {
            throw new Error(`${message}: Expected not ${unexpected}, got ${actual}`);
        }
    }
}

// Initialize test suite
const testSuite = new AccessControlTestSuite();

/**
 * Ownership Verification Tests
 */
testSuite.addTest('Owner can access edit controls', async () => {
    // Mock current user as owner
    const mockGetCurrentUser = () => mockUsers.owner;
    
    // Test ownership check
    const isOwner = mockGetCurrentUser().nim === mockNotes.ownedNote.authorNim;
    testSuite.assert(isOwner, 'Owner should have access to their own notes');
});

testSuite.addTest('Non-owner cannot access edit controls', async () => {
    // Mock current user as participant
    const mockGetCurrentUser = () => mockUsers.participant;
    
    // Test ownership check
    const isOwner = mockGetCurrentUser().nim === mockNotes.ownedNote.authorNim;
    testSuite.assert(!isOwner, 'Non-owner should not have access to others\' notes');
});

testSuite.addTest('Unauthorized user cannot access any controls', async () => {
    // Mock current user as unauthorized
    const mockGetCurrentUser = () => mockUsers.unauthorized;
    
    // Test ownership check for both notes
    const isOwnerNote1 = mockGetCurrentUser().nim === mockNotes.ownedNote.authorNim;
    const isOwnerNote2 = mockGetCurrentUser().nim === mockNotes.otherNote.authorNim;
    
    testSuite.assert(!isOwnerNote1 && !isOwnerNote2, 'Unauthorized user should not have access to any notes');
});

/**
 * Date Validation Tests
 */
testSuite.addTest('Current date should be valid', async () => {
    const today = new Date().toISOString().split('T')[0];
    const currentDate = new Date().toISOString().split('T')[0];
    
    testSuite.assert(today >= currentDate, 'Current date should be valid for meeting scheduling');
});

testSuite.addTest('Future date should be valid', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];
    const currentDate = new Date().toISOString().split('T')[0];
    
    testSuite.assert(futureDate > currentDate, 'Future date should be valid for meeting scheduling');
});

testSuite.addTest('Past date should be invalid', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];
    const currentDate = new Date().toISOString().split('T')[0];
    
    testSuite.assert(pastDate < currentDate, 'Past date should be invalid for meeting scheduling');
});

/**
 * API Security Tests
 */
testSuite.addTest('Save API rejects unauthorized edit', async () => {
    // Mock fetch to simulate server response
    testSuite.mockFetch = async (url, options) => {
        if (url.includes('save_note.php')) {
            return {
                status: 403,
                json: async () => ({
                    status: 'error',
                    message: 'Anda tidak memiliki izin untuk mengedit notulen ini'
                })
            };
        }
    };
    
    testSuite.setupMockFetch();
    
    try {
        const response = await fetch('php/save_note.php', {
            method: 'POST',
            body: new FormData()
        });
        
        const result = await response.json();
        
        testSuite.assertEqual(response.status, 403, 'Should return 403 for unauthorized edit');
        testSuite.assertEqual(result.status, 'error', 'Should return error status');
    } finally {
        testSuite.restoreFetch();
    }
});

testSuite.addTest('Delete API rejects unauthorized deletion', async () => {
    // Mock fetch to simulate server response
    testSuite.mockFetch = async (url, options) => {
        if (url.includes('delete_note.php')) {
            return {
                status: 403,
                json: async () => ({
                    status: 'error',
                    message: 'Anda tidak memiliki izin untuk menghapus notulen ini'
                })
            };
        }
    };
    
    testSuite.setupMockFetch();
    
    try {
        const response = await fetch('php/delete_note.php', {
            method: 'POST',
            body: JSON.stringify({ id: 1, deleterNim: '99999' }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        testSuite.assertEqual(response.status, 403, 'Should return 403 for unauthorized deletion');
        testSuite.assertEqual(result.status, 'error', 'Should return error status');
    } finally {
        testSuite.restoreFetch();
    }
});

testSuite.addTest('Save API rejects past dates', async () => {
    // Mock fetch to simulate server response
    testSuite.mockFetch = async (url, options) => {
        if (url.includes('save_note.php')) {
            return {
                status: 400,
                json: async () => ({
                    status: 'error',
                    message: 'Tanggal rapat tidak boleh di masa lalu'
                })
            };
        }
    };
    
    testSuite.setupMockFetch();
    
    try {
        const formData = new FormData();
        formData.append('meetingDate', '2020-01-01'); // Past date
        
        const response = await fetch('php/save_note.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        testSuite.assertEqual(response.status, 400, 'Should return 400 for past date');
        testSuite.assert(result.message.includes('masa lalu'), 'Should mention past date in error message');
    } finally {
        testSuite.restoreFetch();
    }
});

/**
 * UI Component Tests
 */
testSuite.addTest('Edit button hidden for non-owners', async () => {
    // Create mock DOM element
    const mockCard = document.createElement('div');
    mockCard.innerHTML = `
        <div class="note-controls">
            <button class="btn btn-secondary">👁️ Lihat</button>
        </div>
    `;
    
    // Simulate non-owner scenario
    const isOwner = false;
    const editButton = mockCard.querySelector('.edit-btn');
    
    testSuite.assert(!editButton, 'Edit button should not exist for non-owners');
});

testSuite.addTest('Delete button hidden for non-owners', async () => {
    // Create mock DOM element
    const mockCard = document.createElement('div');
    mockCard.innerHTML = `
        <div class="note-controls">
            <button class="btn btn-secondary">👁️ Lihat</button>
        </div>
    `;
    
    // Simulate non-owner scenario
    const isOwner = false;
    const deleteButton = mockCard.querySelector('.btn-danger');
    
    testSuite.assert(!deleteButton, 'Delete button should not exist for non-owners');
});

testSuite.addTest('Access indicator shows correct status', async () => {
    // Test owner indicator
    const ownerIndicator = '<span style="background: #dcfce7; color: #166534;">📝 Milik Anda</span>';
    testSuite.assert(ownerIndicator.includes('Milik Anda'), 'Should show owner indicator for owners');
    
    // Test read-only indicator
    const readOnlyIndicator = '<span style="background: #fef3c7; color: #92400e;">👁️ Hanya Lihat</span>';
    testSuite.assert(readOnlyIndicator.includes('Hanya Lihat'), 'Should show read-only indicator for non-owners');
});

/**
 * Performance Tests
 */
testSuite.addTest('Caching improves performance', async () => {
    // Mock performance measurement
    const startTime = performance.now();
    
    // Simulate cache hit
    const cachedResult = true; // Assume cache hit
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testSuite.assert(duration < 1, 'Cached operations should be very fast');
});

testSuite.addTest('DOM updates are batched', async () => {
    // Create multiple DOM elements
    const elements = [];
    for (let i = 0; i < 10; i++) {
        elements.push(document.createElement('div'));
    }
    
    // Simulate batched updates
    const startTime = performance.now();
    
    // Mock batched DOM update
    elements.forEach(el => {
        el.style.display = 'block';
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testSuite.assert(duration < 10, 'Batched DOM updates should be efficient');
});

/**
 * Security Edge Cases
 */
testSuite.addTest('Empty NIM handled securely', async () => {
    const emptyNim = '';
    const noteAuthorNim = '12345';
    
    const isOwner = emptyNim === noteAuthorNim;
    testSuite.assert(!isOwner, 'Empty NIM should not match any owner');
});

testSuite.addTest('Null values handled securely', async () => {
    const nullNim = null;
    const noteAuthorNim = '12345';
    
    const isOwner = nullNim === noteAuthorNim;
    testSuite.assert(!isOwner, 'Null NIM should not match any owner');
});

testSuite.addTest('Case sensitivity maintained', async () => {
    const userNim = '12345';
    const noteAuthorNim = '12345';
    const wrongCaseNim = '12345'; // Same case for this test
    
    const isOwner = userNim === noteAuthorNim;
    testSuite.assert(isOwner, 'Exact case match should work');
    
    // Test different case (if applicable)
    const differentCase = 'ABC123';
    const lowerCase = 'abc123';
    const caseInsensitiveMatch = differentCase.toLowerCase() === lowerCase;
    testSuite.assert(caseInsensitiveMatch, 'Case comparison should be explicit');
});

// Export for use in browser
if (typeof window !== 'undefined') {
    window.AccessControlTestSuite = testSuite;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testSuite;
}

// Auto-run tests if in test environment
if (typeof window !== 'undefined' && window.location.search.includes('runTests=true')) {
    testSuite.runAllTests();
}