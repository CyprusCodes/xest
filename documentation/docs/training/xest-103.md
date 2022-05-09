---
id: xest-103
title: XEST-103 CRUD Operations
sidebar_label: XEST-103 CRUD Operations
---

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/1.png "crud")

In order to read/create/update/delete an artist you need 3 things;

1. Controller
2. Actions
3. Query functions

### Endpoints

Have a look at the folder structure you should be creating;



![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/4.png "structure")

In the app folder, you can see routers.js file where you will be writing your endpoints.

### Query Function, Action, Controller

1. Start by writing the query for inserting an artist in your `src/actions/artists/createArtist/queries/insertArtist.js`

```js
const { submitQuery, getInsertId } = require("~root/lib/database");

const insertArtist = ({ name, genre }) => submitQuery`
    INSERT INTO Artists(name, genre)
    VALUE(${name}, ${genre});
`;

module.exports = getInsertId(insertArtist);
```

2. Followed by that you need to write your action in your `src/actions/artists/createArtist/index.js`

```js
const insertArtist = require("./queries/insertArtist");

const createArtist = async ({ name, genre }) => {
  const artistId = await insertArtist({ name, genre });
  return { artistId };
};

module.exports = createArtist;
```

3. Start by writing a post function in your `src/app/controllers/Artists/postArtist/index.js` file which should look like the following

```js
const handleAPIError = require("~root/utils/handleAPIError");
const createArtist = require("~root/actions/artists/createArtist");

const postArtist = async (req, res) => {
  const { name, genre } = req.body;

  try {
    const { artistId } = await createArtist({ name, genre });

    res.status(201).send({
      artistId
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postArtist;
```

In this file, if the createArtist function works, you get 201 status code and get your artistId however if you have an error, you will get an API error accordingly. (these api errors will come from your constants folder; HttpStatusCodes.js file, feel free to go and check the relevant file.)

4. Then add the following;

```js
router.post("/artists", postArtist);
```

route to your `src/app/routes.js` after defining and requiring the function at the top of the file.

In these 3 files you can see that you have created a query first - used that query in your actions and use that action in your controller by importing each other.



