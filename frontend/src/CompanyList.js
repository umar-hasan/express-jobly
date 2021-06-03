import React, { useEffect, useState } from 'react'
import JoblyApi from './api'
import CompanyCard from './CompanyCard'
import Search from './Search'

export default function CompanyList() {
    const [companies, setcompanies] = useState([])

    useEffect(() => {}, [])

    const getCompanies = async (q = "") => {
        let res = await JoblyApi.getAllCompanies(q)
        setcompanies(res)
    }


    return (
        <div className="col-md-8 offset-md-2">
            <Search search={getCompanies} />
            {companies.map((c) => {
                return <CompanyCard company={c} />
            })}
        </div>
    )
}
