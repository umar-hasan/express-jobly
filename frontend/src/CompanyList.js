import React, { useEffect, useState } from 'react'
import JoblyApi from './api'
import CompanyCard from './CompanyCard'

export default function CompanyList() {
    const [companies, setcompanies] = useState([])

    useEffect(() => {
        const getCompanies = async () => {
            let res = await JoblyApi.getAllCompanies()
            setcompanies(res)
        }
        getCompanies()
    }, [])


    return (
        <div>
            {companies.map((c) => {
                return <CompanyCard company={c} />
            })}
        </div>
    )
}
