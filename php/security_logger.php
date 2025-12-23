<?php
/**
 * Security Logging System for SIPNOTUL
 * Logs security-related events for monitoring and audit purposes
 */

/**
 * Log security events to file and error log
 */
function logSecurityEvent($event_type, $user_nim, $details, $severity = 'WARNING') {
    $timestamp = date('Y-m-d H:i:s');
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    // Create log entry
    $log_entry = [
        'timestamp' => $timestamp,
        'event_type' => $event_type,
        'user_nim' => $user_nim,
        'ip_address' => $ip_address,
        'user_agent' => $user_agent,
        'details' => $details,
        'severity' => $severity
    ];
    
    // Format for file logging
    $log_message = sprintf(
        "[%s] %s - %s | User: %s | IP: %s | Details: %s",
        $timestamp,
        $severity,
        $event_type,
        $user_nim,
        $ip_address,
        $details
    );
    
    // Log to PHP error log
    error_log("SIPNOTUL_SECURITY: " . $log_message);
    
    // Log to dedicated security log file (if writable)
    $log_file = '../logs/security.log';
    if (is_dir('../logs') && is_writable('../logs')) {
        file_put_contents($log_file, $log_message . PHP_EOL, FILE_APPEND | LOCK_EX);
    }
    
    // For critical events, also log to database (if needed)
    if ($severity === 'CRITICAL') {
        logToDatabase($log_entry);
    }
}

/**
 * Log critical events to database for persistent storage
 */
function logToDatabase($log_entry) {
    // This would require a security_logs table
    // For now, we'll just use error_log as fallback
    error_log("SIPNOTUL_CRITICAL: " . json_encode($log_entry));
}

/**
 * Log unauthorized access attempts
 */
function logUnauthorizedAccess($action, $user_nim, $resource_id, $owner_nim) {
    $details = sprintf(
        "Unauthorized %s attempt on resource %s (owned by %s)",
        $action,
        $resource_id,
        $owner_nim
    );
    
    logSecurityEvent('UNAUTHORIZED_ACCESS', $user_nim, $details, 'WARNING');
}

/**
 * Log successful security actions
 */
function logSecuritySuccess($action, $user_nim, $resource_id) {
    $details = sprintf(
        "Successful %s on resource %s",
        $action,
        $resource_id
    );
    
    logSecurityEvent('SECURITY_SUCCESS', $user_nim, $details, 'INFO');
}

/**
 * Log authentication events
 */
function logAuthEvent($event, $user_nim, $success = true) {
    $severity = $success ? 'INFO' : 'WARNING';
    $details = $success ? "Successful $event" : "Failed $event";
    
    logSecurityEvent('AUTH_EVENT', $user_nim, $details, $severity);
}

/**
 * Log data validation failures
 */
function logValidationFailure($field, $user_nim, $value) {
    $details = sprintf(
        "Validation failure for field '%s' with value '%s'",
        $field,
        substr($value, 0, 50) // Limit logged value length
    );
    
    logSecurityEvent('VALIDATION_FAILURE', $user_nim, $details, 'WARNING');
}

/**
 * Create logs directory if it doesn't exist
 */
function ensureLogsDirectory() {
    $logs_dir = '../logs';
    if (!is_dir($logs_dir)) {
        mkdir($logs_dir, 0755, true);
        
        // Create .htaccess to protect log files
        $htaccess_content = "Order Deny,Allow\nDeny from all";
        file_put_contents($logs_dir . '/.htaccess', $htaccess_content);
    }
}

// Initialize logs directory
ensureLogsDirectory();
?>