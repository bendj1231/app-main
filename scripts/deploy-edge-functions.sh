#!/bin/bash

# Automated Edge Functions Deployment Script
# Deploys all authentication Edge Functions to Supabase

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

# Edge Functions to deploy
EDGE_FUNCTIONS=(
  "auth-login"
  "auth-signup"
  "auth-logout"
  "auth-refresh"
  "auth-verify"
)

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
    print_error "Project ID is required. Usage: ./deploy-edge-functions.sh [environment] [project_id]"
    exit 1
  fi
  
  print_info "Prerequisites check passed."
}

# Function to validate Edge Function files
validate_edge_functions() {
  print_info "Validating Edge Function files..."
  
  for func in "${EDGE_FUNCTIONS[@]}"; do
    func_path="supabase/functions/$func/index.ts"
    
    if [ ! -f "$func_path" ]; then
      print_error "Edge Function file not found: $func_path"
      exit 1
    fi
    
    print_info "✓ $func"
  done
  
  print_info "All Edge Function files validated."
}

# Function to backup current Edge Functions
backup_edge_functions() {
  print_info "Backing up current Edge Functions..."
  
  BACKUP_DIR="backups/edge-functions/$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  
  for func in "${EDGE_FUNCTIONS[@]}"; do
    supabase functions download "$func" --project-ref "$PROJECT_ID" --local-path "$BACKUP_DIR" || print_warning "Could not backup $func"
  done
  
  print_info "Backup completed: $BACKUP_DIR"
}

# Function to deploy Edge Function
deploy_edge_function() {
  local func=$1
  
  print_info "Deploying $func..."
  
  # Deploy the Edge Function
  supabase functions deploy "$func" \
    --project-ref "$PROJECT_ID" \
    --no-verify-jwt || {
      print_error "Failed to deploy $func"
      return 1
    }
  
  print_info "✓ $func deployed successfully"
}

# Function to verify Edge Function deployment
verify_edge_function() {
  local func=$1
  local edge_function_url="https://${PROJECT_ID}.supabase.co/functions/v1/$func"
  
  print_info "Verifying $func deployment..."
  
  # Try to call the Edge Function
  response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$edge_function_url" \
    -H "Content-Type: application/json" \
    -d '{}')
  
  if [ "$response" -eq 401 ] || [ "$response" -eq 403 ] || [ "$response" -eq 400 ]; then
    # These are expected responses for unauthenticated requests
    print_info "✓ $func is responding (HTTP $response)"
  elif [ "$response" -eq 200 ]; then
    print_info "✓ $func is responding (HTTP $response)"
  else
    print_warning "$func returned unexpected HTTP code: $response"
  fi
}

# Function to deploy all Edge Functions
deploy_all_edge_functions() {
  print_info "Deploying Edge Functions to $ENVIRONMENT environment..."
  print_info "Project ID: $PROJECT_ID"
  echo ""
  
  local failed_functions=()
  
  for func in "${EDGE_FUNCTIONS[@]}"; do
    if deploy_edge_function "$func"; then
      verify_edge_function "$func"
    else
      failed_functions+=("$func")
    fi
    echo ""
  done
  
  # Check if any deployments failed
  if [ ${#failed_functions[@]} -gt 0 ]; then
    print_error "The following Edge Functions failed to deploy:"
    for func in "${failed_functions[@]}"; do
      print_error "  - $func"
    done
    exit 1
  fi
}

# Function to run health checks
run_health_checks() {
  print_info "Running health checks..."
  
  for func in "${EDGE_FUNCTIONS[@]}"; do
    verify_edge_function "$func"
  done
  
  print_info "Health checks completed."
}

# Function to print deployment summary
print_summary() {
  print_info "==================================="
  print_info "Deployment Summary"
  print_info "==================================="
  print_info "Environment: $ENVIRONMENT"
  print_info "Project ID: $PROJECT_ID"
  print_info "Edge Functions Deployed: ${#EDGE_FUNCTIONS[@]}"
  print_info "Status: SUCCESS"
  print_info "==================================="
}

# Main deployment flow
main() {
  print_info "Starting Edge Functions deployment..."
  echo ""
  
  # Check prerequisites
  check_prerequisites
  
  # Validate Edge Function files
  validate_edge_functions
  
  # Backup current Edge Functions
  backup_edge_functions
  
  # Deploy all Edge Functions
  deploy_all_edge_functions
  
  # Run health checks
  run_health_checks
  
  # Print summary
  print_summary
  
  print_info "Edge Functions deployment completed successfully!"
}

# Run main function
main "$@"
