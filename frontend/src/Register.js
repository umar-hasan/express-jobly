import React, { useState } from 'react'
import { Button, Card, Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useHistory } from 'react-router'

export default function Register({ register }) {
    const history = useHistory()
    const initialState = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    }
    const [formData, setformData] = useState(initialState)

    const handleChange = (e) => {
        setformData(formData => ({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let result = await register(formData)
        console.log(result)
        if (result.success) {
            history.push("/")
        }
        else {

        }
    }

    return (
        <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h2>Register</h2>
            <Card id="register-form" >
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <FormLabel>Username</FormLabel>
                            <FormControl type="text" name="username" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <FormControl type="password" name="password" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>First Name</FormLabel>
                            <FormControl type="text" name="firstName" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl type="text" name="lastName" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <FormControl type="email" name="email" onChange={handleChange} required />
                        </FormGroup>


                        <Button type="submit">Submit</Button>
                    </Form>
                </Card.Body>

            </Card>

        </Container>
    )
}
