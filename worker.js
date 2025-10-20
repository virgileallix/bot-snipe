/**
 * Cloudflare Worker to proxy Roblox API requests
 * This bypasses CORS issues when calling Roblox APIs from the browser
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  const url = new URL(request.url)

  // Get the target Roblox API URL from query parameter
  const targetUrl = url.searchParams.get('url')

  if (!targetUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400)
  }

  // Validate it's a Roblox domain
  const allowedDomains = [
    'catalog.roblox.com',
    'economy.roblox.com',
    'thumbnails.roblox.com',
    'apis.roblox.com',
    'www.roblox.com'
  ]

  let isAllowed = false
  for (const domain of allowedDomains) {
    if (targetUrl.includes(domain)) {
      isAllowed = true
      break
    }
  }

  if (!isAllowed) {
    return jsonResponse({ error: 'Domain not allowed' }, 403)
  }

  try {
    // Fetch from Roblox API
    const robloxResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })

    const data = await robloxResponse.json()

    // Return with CORS headers
    return jsonResponse(data, robloxResponse.status)

  } catch (error) {
    return jsonResponse({
      error: 'Failed to fetch from Roblox API',
      details: error.message
    }, 500)
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
