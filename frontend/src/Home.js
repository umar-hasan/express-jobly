import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import UserContext from './UserContext'

export default function Home() {

    const { currentUser } = useContext(UserContext)

    return (
        <div id="homepage">
            <div className="container text-center">
                <h1>Jobly</h1>
                <p>All the jobs in one convenient place.</p>
                {currentUser ? (
                    <h3>Welcome back, {currentUser.firstName}!</h3>
                ) : (
                    <div>
                        <Link to="/login">
                            <Button>Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Register</Button>
                        </Link>

                    </div>
                )}
            </div>
        </div>

    )
}
