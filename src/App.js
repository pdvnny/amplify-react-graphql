import logo from './logo.svg';
import './App.css';

import React from 'react';

import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
  Text,
  TextField,
  Flex
} from "@aws-amplify/ui-react";

// Mod 4 - Frontend to interact with API
import { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

import { Amplify } from 'aws-amplify';
// import config from './aws-exports';   // Doesn't work anymore?
import config from './amplifyconfiguration.json';


import { listNotes } from './graphql/queries';
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation
} from "./graphql/mutations";

Amplify.configure(config);
const client = generateClient();
/*
  ***UPDATED**

  Apparently, the tutorial for GraphQL APIs for AWS Amplify is
  out of date.

  At this link, https://docs.amplify.aws/javascript/build-a-backend/graphqlapi/set-up-graphql-api/
  the documentation clearly shows a different set up now.

  Changes:
  - import { API } ... ==> import { generateClient } from 'aws-amplify/api';
  - Add "const client = generateClient();"
  - Changed all "API.graphql" calls to "client.query" calls
  - Added the same configuration code in "index.js" to this file
*/

// function App() {
//   return (
//     // <div className="App">
//     //   <header className="App-header">
//     //     <img src={logo} className="App-logo" alt="logo" />
//     //     <p>
//     //       Edit <code>src/App.js</code> and save to reload.
//     //     </p>
//     //     <a
//     //       className="App-link"
//     //       href="https://reactjs.org"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       Learn React
//     //     </a>
//     //   </header>
//     // </div>

//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <h1>Hellow from V2</h1>
//       </header>
//     </div>
//   );
// }

// New App() with the authetnication workflow
function App({ signOut }) {

  // Mod 4 - Frontend to interact with API
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    // const apiData = await API.graphql({ query: listNotes });
    const apiData = await client.graphql({ query: listNotes });
    console.log(apiData);
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }

  // "event" input comes from an HTML form; createNote() is used as a "onSubmit" function
  async function createNote(event) {
    event.preventDefault();  
    // "cancels the event if it is cancelable, meaning that the default action that
    //  belongs to the event will not occur"
    // e.g., Clicking on "submit" button for a form, then preventing it from submitting
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description")
    };
    // await API.graphql({
    //   query: createNoteMutation,
    //   variables: { input: data }
    // });
    await client.graphql({
      query: createNoteMutation,
      description: form.get("description")
    });
    fetchNotes();
    event.target.reset();
    // "resets the values of the uncontrolled fields of a form to their initial values"
  }

  async function deleteNote( {id} ) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    // await API.graphql({
    //   query: deleteNoteMutation,
    //   varaibles: { input: { id } }
    // });
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } }
    })
  }
  // End updates for Mod 4

  return (
    <View className="App">
      {/* 
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>

      // Mod 4 - Frontend to interact with API
      */}
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent='center'>
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation='quiet'
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden 
            variation="quiet"
            required
          />
          <Button type='submit' variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as='strong' fontweight={700}>
              {note.name}
            </Text>
            <Text as='span'>{note.description}</Text>
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete Note
            </Button>
          </Flex>
        ))}
      </View>


      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

// export default App;
export default withAuthenticator(App);

// Explanation

// withAuthenticator() is a HOC that wraps your App component 
// and adds the authetnication workflow to it.
// It scaffolds out an entire user authentication flow allowing users to sign up, sign in,
// reset their password, and confirm sign-in for multifactor authentication (MFA).


/* (Explanation for the functionality of the front end ... added in Mod 4)

Three main functions

1. fetchNotes() - uses the API class ot send a query to the GraphQL API and retrieves
                  a list of notes
2. createNote() - also uses the API class to send a mutation to the GraphQL API;
                  this time we are also passing the variables needed for a GraphQL
                  mutation so that a new note is added
3. deleteNote() - like createNote, sends a GraphQL mutation along with some variables,
                  but this time we are sending an "id" so that we can find and delete
                  a note


The "listNotes" query is defined in the "graphql/queries.js" file.

The "fetchNotes()" function is called in the "useEffect()" hook.
The "useEffect()" hook is called when the component is mounted.
The "fetchNotes()" function fetches all notes from the API and sets the state of the component.

The "createNote()" function is called when the "Create Note" button is clicked.
The "createNote()" function creates a new note in the API and updates the state of the component.

The "deleteNote()" function is called when the "Delete Note" button is clicked.
The "deleteNote()" function deletes a note in the API and updates the state of the component.


*/
