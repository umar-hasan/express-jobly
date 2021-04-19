"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");
const Job = require("./job");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function () {
    test('creates a new job', async () => {
        const job = await Job.create({
            title: "J4",
            salary: 40000,
            equity: 0.7,
            companyHandle: "c1"
        })
        expect(job).toEqual({
            id: expect.any(Number),
            title: "J4",
            salary: 40000,
            equity: "0.7",
            companyHandle: "c1"
        })

    })

})


/************************************** findAll */

describe("findAll", function () {
    test("finds all jobs", async function () {
        const jobs = await Job.findAll()
        expect(jobs).toEqual([
            { companyHandle: "c1", equity: "0.9", id: expect.any(Number), salary: 50000, title: "J1" },
            { companyHandle: "c2", equity: "0.5", id: expect.any(Number), salary: 90000, title: "J2" },
            { companyHandle: "c2", equity: "0.8", id: expect.any(Number), salary: 100000, title: "J3" }
        ])
    });

});


/************************************** get */

describe("get", function () {
    test("gets job by id", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]

        let job = await Job.get(jobId);
        expect(job).toEqual({
            companyHandle: "c1",
            equity: "0.9",
            id: expect.any(Number),
            salary: 50000,
            title: "J1"
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.get(99999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** findByCompany */

describe("findByCompany", function () {

    test("finds all jobs by company", async function () {
        const jobs = await Job.findByCompany("c1")
        expect(jobs).toEqual([
            { equity: "0.9", id: expect.any(Number), salary: 50000, title: "J1" }
        ])
    });

    test("empty array if no job found", async function () {
        const jobs = await Job.findByCompany("c3")
        expect(jobs).toEqual([])
    });

});


/************************************** search */

describe("search", function () {

    test("searches jobs with specified filters", async function () {
        const jobs = await Job.search({
            title: "J",
            minSalary: 90000,
            hasEquity: true
        })
        expect(jobs).toEqual([
            { companyhandle: "c2", equity: "0.5", salary: 90000, title: "J2" },
            { companyhandle: "c2", equity: "0.8", salary: 100000, title: "J3" }
        ])
    });

    test("throws error if invalid params", async function () {
        try {
            const jobs = await Job.search({
                title: "J",
                minSalary: 90000,
                hasEquity: true,
                asdf: "asdf"
            })
            fail()
        } catch (error) {
            expect(error instanceof NotFoundError).toBeTruthy()
        }
    });

});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "NewJob",
        salary: 100000,
        equity: 0.0
    };

    test("updates a job", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]

        let job = await Job.update(jobId, updateData);
        expect(job).toEqual({
            id: jobId,
            title: "NewJob",
            salary: 100000,
            equity: "0",
            companyHandle: "c1"
        });
    });

    test("not found if id is invalid", async function () {
        try {
            await Job.update(99999, {
                title: "test",
            });
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request if company handle is included", async function () {
        expect.assertions(1);
        try {
            const jobRes = await db.query(`
                SELECT id FROM jobs
            `)
            const jobId = jobRes.rows[0]["id"]
            await Job.update(jobId, {
                company_handle: "c2"
            });
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("removes a job", async function () {
        const jobRes = await db.query(`
            SELECT id FROM jobs
        `)
        const jobId = jobRes.rows[0]["id"]
        await Job.remove(jobId);
        const res = await db.query(
            `SELECT * FROM jobs WHERE id=$1`, [jobId]);
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(99999);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
