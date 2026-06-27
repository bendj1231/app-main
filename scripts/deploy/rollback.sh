#!/bin/bash

# Automated Rollback Script
# Rolls back Edge Functions and database to previous version

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_ID=${2:-}
SUPABASE_ACCESS_TOKEN=${SUPABASE_ACCESS_TOKEN:-}
ROLLBACK_TYPE=${3:-full}

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
    exit 1
  fi
  
  # Check if SUPABASE_ACCESS_TOKEN is set
  if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    print_error "SUPABASE_ACCESS_TOKEN environment variable is not set."
    exit 1
  fi
  
  # Check if PROJECT_ID is provided
  if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID is required. Usage: ./rollback.sh [environment] [project_id] [rollback_type]"
    exit 1
  fi
  
  print_info "Prerequisites check passed."
}

# Function to get latest backup
get_latest_backup() {
  print_info "Finding latest backup..."
  
  BACKUP_DIR="backups/database"
  
  if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Backup directory not found: $BACKUP_DIR"
    exit 1
  fi
  
  # Get latest backup file
  LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup-*.sql 2>/dev/null | head -1)
  
  if [ -z "$LATEST_BACKUP" ]; then
    print_error "No backup files found in $BACKUP_DIR"
    exit 1
  fi
  
  print_info "Latest backup: $LATEST_BACKUP"
  echo "$LATEST_BACKUP"
}

# Function to get latest Edge Functions backup
get_latest_edge_functions_backup() {
  print_info "Finding latest Edge Functions backup..."
  
  BACKUP_DIR="backups/edge-functions"
  
  if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Edge Functions backup directory not found: $BACKUP_DIR"
    exit 1
  fi
  
  # Get latest backup directory
  LATEST_BACKUP=$(ls -t "$BACKUP_DIR" 2>/dev/null | head -1)
  
  if [ -z "$LATEST_BACKUP" ]; then
    print_error "No Edge Functions backup found in $BACKUP_DIR"
    exit 1
  fi
  
  print_info "Latest Edge Functions backup: $BACKUP_DIR/$LATEST_BACKUP"
  echo "$BACKUP_DIR/$LATEST_BACKUP"
}

# Function to rollback Edge Functions
rollback_edge_functions() {
  print_info "Rolling back Edge Functions..."
  
  local backup_dir=$(get_latest_edge_functions_backup)
  
  # Deploy each Edge Function from backup
  for func_dir in "$backup_dir"/*; do
    if [ -d "$func_dir" ]; then
      local func_name=$(basename "$func_dir")
      print_info "Rolling back $func_name..."
      
      # Deploy the backup version
      supabase functions deploy "$func_name" \
        --project-ref "$PROJECT_ID" \
        --no-verify-jwt \
        --local-path "$func_dir" || {
          print_error "Failed to rollback $func_name"
          return 1
      }
      
      print_info "✓ $func_name rolled back"
    fi
  done
  
  print_info "Edge Functions rollback completed."
}

# Function to rollback database
rollback_database() {
  print_info "Rolling back database..."
  
  local backup_file=$(get_latest_backup)
  
  # Restore database from backup
  supabase db restore \
    --project-ref "$PROJECT_ID" \
    --file "$backup_file" || {
      print_error "Failed to restore database from backup"
      return 1
    }
  
  print_info "Database rollback completed."
}

# Function to rollback frontend
rollback_frontend() {
  print_info "Rolling back frontend..."
  
  # This would typically involve:
  # 1. Reverting to previous deployment in Vercel/Netlify
  # 2. Or deploying previous build artifact
  
  print_warning "Frontend rollback requires manual intervention"
  print_info "Please rollback frontend in your deployment platform"
  print_info "Vercel: Use 'vercel rollback' command"
  print_info "Netlify: Use 'netlify rollback' command"
}

# Function to verify rollback
verify_rollback() {
  print_info "Verifying rollback..."
  
  # Run deployment verification tests
  if [ -f "tests/deployment-verification.ts" ]; then
    print_info "Running deployment verification tests..."
    npx ts-node tests/deployment-verification.ts || {
      print_warning "Deployment verification tests failed"
      print_warning "Please verify the rollback manually"
    }
  fi
  
  print_info "Rollback verification completed."
}

# Function to notify team
notify_team() {
  print_info "Notifying team of rollback..."
  
  # Send notification to Slack
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"text\": \"Rollback completed\",
        \"blocks\": [
          {
            \"type\": \"section\",
            \"text\": {
              \"type\": \"mrkdwn\",
              \"text\": \"*Rollback Completed*\n\nEnvironment: $ENVIRONMENT\nProject: $PROJECT_ID\nType: $ROLLBACK_TYPE\nTime: $(date)\"
            }
          }
        ]
      }" || print_warning "Failed to send Slack notification"
  fi
  
  print_info "Team notification completed."
}

# Function to print rollback summary
print_summary() {
  print_info "==================================="
  print_info "Rollback Summary"
  print_info "==================================="
  print_info "Environment: $ENVIRONMENT"
  print_info "Project ID: $PROJECT_ID"
  print_info "Rollback Type: $ROLLBACK_TYPE"
  print_info "Status: SUCCESS"
  print_info "==================================="
}

# Main rollback flow
main() {
  print_info "Starting rollback..."
  print_warning "This will rollback the deployment to the previous version"
  print_warning "Please ensure you have a recent backup available"
  echo ""
  
  # Check prerequisites
  check_prerequisites
  
  # Perform rollback based on type
  case $ROLLBACK_TYPE in
    full)
      rollback_edge_functions
      rollback_database
      rollback_frontend
      ;;
    edge-functions)
      rollback_edge_functions
      ;;
    database)
      rollback_database
      ;;
    frontend)
      rollback_frontend
      ;;
    *)
      print_error "Invalid rollback type: $ROLLBACK_TYPE"
      print_info "Valid types: full, edge-functions, database, frontend"
      exit 1
      ;;
  esac
  
  # Verify rollback
  verify_rollback
  
  # Notify team
  notify_team
  
  # Print summary
  print_summary
  
  print_info "Rollback completed successfully!"
  print_warning "Please verify the application is working correctly"
  print_warning "Monitor for any issues in the next 24 hours"
}

# Run main function
main "$@"
