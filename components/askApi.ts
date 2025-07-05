//const ASK_API_URL = 'http://localhost:8000/triage';
//const ASK_API_URL = 'http://192.168.1.66:8000/triage'; // local server
const ASK_API_URL = 'https://askapi.onrender.com/triage';


export async function sendAskMessage(message: string, userId: string = 'test123') {
  // alert(ASK_API_URL);
  const response = await fetch(ASK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message,
    }),
  });
  if (!response.ok) {
    throw new Error('Server error');
  }
  return response.json();
} 