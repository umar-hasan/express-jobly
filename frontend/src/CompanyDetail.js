import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import JoblyApi from './api'
import JobCard from './JobCard'

export default function CompanyDetail() {
    const companyParam = useParams()
    const [company, setcompany] = useState({})
    const [jobs, setjobs] = useState([])

    useEffect(() => {
        const getCompany = async () => {
            let res = await JoblyApi.getCompany(companyParam.company)
            
            setcompany(res)
            setjobs(res.jobs)
        
        }
        getCompany()
        
    }, [])

    

    return (
        <div>
            <h2>{company.name}</h2>
            <p>{company.description}</p>
            {jobs.map((j) => {
                return <JobCard job={j} />
            })}
        </div>
    )
}
