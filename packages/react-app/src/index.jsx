import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import Admin from "./components/Admin.js"

/* 
For subgraph implementation

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache()
});

<ApolloProvider client={client}>
<App subgraphUri={subgraphUri}/>
</ApolloProvider>,
document.getElementById("root"), 

*/

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="" render={(props) => <Admin {...props} />} />
      <Redirect from="/" to="/index" />{" "}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
