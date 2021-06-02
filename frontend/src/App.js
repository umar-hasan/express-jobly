import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import JoblyApi from './api';
import './App.css';
import CompanyDetail from './CompanyDetail';
import CompanyList from './CompanyList';
import JobList from './JobList';
import Login from './Login';
import Register from './Register';
import jwt from "jsonwebtoken"
import UserContext from './UserContext';
import Home from './Home';
import useLocalStorage from './useLocalStorage';
import ProtectedRoute from './ProtectedRoute';
import Profile from './Profile';
import Navigation from './Navigator';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentUser, setcurrentUser] = useState(null)
  const [token, settoken] = useState(useLocalStorage("jobly-token"))
  const [loaded, setloaded] = useState(false)

  useEffect(() => {

    async function getCurrentUser() {
      if (token) {
        console.log(jwt.decode(token))
        try {
          let username = jwt.decode(token).username
          let user = await JoblyApi.getCurrentUser(username)
          console.log(user)
          setcurrentUser(user)
        } catch (error) {
          console.error("App loadUserInfo: problem loading", error)
          setcurrentUser(null)
        }

      }
      setloaded(true)
    }

    getCurrentUser()

  }, [token])

  async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData)
      settoken(token)
      localStorage.setItem("jobly-token", token)
      return { success: true }
    } catch (error) {
      console.log("login failed", error)
      return { success: false }
    }

  }

  async function register(data) {
    try {
      let token = await JoblyApi.register(data)
      settoken(token)
      localStorage.setItem("jobly-token", token)
      return { success: true }
    } catch (error) {
      console.error("signup failed", error)
      return { success: false }
    }
  }

  async function logout() {
    JoblyApi.logout()
    settoken(null)
    setcurrentUser(null)
    localStorage.removeItem("jobly-token")
  }

  if (!loaded) return null

  return (
    <div className="App">

      <UserContext.Provider value={{ currentUser, setcurrentUser }}>
        <Router>
          <Navigation logout={logout} />
          <Switch>

            <Route path="/login">
              <Login login={login} />
            </Route>

            <Route path="/signup">
              <Register register={register} />
            </Route>

            <ProtectedRoute path="/profile">
              <Profile />
            </ProtectedRoute>

            <ProtectedRoute path="/companies/:company">
              <CompanyDetail />
            </ProtectedRoute>

            <ProtectedRoute path="/companies">
              <CompanyList />
            </ProtectedRoute>

            <ProtectedRoute path="/jobs">
              <JobList />
            </ProtectedRoute>

            <Route path="/">
              <Home />
            </Route>

          </Switch>
        </Router>
      </UserContext.Provider>

    </div>
  );
}

export default App;
