#!/bin/bash

# Complete Test Workflow Script
# Purpose: Automate execution of Setup -> Run Tests -> Teardown

set -e  # Exit immediately if a command fails

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Cleanup function
cleanup() {
    EXIT_CODE=$?
    echo ""
    echo "================================================"
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}Test workflow completed${NC}"
    else
        echo -e "${RED}Test workflow failed (exit code: $EXIT_CODE)${NC}"
    fi
    
    echo ""
    echo "Executing Teardown..."
    bash "${SCRIPT_DIR}/teardown-auto.sh" || true
    
    echo "================================================"
    exit $EXIT_CODE
}

# Register cleanup function
trap cleanup EXIT INT TERM

echo "================================================"
echo "Kong UI Automation Test Complete Workflow"
echo "================================================"

# Step 1: Setup
echo ""
echo -e "${YELLOW}Phase 1/3: Setup${NC}"
bash "${SCRIPT_DIR}/setup.sh"

# Step 2: Run tests
echo ""
echo -e "${YELLOW}Phase 2/3: Run Tests${NC}"
echo "================================================"
cd "${PROJECT_DIR}"
npm run cy:run

# Step 3: Teardown (handled by cleanup function)
echo ""
echo -e "${YELLOW}Phase 3/3: Teardown${NC}"
echo "Will be executed automatically on exit..."
