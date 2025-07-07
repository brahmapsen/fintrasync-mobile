const API_BASE_URL = "https://fintra-i4e0.onrender.com";

/**
 * Check if the MCP API server is running
 * @returns Promise resolving to [isRunning: boolean, responseData: any]
 */
export async function checkApiStatus(): Promise<[boolean, any]> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // AbortSignal to implement timeout
      signal: AbortSignal.timeout(40000), // 40 seconds timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return [response.status === 200, data];
    }
    
    return [false, null];
  } catch (error) {
    console.error('API status check failed:', error);
    return [false, null];
  }
}
