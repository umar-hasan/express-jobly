import React, { useContext, useEffect, useState } from 'react'
import JoblyApi from './api'
import JobCard from './JobCard'
import UserContext from './UserContext'


export default function JobList() {
    const [jobs, setjobs] = useState([])

    const {currentUser} = useContext(UserContext)

    useEffect(() => {
        const getJobs = async () => {
            let res = await JoblyApi.getAllJobs()
            setjobs(res)
        }
        getJobs()
    }, [])

    return (
        <div className="col-md-8 offset-md-2">
            {jobs.map((j) => {
                return <JobCard job={j} />
            })}
        </div>
    )
}
