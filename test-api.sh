#!/bin/bash

# Arctic Network API Test Suite
# Run this after starting the backend server

API_URL="${1:-http://localhost:3000}"
RESET='\033[0m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'

echo -e "${BLUE}🌍 Arctic Network API Test Suite${RESET}"
echo "API URL: $API_URL"
echo "================================"
echo ""

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local expected_code="$4"

    echo -e "${YELLOW}Testing:${RESET} $name"
    echo "  Method: $method $endpoint"

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    else
        response=$(curl -s -X "$method" -w "\n%{http_code}" "$API_URL$endpoint")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "$expected_code" ]; then
        echo -e "  ${GREEN}✓ Status: $http_code${RESET}"
    else
        echo -e "  ${RED}✗ Status: $http_code (expected $expected_code)${RESET}"
    fi

    echo "  Response preview:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body" | head -c 200
    echo ""
    echo ""
}

# Health check
test_endpoint "Health Check" "GET" "/api/health" "200"

# Dashboard data
test_endpoint "Get All Dashboard Data" "GET" "/api/dashboard" "200"

# Specific metrics
test_endpoint "Get Temperature Metric" "GET" "/api/dashboard/metric/temperature" "200"
test_endpoint "Get Ice Coverage Metric" "GET" "/api/dashboard/metric/ice_coverage" "200"
test_endpoint "Get Pollution Metric" "GET" "/api/dashboard/metric/pollution" "200"
test_endpoint "Get Wildlife Metric" "GET" "/api/dashboard/metric/wildlife" "200"
test_endpoint "Get Wind Speed Metric" "GET" "/api/dashboard/metric/wind_speed" "200"
test_endpoint "Get Sea Level Metric" "GET" "/api/dashboard/metric/sea_level" "200"

# Invalid metric
test_endpoint "Get Invalid Metric (404)" "GET" "/api/dashboard/metric/invalid" "404"

# History data
test_endpoint "Get Temperature History" "GET" "/api/dashboard/history?type=temperature&limit=10" "200"
test_endpoint "Get Ice Coverage History" "GET" "/api/dashboard/history?type=ice_coverage&limit=20" "200"
test_endpoint "Get Pollution History" "GET" "/api/dashboard/history?type=pollution&limit=30" "200"

echo -e "${GREEN}================================${RESET}"
echo -e "${GREEN}All tests completed!${RESET}"
echo ""
echo "💡 Tip: Run this script multiple times to see data changes:"
echo "  sleep 5 && ./test-api.sh"
echo ""
echo "📊 Monitor data updates in real-time:"
echo "  watch -n 1 'curl -s $API_URL/api/dashboard | jq .data.temperature'"
