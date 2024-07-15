const { getDateRange, makeApiCall, pushDataToEndpoint } = require('./helpers');

async function fetchAllData() {
  const dateRange = getDateRange();

  const phoneApiCalls = [
    makeApiCall('/phone/call_history', dateRange),
    makeApiCall('/phone/call_logs', dateRange),
    makeApiCall('/phone/recordings', dateRange),
    makeApiCall('/phone/voicemails', dateRange),
    makeApiCall('/phone/sms', dateRange),
    makeApiCall('/phone/users')
  ];

  const userApiCalls = [
    makeApiCall('/users'),
    makeApiCall('/users/me/settings'),
    makeApiCall('/users/me/meetings'),
    makeApiCall('/users/me/webinars')
  ];

  try {
    const phoneResults = await Promise.allSettled(phoneApiCalls);
    const phoneData = phoneResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const userResults = await Promise.allSettled(userApiCalls);
    const userData = userResults
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const allData = { phoneData, userData };

    await pushDataToEndpoint(allData);

  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
  }
}

fetchAllData();
