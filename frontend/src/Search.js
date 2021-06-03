import React, { useState } from 'react'
import {Button, Form, FormControl} from 'react-bootstrap'

export default function Search({search}) {

    const [formData, setformData] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let result = await search(formData)
        } catch (error) {
            console.error(error)
        }
        
    }

    const handleChange = (e) => {
        e.preventDefault()
        setformData(e.target.value)
    }

    return (
        <div>
            <Form id="search-form" onSubmit={handleSubmit}>
                <FormControl onChange={handleChange} />
                <Button type="submit">Search</Button>
            </Form>
        </div>
    )
}
