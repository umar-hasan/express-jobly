import React, { useContext, useState } from "react";
import { Button, Card, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import JoblyApi from "./api";
import UserContext from "./UserContext";

export default function Profile() {
  const { currentUser, setcurrentUser } = useContext(UserContext);

  const initialState = {
    password: "",
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  };

  const [formData, setformData] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedUser;
    try {
      updatedUser = await JoblyApi.updateCurrentUser(
        currentUser.username,
        formData
      );
    } catch (error) {
      console.error(error);
      return;
    }

    setformData(f => ({
      ...f,
      password: ""
    }))

    setcurrentUser(updatedUser);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setformData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h2>Profile</h2>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="">Username</FormLabel>
              <FormControl plaintext readOnly defaultValue={currentUser.username} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="first-name">First Name</FormLabel>
              <FormControl name="firstName" value={formData.firstName} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="last-name">Last Name</FormLabel>
              <FormControl name="lastName" value={formData.lastName} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl name="email" value={formData.email} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl name="password" type="password" value={formData.password} onChange={handleChange} required/>
            </FormGroup>

            <Button type="submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>

    </div>
  );
}
