---
id: securing-api-endpoints
title: Securing API Endpoints
sidebar_label: Securing API Endpoints
---

## YUP Schema

Xest has Javascript schema builder; [**Yup**](https://github.com/jquense/yup) packed in and ready to be used for value parsing and validation. By convention the schema folder is suggested to be nested under the related controller function's folder as shown below;

```js
── deleteUserPayment
   ├── index.js
   └── schemas
       ├── deleteUserPaymentSchema.js
       └── queries
           └── selectUserPaymentById.js
```

## Securing Access To Resources With Yup Async Validators

For an endpoint to be secure, non-authorized users should be forbidden to modify or delete data. So userNo#1 should not be allowed to modify or delete userNo#2’s data.
With yup library’s built-in ‘test’ method you can check if the userId requesting to modify/delete the resource belongs to the user with the same userId.
You will need a query function to fetch the unique id of the data in the database and the userId coming from the header. If the unique id of the data matches with the user's id coming from the header; the result of the validation function will be true and the request will be validated.

All tests must provide a name, an error message and a validation function that must return true when the current value is valid and false or a ValidationError otherwise.

Query to fetch the unique id of the data and the user id;

```js
const { submitQuery, getFirst } = require("~root/lib/database");

const selectUserPaymentById = ({ userId, userPaymentId }) => submitQuery`
    SELECT 
        user_payment_id
    FROM user_payments
    WHERE user_id = ${userId} AND user_payment_id = ${userPaymentId};
`;

module.exports = getFirst(selectUserPaymentById, "user_payment_id");
```

Schema function;

```js
const yup = require("yup");
const selectUserPaymentById = require("./queries/selectUserPaymentById");

const deleteUserPaymentSchema = yup.object().shape({
  userPaymentId: yup
    .number()
    .required()
    .label("User Payment Id")
    .test(
      "doesUserPaymentBelongToUser",
      "Invalid User Payment Id",
      async function test(userPaymentId) {
        const { userId } = this.parent;
        return selectUserPaymentById({ userId, userPaymentId }).then(
          (userPayment) => {
            if (userPayment) {
              return true;
            }
            return false;
          }
        );
      }
    ),
});
module.exports = deleteUserPaymentSchema;
```

## Validating Request Payloads With Yup Schemas

With Yup Schema validation you can check if the information provided by a user is in the correct type of input.
You will be validating the data entered so instead of getting 500 API errors when the payload sent by the user is in the incorrect form you; will get a clear and constructive error message stating what the requirements of a field according to the database schema is. You will be creating schema with built in base methods and the bare minimum suggested is;

- ‘type’ which can be **string, number, object, array, boolean** etc…
- **‘label’** that will override the key name used in error messages.
- **‘typeError’** that will be thrown for failed type checks.

```js
const yup = require("yup");

const putUserDetailsSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be be less than 50 characters")
    .label("First Name")
    .typeError("Not a valid name"),
  lastName: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field has to be be less than 50 characters")
    .label("Last Name")
    .typeError("Not a valid name"),
  password: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(500, "This field has to be be less than 500 characters")
    .label("Password")
    .typeError("Not a valid password"),
  details: yup
    .object()
    .label("User Details")
    .typeError("Not valid user details"),
  email: yup
    .string()
    .min(1, "This field can not be empty!")
    .max(50, "This field should be less than 50 characters")
    .email()
    .label("Email")
    .typeError("Not a valid email address"),
});

module.exports = putUserDetailsSchema;
```

After creating the yup schema it's imported at the top level and used in the controller function within try and catch blocks of code.
Since the first thing you need to do before editing the database is to validate the entries, you will need to write the schema as the first function in the try and catch blocks. If all types of data are in the correct form, the user will be allowed to modify the database.

```js
  try {
    await patchUserDetailsSchema.validate(
      {
        firstName,
        lastName,
        password,
        details,
        email
      },
      {
        abortEarly: false
      }
    );

```

## Validating The Existence of a Record With Yup Schemas

Another way of using Yup schema is when you want to insert a new record to your the database that needs to refer to another table's data. You should be validating the existence of the record so that it can be inserted into the new table in the database. This is done with 'test' method again, below is an example of the query fetching the record from the database and then the query is imported in the schema function to be used in 'test' method. So if the data exist and the result is true, the request is validated.

```js
const { submitQuery, getFirst } = require("~root/lib/database");

const selectProviders = ({ providerId }) => submitQuery`
  SELECT 
    provider_id
  FROM providers
  WHERE provider_id = ${providerId};
  `;

module.exports = getFirst(selectProviders, "provider_id");
```

```js
const yup = require("yup");
const selectProviders = require("./queries/selectProviders");

const postUserProviderSchema = yup.object().shape({
  metadata: yup
    .object()
    .label("User Provider Details")
    .typeError("User provider details must be in JSON format"),
  providerId: yup
    .number()
    .required()
    .label("Provider Id")
    .test(
      "doesProviderExist",
      "Invalid Provider Id",
      async function test(providerId) {
        return selectProviders({ providerId }).then((provider) => {
          if (provider) {
            return true;
          }
          return false;
        });
      }
    ),
});
module.exports = postUserProviderSchema;
```
