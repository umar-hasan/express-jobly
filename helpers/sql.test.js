const db = require("../db")
const Company = require("../models/company")
const User = require("../models/user")
const { sqlForPartialUpdate } = require("./sql")

describe('sqlForPartialUpdate', () => {

    beforeEach(async () => {
        await db.query(`
            DELETE FROM users
            WHERE username=$1
        `, ["test"])

        await db.query(`
            DELETE FROM companies
            WHERE handle=$1
        `, ["test-comp"])

        await User.register({
            username: "test",
            password: "password",
            firstName: "First",
            lastName: "Last",
            email: "test@email.com",
            isAdmin: true
        })
        
        await Company.create({
            handle: "test-comp",
            name: "Test Company",
            numEmployees: 500,
            description: "This is a test company.",
            logoUrl: null
        })
    })

    test('returns specified columns and values to update a user', async () => {
        let dataUpdate = {
            firstName: "Some",
            lastName: "One"
        }
        let jsToSql = {
            firstName: "first_name",
            lastName: "last_name"
        }
        let { setCols, values } = sqlForPartialUpdate(dataUpdate, jsToSql)

        expect(setCols).toEqual("\"first_name\"=$1, \"last_name\"=$2")
        expect(values).toEqual(["Some", "One"])

        const usernameVarIdx = "$" + (values.length + 1)

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`

        const result = await db.query(querySql, [...values, "test"])

        const user = result.rows[0]

        expect(user).toEqual({
            username: "test",
            firstName: "Some",
            lastName: "One",
            email: "test@email.com",
            isAdmin: true
        })

    })


    test('returns specified columns and values to update a company', async () => {
        let dataUpdate = {
            numEmployees: 1000,
            logoUrl: "google.com"
        }
        let jsToSql = {
            numEmployees: "num_employees",
            logoUrl: "logo_url"
        }
        let { setCols, values } = sqlForPartialUpdate(dataUpdate, jsToSql)

        expect(setCols).toEqual("\"num_employees\"=$1, \"logo_url\"=$2")
        expect(values).toEqual([1000, "google.com"])

        const handleVarIdx = "$" + (values.length + 1)

        const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`

        const result = await db.query(querySql, [...values, "test-comp"])

        const company = result.rows[0]

        expect(company).toEqual({
            handle: "test-comp",
            name: "Test Company",
            description: "This is a test company.",
            numEmployees: 1000,
            logoUrl: "google.com"
        })

    })


})

afterAll(() => {
    db.end()
})

