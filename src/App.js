import logo from './logo.svg';
import './App.css';

import React from 'react';

import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card
} from "@aws-amplify/ui-react";

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
  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

// export default App;
export default withAuthenticator(App);

// Explanation

// withAuthenticator() is a HOC that wraps your App component 
// and adds the authetnication workflow to it.
// It scaffolds out an entire user authentication flow allowing users to sign up, sign in,
// reset their password, and confirm sign-in for multifactor authentication (MFA).
