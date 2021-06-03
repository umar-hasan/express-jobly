import React, { useState } from 'react'
import { Button, Card, Container, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useHistory } from 'react-router'

export default function Login({ login }) {
    const history = useHistory()

    const [formData, setformData] = useState({
        username: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let result = await login(formData)
            if (result.success) {
                history.push("/")
            }
            else {
                throw new Error("login failed")
            }

        } catch (error) {
            console.error(error)
        }

    }

    const handleChange = (e) => {
        e.preventDefault()
        setformData(f => ({
            ...f,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h2>Login</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <FormLabel>Username</FormLabel>
                            <FormControl type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <FormControl type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        </FormGroup>

                        <Button type="submit">Submit</Button>
                    </Form>
                </Card.Body>

            </Card>

        </Container>
    )
}
