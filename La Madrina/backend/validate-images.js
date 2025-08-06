#!/usr/bin/env node

// Image URL validation script
const https = require('https');
const http = require('http');

const testImageUrls = [
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1555507036-ab794f77665c?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=250&fit=crop&crop=center'
];

const checkImageUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 300
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message,
        success: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false
      });
    });
    
    req.end();
  });
};

async function validateAllImages() {
  console.log('🖼️  Validating product image URLs...\n');
  
  const results = await Promise.all(testImageUrls.map(checkImageUrl));
  
  let successCount = 0;
  let failCount = 0;
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'OK' : `FAILED (${result.status})`;
    
    console.log(`${icon} Image ${index + 1}: ${status}`);
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\n📊 Results: ${successCount} working, ${failCount} failed`);
  
  if (failCount === 0) {
    console.log('🎉 All product images are loading correctly!');
    process.exit(0);
  } else {
    console.log('⚠️  Some images failed to load. Check network connection or image URLs.');
    process.exit(1);
  }
}

validateAllImages().catch(console.error);
