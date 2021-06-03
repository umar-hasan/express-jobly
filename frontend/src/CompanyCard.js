import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

export default function CompanyCard({ company }) {
    return (
        <Link to={`/companies/${company.handle}`}>
            <Card key={company.handle}>
                <Card.Body>
                    <Card.Title>
                        {company.name}
                        <img src={company.logoUrl} className="float-right ml-5" alt="" />
                    </Card.Title>
                    <p><small>{company.description}
                    </small></p>
                </Card.Body>

            </Card>
        </Link>

    )
}
