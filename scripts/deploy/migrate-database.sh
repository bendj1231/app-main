#!/bin/bash

# Database Migration Automation Script
# Applies database migrations to Supabase

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
PROJECT_ID=${2:-}
SUPABASE_ACCESS_TOKEN=${SUPABASE_ACCESS_TOKEN:-}
MIGRATION_DIR=${3:-supabase/migrations}

# Function to print colored output
print_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
  print_info "Checking prerequisites..."
  
  # Check if Supabase CLI is installed
  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first."
    print_info "Install with: npm install -g supabase"
    exit 1
  fi
  
  # Check if SUPABASE_ACCESS_TOKEN is set
  if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    print_error "SUPABASE_ACCESS_TOKEN environment variable is not set."
    exit 1
  fi
  
  # Check if PROJECT_ID is provided
  if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID is required. Usage: ./migrate-database.sh [environment] [project_id] [migration_dir]"
    exit 1
  fi
  
  # Check if migration directory exists
  if [ ! -d "$MIGRATION_DIR" ]; then
    print_warning "Migration directory not found: $MIGRATION_DIR"
    print_info "Creating migration directory..."
    mkdir -p "$MIGRATION_DIR"
  fi
  
  print_info "Prerequisites check passed."
}

# Function to backup database
backup_database() {
  print_info "Creating database backup..."
  
  BACKUP_DIR="backups/database/$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  
  # Create database dump
  supabase db dump \
    --project-ref "$PROJECT_ID" \
    --file "$BACKUP_DIR/backup.sql" || {
      print_error "Failed to create database backup"
      exit 1
    }
  
  print_info "Backup created: $BACKUP_DIR/backup.sql"
}

# Function to get pending migrations
get_pending_migrations() {
  print_info "Checking for pending migrations..."
  
  # Get list of migration files
  if [ -d "$MIGRATION_DIR" ]; then
    ls -1 "$MIGRATION_DIR"/*.sql 2>/dev/null | sort
  else
    print_warning "No migration files found"
    echo ""
  fi
}

# Function to apply migration
apply_migration() {
  local migration_file=$1
  local migration_name=$(basename "$migration_file")
  
  print_info "Applying migration: $migration_name"
  
  # Apply migration using Supabase CLI
  supabase db execute \
    --project-ref "$PROJECT_ID" \
    --file "$migration_file" || {
      print_error "Failed to apply migration: $migration_name"
      return 1
    }
  
  print_info "✓ Migration applied successfully: $migration_name"
}

# Function to record migration
record_migration() {
  local migration_name=$1
  
  print_info "Recording migration in database..."
  
  # Create migrations table if it doesn't exist
  supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT NOW()
    );" || print_warning "Could not create migrations table"
  
  # Record migration
  supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "INSERT INTO schema_migrations (migration_name) VALUES ('$migration_name') ON CONFLICT (migration_name) DO NOTHING;" || print_warning "Could not record migration"
}

# Function to check if migration is already applied
is_migration_applied() {
  local migration_name=$1
  
  # Check if migration exists in migrations table
  result=$(supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "SELECT COUNT(*) FROM schema_migrations WHERE migration_name = '$migration_name';" 2>/dev/null | grep -oP '\d+' || echo "0")
  
  if [ "$result" -gt 0 ]; then
    return 0
  else
    return 1
  fi
}

# Function to apply all pending migrations
apply_pending_migrations() {
  print_info "Applying pending migrations..."
  echo ""
  
  local pending_migrations=$(get_pending_migrations)
  local applied_count=0
  local skipped_count=0
  
  if [ -z "$pending_migrations" ]; then
    print_info "No pending migrations to apply."
    return 0
  fi
  
  for migration in $pending_migrations; do
    local migration_name=$(basename "$migration")
    
    # Check if migration is already applied
    if is_migration_applied "$migration_name"; then
      print_info "⊘ Skipping already applied migration: $migration_name"
      ((skipped_count++))
      continue
    fi
    
    # Apply migration
    if apply_migration "$migration"; then
      record_migration "$migration_name"
      ((applied_count++))
    else
      print_error "Migration failed: $migration_name"
      print_info "Rolling back..."
      rollback_database
      exit 1
    fi
  done
  
  echo ""
  print_info "Migration summary:"
  print_info "  Applied: $applied_count"
  print_info "  Skipped: $skipped_count"
}

# Function to rollback last migration
rollback_database() {
  print_info "Rolling back last migration..."
  
  # Get last applied migration
  last_migration=$(supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "SELECT migration_name FROM schema_migrations ORDER BY applied_at DESC LIMIT 1;" 2>/dev/null | grep -oP '(?<=migration_name: ).*' || echo "")
  
  if [ -z "$last_migration" ]; then
    print_warning "No migrations to rollback."
    return 0
  fi
  
  print_info "Rolling back: $last_migration"
  
  # Remove migration record
  supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "DELETE FROM schema_migrations WHERE migration_name = '$last_migration';" || print_warning "Could not remove migration record"
  
  print_info "Rollback completed. Note: This only removes the migration record. Manual rollback may be required."
}

# Function to verify migration
verify_migration() {
  print_info "Verifying migration..."
  
  # Check if migrations table exists and has records
  result=$(supabase db execute \
    --project-ref "$PROJECT_ID" \
    --sql "SELECT COUNT(*) FROM schema_migrations;" 2>/dev/null | grep -oP '\d+' || echo "0")
  
  print_info "Total migrations applied: $result"
}

# Function to print migration summary
print_summary() {
  print_info "==================================="
  print_info "Migration Summary"
  print_info "==================================="
  print_info "Environment: $ENVIRONMENT"
  print_info "Project ID: $PROJECT_ID"
  print_info "Migration Directory: $MIGRATION_DIR"
  print_info "Status: SUCCESS"
  print_info "==================================="
}

# Main migration flow
main() {
  print_info "Starting database migration..."
  echo ""
  
  # Check prerequisites
  check_prerequisites
  
  # Create backup
  backup_database
  
  # Apply pending migrations
  apply_pending_migrations
  
  # Verify migration
  verify_migration
  
  # Print summary
  print_summary
  
  print_info "Database migration completed successfully!"
}

# Rollback mode
if [ "$1" == "rollback" ]; then
  rollback_database
  exit 0
fi

# Run main function
main "$@"
