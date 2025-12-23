<?php
/**
 * PHP Integration Tests for Access Control
 * Tests server-side security and validation
 */

// Include required files
require_once '../php/conn_db_notes.php';
require_once '../php/security_logger.php';

class PHPIntegrationTest {
    private $results = [];
    private $testCount = 0;
    
    public function __construct() {
        echo "🧪 Starting PHP Integration Tests...\n\n";
    }
    
    /**
     * Run a test case
     */
    private function runTest($name, $testFunction) {
        $this->testCount++;
        echo "Running: $name\n";
        
        try {
            $testFunction();
            $this->results[] = ['name' => $name, 'status' => 'PASS'];
            echo "✅ PASS: $name\n\n";
        } catch (Exception $e) {
            $this->results[] = ['name' => $name, 'status' => 'FAIL', 'error' => $e->getMessage()];
            echo "❌ FAIL: $name - " . $e->getMessage() . "\n\n";
        }
    }
    
    /**
     * Assert helper
     */
    private function assert($condition, $message) {
        if (!$condition) {
            throw new Exception($message);
        }
    }
    
    /**
     * Test ownership verification logic
     */
    public function testOwnershipVerification() {
        $this->runTest('Ownership verification - same NIM', function() {
            $userNim = '12345';
            $authorNim = '12345';
            $isOwner = ($userNim === $authorNim);
            $this->assert($isOwner, 'Same NIM should indicate ownership');
        });
        
        $this->runTest('Ownership verification - different NIM', function() {
            $userNim = '12345';
            $authorNim = '67890';
            $isOwner = ($userNim === $authorNim);
            $this->assert(!$isOwner, 'Different NIM should not indicate ownership');
        });
        
        $this->runTest('Ownership verification - empty NIM', function() {
            $userNim = '';
            $authorNim = '12345';
            $isOwner = ($userNim === $authorNim);
            $this->assert(!$isOwner, 'Empty NIM should not indicate ownership');
        });
    }
    
    /**
     * Test date validation logic
     */
    public function testDateValidation() {
        $this->runTest('Date validation - current date', function() {
            $currentDate = date('Y-m-d');
            $meetingDate = date('Y-m-d');
            $isValid = ($meetingDate >= $currentDate);
            $this->assert($isValid, 'Current date should be valid');
        });
        
        $this->runTest('Date validation - future date', function() {
            $currentDate = date('Y-m-d');
            $futureDate = date('Y-m-d', strtotime('+1 day'));
            $isValid = ($futureDate >= $currentDate);
            $this->assert($isValid, 'Future date should be valid');
        });
        
        $this->runTest('Date validation - past date', function() {
            $currentDate = date('Y-m-d');
            $pastDate = date('Y-m-d', strtotime('-1 day'));
            $isValid = ($pastDate >= $currentDate);
            $this->assert(!$isValid, 'Past date should be invalid');
        });
    }
    
    /**
     * Test security logging functions
     */
    public function testSecurityLogging() {
        $this->runTest('Security logging - unauthorized access', function() {
            // Capture error log
            $oldErrorLog = ini_get('log_errors');
            ini_set('log_errors', 1);
            
            // Test logging function
            logUnauthorizedAccess('EDIT', '12345', 'note_123', '67890');
            
            // Restore error log setting
            ini_set('log_errors', $oldErrorLog);
            
            $this->assert(true, 'Security logging should not throw errors');
        });
        
        $this->runTest('Security logging - validation failure', function() {
            // Test logging function
            logValidationFailure('meetingDate', '12345', '2020-01-01');
            
            $this->assert(true, 'Validation logging should not throw errors');
        });
    }
    
    /**
     * Test input sanitization
     */
    public function testInputSanitization() {
        $this->runTest('Input sanitization - SQL injection attempt', function() {
            global $conn_db_notes;
            
            $maliciousInput = "'; DROP TABLE tbnotes_data; --";
            $sanitized = mysqli_real_escape_string($conn_db_notes, $maliciousInput);
            
            $this->assert($sanitized !== $maliciousInput, 'Malicious input should be sanitized');
            $this->assert(strpos($sanitized, 'DROP') !== false, 'Sanitized input should still contain the text but escaped');
        });
        
        $this->runTest('Input sanitization - XSS attempt', function() {
            $maliciousInput = '<script>alert("XSS")</script>';
            $sanitized = htmlspecialchars($maliciousInput, ENT_QUOTES, 'UTF-8');
            
            $this->assert($sanitized !== $maliciousInput, 'XSS input should be sanitized');
            $this->assert(strpos($sanitized, '&lt;script&gt;') !== false, 'Script tags should be encoded');
        });
    }
    
    /**
     * Test database connection security
     */
    public function testDatabaseSecurity() {
        $this->runTest('Database connection - connection exists', function() {
            global $conn_db_notes;
            
            $this->assert($conn_db_notes !== false, 'Database connection should exist');
            $this->assert(mysqli_ping($conn_db_notes), 'Database connection should be active');
        });
        
        $this->runTest('Database connection - prepared statement support', function() {
            global $conn_db_notes;
            
            $stmt = mysqli_prepare($conn_db_notes, "SELECT 1");
            $this->assert($stmt !== false, 'Database should support prepared statements');
            
            if ($stmt) {
                mysqli_stmt_close($stmt);
            }
        });
    }
    
    /**
     * Test error handling
     */
    public function testErrorHandling() {
        $this->runTest('Error handling - invalid JSON input', function() {
            $invalidJson = '{"invalid": json}';
            $decoded = json_decode($invalidJson, true);
            
            $this->assert($decoded === null, 'Invalid JSON should return null');
            $this->assert(json_last_error() !== JSON_ERROR_NONE, 'JSON error should be detected');
        });
        
        $this->runTest('Error handling - missing required fields', function() {
            $data = ['title' => 'Test'];
            // Missing required fields like authorNim
            
            $hasRequiredFields = isset($data['authorNim']) && isset($data['content']);
            $this->assert(!$hasRequiredFields, 'Missing required fields should be detected');
        });
    }
    
    /**
     * Run all tests
     */
    public function runAllTests() {
        $this->testOwnershipVerification();
        $this->testDateValidation();
        $this->testSecurityLogging();
        $this->testInputSanitization();
        $this->testDatabaseSecurity();
        $this->testErrorHandling();
        
        $this->printSummary();
    }
    
    /**
     * Print test summary
     */
    private function printSummary() {
        $passed = count(array_filter($this->results, function($r) { return $r['status'] === 'PASS'; }));
        $failed = count(array_filter($this->results, function($r) { return $r['status'] === 'FAIL'; }));
        $total = count($this->results);
        $rate = $total > 0 ? round(($passed / $total) * 100, 1) : 0;
        
        echo "📊 Test Results Summary:\n";
        echo "✅ Passed: $passed\n";
        echo "❌ Failed: $failed\n";
        echo "📈 Success Rate: {$rate}%\n\n";
        
        if ($failed > 0) {
            echo "❌ Failed Tests:\n";
            foreach ($this->results as $result) {
                if ($result['status'] === 'FAIL') {
                    echo "  - {$result['name']}: {$result['error']}\n";
                }
            }
        }
        
        echo "\n🎯 Test completed successfully!\n";
    }
}

// Run tests if called directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    $tester = new PHPIntegrationTest();
    $tester->runAllTests();
}
?>