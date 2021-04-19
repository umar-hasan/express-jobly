"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
    /** Create a job (from data), update db, return new job data.
     *
     * data should be { title, salary, equity, companyHandle }
     *
     * Returns { id, title, salary, equity, companyHandle }
     *
     * */

    static async create({ title, salary, equity, companyHandle }) {
        // const duplicateCheck = await db.query(
        //     `SELECT title, company_handle
        //      FROM jobs
        //      WHERE title = $1 AND company_handle = $2`,
        //      [title, companyHandle]);

        // if (duplicateCheck.rows[0])
        //     throw new BadRequestError(`Job title ${title} with company handle ${companyHandle} already exists.`);

        const result = await db.query(
            `INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
            [
                title,
                salary,
                equity,
                companyHandle
            ]
        );
        const job = result.rows[0];

        return job;
    }

    /** Find all jobs.
     *
     * Returns [{ id, title, salary, equity, comanyHandle }, ...]
     * */

    static async findAll() {
        const jobsRes = await db.query(
            `SELECT id,
                    title, 
                    salary, 
                    equity, 
                    company_handle AS "companyHandle"
            FROM jobs
            ORDER BY company_handle`);
        return jobsRes.rows;
    }

    /** Given a job id, return data about job.
     *
     * Returns { id, title, salary, equity, companyHandle }
     *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const jobRes = await db.query(
            `SELECT id,
                    title, 
                    salary, 
                    equity, 
                    company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
                [id]);

        const job = jobRes.rows[0];

        if (!job) throw new NotFoundError(`A job with that id does not exist.`);

        return job;
    }

    /** Finds all jobs under a company handle.
     *
     * Returns [{ id, title, salary, equity }, ...]
     *
     **/

     static async findByCompany(companyHandle) {
        const jobRes = await db.query(
            `SELECT id,
                    title, 
                    salary, 
                    equity
            FROM jobs
            WHERE company_handle = $1`,
                [companyHandle]);

        const jobs = jobRes.rows;

        return jobs;
    }

    /** Searches jobs based on specific filter parameters given.
     * 
     * Parameters can include: ["title", "minSalary", "hasEquity"]
     * 
     * Returns a list of jobs matching filters.
     */

    static async search(params) {
        const validParams = ["title", "minSalary", "hasEquity"]
        let cols = []
        let queries = []
        for (let key in params) {
            if (!validParams.includes(key)) {
                throw new NotFoundError(`${key} is not a valid parameter.`)
            }
            if (key === validParams[0]) {
                cols.push("title")
                queries.push(`title ILIKE '%' || $${queries.length + 1} || '%'`)
            }
            if (key === validParams[1]) {
                cols.push("salary")
                queries.push(`salary >= $${queries.length + 1}`)
            }
            if (key === validParams[2] && params["hasEquity"]) {
                cols.push("equity")
                queries.push(`equity > 0`)
                delete params.hasEquity
            }
        }
        const jobRes = await db.query(
            `SELECT title, salary, equity, company_handle AS companyHandle
             FROM jobs
             WHERE ${queries.join(" AND ")}`,
                    Object.values(params))

        const jobs = jobRes.rows

        if (!jobs || jobs.length === 0) throw new NotFoundError(`No jobs found.`)

        return jobs

    }

    /** Update job data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: {title, salary, equity}
     *
     * Returns {id, title, salary, equity, companyHandle}
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        if (data["id"] || data["company_handle"]) {
            throw new BadRequestError("You cannot change the id or company handle!")
        }
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id, 
                                    title, 
                                    salary, 
                                    equity, 
                                    company_handle AS "companyHandle"`;
        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`A job with that id does not exist.`);

        return job;
    }

    /** Delete a job from database; returns undefined.
     *
     * Throws NotFoundError if job not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE
             FROM jobs
             WHERE id = $1
             RETURNING id`,
            [id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`A job with that id does not exist.`);
    }
}


module.exports = Job;
