#!/bin/bash

echo "🧪 Testing JRP Admin Dashboard Functionality"
echo "============================================"

BASE_URL="http://localhost:5001/api"

echo ""
echo "1. Testing Admin Login..."
RESPONSE=$(curl -s -c cookies.txt -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jrp.com",
    "password": "Admin123"
  }')

if echo "$RESPONSE" | grep -q "admin"; then
    echo "✅ Admin login successful"
else
    echo "❌ Admin login failed"
    exit 1
fi

echo ""
echo "2. Testing Admin Users Endpoint..."
USERS_RESPONSE=$(curl -s -b cookies.txt $BASE_URL/admin/users)
USER_COUNT=$(echo "$USERS_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

if [ "$USER_COUNT" -gt "0" ]; then
    echo "✅ Admin users endpoint working - Found $USER_COUNT users"
    echo "   Roles found: $(echo "$USERS_RESPONSE" | jq -r '.[].role' | sort | uniq -c)"
else
    echo "❌ Admin users endpoint failed or returned no data"
fi

echo ""
echo "3. Testing Admin Jobs Endpoint..."
JOBS_RESPONSE=$(curl -s -b cookies.txt $BASE_URL/admin/jobs)
JOB_COUNT=$(echo "$JOBS_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

if [ "$JOB_COUNT" -gt "0" ]; then
    echo "✅ Admin jobs endpoint working - Found $JOB_COUNT jobs"
    echo "   Sample job titles:"
    echo "$JOBS_RESPONSE" | jq -r '.[0:3][].title' | sed 's/^/   - /'
else
    echo "❌ Admin jobs endpoint failed or returned no data"
fi

echo ""
echo "4. Testing Regular Jobs Endpoint (Public)..."
PUBLIC_JOBS=$(curl -s $BASE_URL/jobs)
PUBLIC_JOB_COUNT=$(echo "$PUBLIC_JOBS" | jq '.jobs | length' 2>/dev/null || echo "0")

if [ "$PUBLIC_JOB_COUNT" -gt "0" ]; then
    echo "✅ Public jobs endpoint working - Found $PUBLIC_JOB_COUNT jobs"
else
    echo "❌ Public jobs endpoint failed"
fi

echo ""
echo "5. Summary of Test Credentials:"
echo "   👑 Admin: admin@jrp.com / Admin123"
echo "   💼 Employer: sarah@techcorp.com / Employer123"
echo "   🔍 Job Seeker: alex@example.com / Jobseeker123"

echo ""
echo "✅ All admin functionality tests completed!"
echo "   Frontend: http://localhost:5174"
echo "   Backend:  http://localhost:5001"

# Cleanup
rm -f cookies.txt
