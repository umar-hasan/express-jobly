"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u4Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        title: "New Job",
        salary: 55000,
        equity: 0.5,
        companyHandle: "c1",
    };

    test("ok for admin", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: "New Job",
                salary: 55000,
                equity: "0.5",
                companyHandle: "c1",
            }
        });
    });

    test("error for unauthorized users", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                title: "new",
                salary: 100,
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                ...newJob,
                salary: "not-a-number",
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body).toEqual({
            jobs:
                [
                    {
                        id: expect.any(Number),
                        title: "Job",
                        salary: 3000,
                        equity: "0.5",
                        companyHandle: "c1"
                    },
                    {
                        id: expect.any(Number),
                        title: "Job2",
                        salary: 2000,
                        equity: "0",
                        companyHandle: "c3"
                    },
                    {
                        id: expect.any(Number),
                        title: "Job3",
                        salary: 100000,
                        equity: "0.9",
                        companyHandle: "c3"
                    }
                ],
        });
    });

    test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query("DROP TABLE jobs CASCADE");
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
    });


    //Added test for filters.

    test('tests specific query parameters', async () => {
        let res = await request(app).get("/jobs?title=j&minSalary=3000&hasEquity=true")
        expect(res.body.jobs).toEqual(
            [
                {
                    title: "Job",
                    salary: 3000,
                    equity: "0.5",
                    companyhandle: "c1"
                },
                {
                    title: "Job3",
                    salary: 100000,
                    equity: "0.9",
                    companyhandle: "c3"
                }
            ]
        )

        res = await request(app).get("/jobs?title=j&minSalary=3000&hasEquity=true&asdf=asdf")
        expect(res.body).toEqual({
            "error": {
                "message": "asdf is not a valid parameter.",
                "status": 404
            }
        })

    })

});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs`);
        expect(resp.body).toEqual({
            jobs: [
                {
                    id: expect.any(Number),
                    title: "Job",
                    salary: 3000,
                    equity: "0.5",
                    companyHandle: "c1"
                },
                {
                    id: expect.any(Number),
                    title: "Job2",
                    salary: 2000,
                    equity: "0",
                    companyHandle: "c3"
                  },
                {
                    id: expect.any(Number),
                    title: "Job3",
                    salary: 100000,
                    equity: "0.9",
                    companyHandle: "c3"
                }
            ]
        });
    });


    test("not found for no such job", async function () {
        const resp = await request(app).get(`/jobs/99999`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
    test("works for admin", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .patch(`/jobs/${jobId}`)
            .send({
                title: "NewJob",
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: "NewJob",
                salary: 3000,
                equity: "0.5",
                companyHandle: "c1"
            },
        });
    });

    test("unauth for anon", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .patch(`/jobs/${jobId}`)
            .send({
                title: "NewJob",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("not found on no such job", async function () {
        const resp = await request(app)
            .patch(`/jobs/99999`)
            .send({
                title: "NewJob",
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("bad request on id change attempt", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .patch(`/jobs/${jobId}`)
            .send({
                id: 10,
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request on invalid data", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .patch(`/jobs/${jobId}`)
            .send({
                salary: "not-a-number",
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
    test("works for admin", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .delete(`/jobs/${jobId}`)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.body).toEqual({ deleted: `${jobId}` });
    });

    test("unauth for anon", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .delete(`/jobs/${jobId}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found for no such company", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        const resp = await request(app)
            .delete(`/jobs/99999`)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});
