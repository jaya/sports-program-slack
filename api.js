const urlApi = process.env.API_URL;

async function request(endpoint, options = {}, userId) {
    const defaultHeaders = {
        'x-slack-user-id': userId,
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${urlApi}${endpoint}`, config);

    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `API returned ${response.status}`;
        try {
            const errorData = JSON.parse(errorBody);
            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch (e) {
            // If parsing fails, use the default error message
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getActivities(userId) {
    return request('/activities', { method: 'GET' }, userId);
}

export async function getPrograms(userId) {
    return request('/programs', { method: 'GET' }, userId);
}

export async function createProgram(userId, payload) {
    return request('/programs', {
        method: 'POST',
        body: JSON.stringify(payload)
    }, userId);
}
