// React and CSS Imports
import React from "react";
import "./App.scss";
import "./globals/hack-styles.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

// Installed dependency imports
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

// Website imports for classes you made
import { Landing, Sequence } from "./app/views";

function App() {
  return (
    <div className="app flex-center fill-view">
      <Router>
        <Switch>
          <Route 
            exact path={"/"}
            component={Landing}
          />
          <Route 
            exact path={"/sequence"}
            component={Sequence}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
