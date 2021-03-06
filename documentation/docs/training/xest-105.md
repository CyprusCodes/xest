---
id: xest-105
title: XEST-105 Updating Artists
sidebar_label: XEST-105 Updating Artists
---

Now it is getting a bit more tricky.

It is great that we can create and list Artist records using our API now. What if we wanted to update a record? Maybe there is a typo in the Artist name, or you want to change the genre of an artist record. That sounds like a job for the HTTP PUT or PATCH verbs. Both of these methods are typically used to edit or update a resource in slightly different ways: The PUT HTTP request method is typically used to signify a total replacement of a resource The data in the database would be totally replaced with the data sent in the request body The PATCH HTTP request method is typically used to signify a partial replacement of a resource The data in the database would be merged with the data sent in the request body.

So given an artist record:

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/21.png "id123")

If you sent the following request payload with a PUT request

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/22.png "jazz")

then you would expect the artist record after the update to look like this:

![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/23.png "123jazz")

Note that the name field has been removed, because it was not in the request body, and we have totally overwritten the stored data.

If the same request body was sent in fa PATCH request however, you would expect the artist record after the update to look like this:


![alt_text](https://minio.cypruscodes.com/beckend-new-chapter/24.png "123frankjazz")

Here, only part of the data has been updated - the part that was sent in the request.

So now, lets create your route at routes.js file. (Do not forget to import the **updaTeArtistById** at the top of the file)

```js
router.patch("/artist/:artistId", updateArtistById);
```

It’s time to create **updateArtistById**;

```js
const modifyArtistById = require("~root/actions/artists/modifyArtistById");
const handleAPIError = require("~root/utils/handleAPIError");

const patchArtistById = async (req, res) => {
 const { artistId } = req.params;
 const { genre, name } = req.body;

 try {
   const { artist } = await modifyArtistById({
     artistId,
     genre,
     name
   });

   res.status(201).send({
     artist
   });
 } catch (err) {
   handleAPIError(res, err);
 }
};

module.exports = patchArtistById;
```

The id will be given as a parameter and the body that you want to change will be in the body.

In `app/actions/artists` create your `modifyArtistById` folder.

Create `index.js`file and queries folder under it. Index.js will be like below;

```js
const updateArtistById = require("./queries/updateArtistById");

const modifyArtistById = async ({ artistId, genre, name }) => {
 const artist = await updateArtistById({
   artistId,
   genre,
   name
 });

 return { artist };
};

module.exports = modifyArtistById;
```

Here comes the tricky part, the query file updateArtistById. You will give the initial, default value of null to genre and name. In case either of them or both of them are not null, the given value in the body will be changed.

```js
const { submitQuery, sql, sqlReduce } = require("~root/lib/database");

const updateArtistById = ({ artistId, genre = null, name = null }) => {
 const updates = [];

 if (genre !== null) {
   updates.push(sql`genre = ${genre}`);
 }

 if (name !== null) {
   updates.push(sql`name = ${name}`);
 }

 if (updates.length !== 0) {
   return submitQuery`
   UPDATE
     Artists
   SET
     ${updates.reduce(sqlReduce)}
   WHERE
     artist_id = ${artistId};
 `;
 }
 return Promise.resolve();
};

module.exports = updateArtistById;
```

Lets try it on postman! Feel free to change only name, then only genre and watch your change on your SQL workbench!