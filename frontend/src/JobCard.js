import React, { useContext, useState, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import JoblyApi from './api'
import UserContext from './UserContext'

export default function JobCard({ job }) {

    const {currentUser} = useContext(UserContext)

    const [applied, setapplied] = useState(currentUser.applications.includes(job.id))

    useEffect(() => {
        setapplied(currentUser.applications.includes(job.id))
    }, [currentUser.applications])

    async function apply(id) {
        let res = await JoblyApi.applyToJob(currentUser.username, id)
        console.log(res)
        setapplied(true)
        return res
    }

    return (
        <Card key={job.id}>
            <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <p>Salary: <span>{job.salary}</span></p>
                <p>Equity: <span>{job.equity}</span></p>
                <Button onClick={() => apply(job.id)} disabled={applied}>
                    {applied ? "Applied" : "Apply"}
                </Button>
            </Card.Body>
        </Card>

    )
}
