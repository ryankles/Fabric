import React, { useState, useEffect } from "react"
import Table from "./Table"
import Form from "./Form"

const charsArr = [
  {
    name: "Charlie",
    job: "Janitor"
  },
  {
    name: "Mac",
    job: "Bouncer"
  },
  {
    name: "Dee",
    job: "Aspring actress"
  },
  {
    name: "Dennis",
    job: "Bartender"
  }
];

function fetchUsers() {
  return fetch(`http://localhost:8000/users${window.location.search}`)
}


function MyApp(){
    const [chars, setChars] = useState(charsArr);

    function removeOneChar(index) {
      const charToRemove = chars[index]
      fetch(`http://localhost:8000/users/${charToRemove._id}`, {
        method: "DELETE",
      })
        .then((result) => {
          if (result.status !== 204) {
            if (result.status === 404) {
              throw new Error(`User with id ${charToRemove.id} not found`)
            }
            throw new Error(`Expected 204, got ${result.status}`)
          }
          const updated = chars.filter((character, i) => {
            return i !== index;
          });
          setChars(updated);
        })
        .catch((error) => {
          console.log(error)
        })
    }
    function appendChar(person) {
      postUser(person)
        .then((result) => {
          if (result.status !== 201) {
            throw new Error(`Expected 201, got ${result.status}`)
          }
          return result.json() // sort of manual change based on state
        })
        .then((json) => {
          setChars([...chars, json])
        })
        .catch((error) => {
          console.log(error)
        })
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      })

      return promise
    }

    useEffect(() => {
      fetchUsers()
      .then((res) => res.json())
      .then((json) => setChars(json["users_list"]))
      .catch((error) => {
        console.log(error)
      })},
      []
    )

    return (
    <div className="container">
      <Table charData={chars} removeChar={removeOneChar}/>
      <Form handleSubmit={appendChar}/>
    </div>
    )
}

export default MyApp;