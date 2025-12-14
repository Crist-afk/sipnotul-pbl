# SIPNOTUL Database Setup

This folder contains SQL scripts to set up the SIPNOTUL database structure.

## Database Structure

### dbUsers
- **tbUsers**: Stores user information (id, name, nim, email, password, programStudi)

### dbNotes
- **tbNotesData**: Stores meeting notes/minutes
- **tbNotesAttendees**: Stores attendees for each note
- **tbMeetings**: Stores scheduled meetings (separate from notes)
- **tbMeetingParticipants**: Stores invited participants for meetings

## Setup Instructions

### 1. Using MySQL Command Line

```bash
mysql -u root -p < 01_create_databases.sql
mysql -u root -p < 02_create_users_tables.sql
mysql -u root -p < 03_create_notes_tables.sql
mysql -u root -p < 04_insert_demo_data.sql
```

### 2. Using phpMyAdmin

1. Open phpMyAdmin
2. Click on "Import" tab
3. Import files in order:
   - 01_create_databases.sql
   - 02_create_users_tables.sql
   - 03_create_notes_tables.sql
   - 04_insert_demo_data.sql

### 3. Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Run SQL Script
4. Run each file in order

## Demo Credentials

All demo users have the password: `Admin123`

- NIM: `01` - Demo User
- NIM: `3312501041` - Crist Garcia Pasaribu
- NIM: `3312501040` - Cahyati Lamona Sitohang
- NIM: `3312501038` - Fazri Rahman
- NIM: `2006` - Takanashi Hoshino

## Configuration

Update the database connection settings in:
- `conn_db_users.php`
- `conn_db_notes.php`

Default settings:
```php
$host = "localhost";
$user = "root";
$pass = "";
```

## Security Notes

⚠️ **Important**: 
- Change default passwords in production
- Use prepared statements to prevent SQL injection
- Hash passwords using `password_hash()` function
- Enable HTTPS in production
- Restrict database user permissions
