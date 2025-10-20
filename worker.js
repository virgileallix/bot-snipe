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

    // If this is a catalog search and we only got IDs, fetch full details
    if (targetUrl.includes('catalog.roblox.com/v1/search/items') && data.data) {
      const enrichedData = []

      // Fetch details for each item (in batches to avoid timeout)
      for (const item of data.data.slice(0, 50)) { // Limit to 50 items to avoid timeout
        try {
          const detailsUrl = `https://economy.roblox.com/v2/assets/${item.id}/details`
          const detailsResponse = await fetch(detailsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          })

          if (detailsResponse.ok) {
            const details = await detailsResponse.json()
            enrichedData.push({ ...item, ...details })
          } else {
            enrichedData.push(item) // Keep original if details fail
          }
        } catch (err) {
          enrichedData.push(item) // Keep original on error
        }
      }

      data.data = enrichedData
    }

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
