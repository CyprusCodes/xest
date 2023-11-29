const { convertSchema } = require("@sodaru/yup-to-json-schema");

const yupToJsonSchema = (schema) => {
  const jsonSchema = convertSchema(schema);

  if (!jsonSchema["properties"]) {
    return {
      ...jsonSchema,
      properties: {},
      required: []
    };
  }

  return jsonSchema;
};

module.exports = yupToJsonSchema;