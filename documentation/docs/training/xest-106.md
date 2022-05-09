---
id: xest-106
title: XEST-106 First Test
sidebar_label: XEST-106 First Test
---
Since we have finished writing our data now we should test them. Before starting writing the tests, think about what you will need as a before or after hook so that our original database will not change?

It is time to do an integration test for the written endpoint. First thing to remember, as your app should be running when sending requests on postman, the same should be while integration testing. The meaning of Integration testing is quite straightforward- Integrate/combine the units and test the behaviour as a combined unit. The main function or goal of this testing is to test combinational behaviour, and validate whether the requirements are implemented correctly or not. Previously you have used jest testing framework, this time we are going to use a combination of Mocha, Chai and Supertest testing tools to test REST API. In your root folder, there is a test folder.

You will need to create your test folders under as `[directory_name] > tests > testingfilename.test.js`

testingfilename.test.js could be getAllArtists.test.js for testing the endpoint;

```js
router.get("/artists", getAllArtists);
```

In xest, mocha, chai and supertest are installed as development dependencies, when you created your app in the first place, they were all packed for you. So you do not need to install them. We will **require** pre-written functionality of **expect** from Chai and Supertest which we use because it creates a test server for us so we can properly test our API and replicate what it will do when connected to a real server.Now that we have all necessary fragments, we can write our tests. The testing framework we are using for this project is Mocha which is another JavaScript testing framework.

```js
const { expect } = require("chai");
const request = require("supertest");
const router = require("~root/app");
const safeDescribe = require("~test/utils/safeDescribe");
```

### Useful Links

Useful Links:

- Link: <https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/>
- Link: <https://medium.com/practical-software-testing/javascript-testing-with-mocha-a-series-f4bfcab26532>


---
From here on out, the training wheels are off - you will be expected to complete the remainder of the application - that is Albums and Songs - with what you have learnt so far. If you are unsure of anything you have done so far, it would be a good idea at this stage to go back through and re-familiarise yourself.



### add test


---
You can find the example finished API at [here](https://github.com/PemMmM/music-library-api).


