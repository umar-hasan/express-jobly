import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import UserContext from './UserContext'

export default function ProtectedRoute({path, children}) {

    const {currentUser} = useContext(UserContext)

    console.log(currentUser)
    return currentUser ? (
        <Route path={path}>
            {children}
        </Route>
    ) : (
        <Redirect to="/login"></Redirect>
    )
}
