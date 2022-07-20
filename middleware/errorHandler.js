class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
};

const errorHandler = (err, req, res, next) => {
    const { status, message } = err;
    if (!status) return res.status(500).json(message);
    return res.status(status).json({ message });
}

module.exports = {
    errorHandler,
    HttpError,
};


