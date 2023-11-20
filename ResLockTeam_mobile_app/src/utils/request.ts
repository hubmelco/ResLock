const request = async (path:string, options?: RequestInit, query?: Record<string, string>): Promise<any> => {
    try {
        const response = await fetch(`${path}?${new URLSearchParams(query).toString()}`, options);
        const json = await response.json();
        if (!response.ok) {
            // status is only appended on errors so we can tell the difference between 4xx and 5xx errors
            return Promise.reject({status: response.status, ...json})
        }
        return json;
    } catch (err) {
        return Promise.reject(err)
    }
}

export default request;