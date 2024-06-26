const fs = require("fs");
const path = require("path");

const loadFileContent = (fileName) => {
    try {
        const filePath = path.join(__dirname, fileName); // Adjust the path as per your project structure
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error loading file ${fileName}: ${error.message}`);
        return ''; // Return empty string or handle error as needed
    }
};

const indexFile = loadFileContent('./stack/index.ts');
const rdsFile = loadFileContent('./stack/rds.ts');
const vpcFile = loadFileContent('./stack/vpc.ts');
const elasticFile = loadFileContent('./stack/elastic-beanstalk.ts');
const variableFile = loadFileContent('./stack/variables.js');

module.exports = {
    indexFile,
    rdsFile,
    vpcFile,
    elasticFile,
    variableFile,
};
