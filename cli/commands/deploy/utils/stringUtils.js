const toSnakeCase = (str) => {
    return str
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        .toLowerCase();
};

module.exports = {
    toSnakeCase
};
