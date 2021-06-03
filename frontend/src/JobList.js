import React, { useEffect, useState } from 'react'
import JoblyApi from './api'
import JobCard from './JobCard'
import Search from './Search'


export default function JobList() {
    const [jobs, setjobs] = useState([])

    useEffect(() => { }, [])

    const getJobs = async (q = "") => {
        let res = await JoblyApi.getAllJobs(q)
        setjobs(res)
    }

    return (
        <div className="col-md-8 offset-md-2">
            <Search search={getJobs} />
            {jobs.map((j) => {
                return <JobCard job={j} />
            })}
        </div>
    )
}
