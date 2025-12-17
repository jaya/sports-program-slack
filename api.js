const urlApi = process.env.API_URL;

export async function getActivities(userId) {
    console.log(userId);
    const response = await fetch(`${urlApi}/activities`, {
        method: 'GET',
        headers: {
            'x-slack-user-id': userId,
        },
    });
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

export async function getPrograms(userId) {
    const response = await fetch(`${urlApi}/programs`, {
        method: 'GET',
        headers: {
            'x-slack-user-id': userId,
        },
    });
    return response.json();
}

export async function createProgram(userId, payload) {
    const response = await fetch(`${urlApi}/programs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-slack-user-id': userId,
        },
        body: JSON.stringify(payload)
    });

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
