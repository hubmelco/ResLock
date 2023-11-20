const request = async (path, options, query) => {
    try {
        const response = await fetch(`${path}?${new URLSearchParams(query).toString()}`, options)
        const json = await response.json();
        if (json.error) {
            return Promise.reject(json)
        }
        return json;
    } catch (err) {
        return Promise.reject(err)
    }
}

export default request;