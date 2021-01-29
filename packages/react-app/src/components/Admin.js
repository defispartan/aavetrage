/*!

=========================================================
* Liquid Yield - v1.1.0
=========================================================


* Copyright 2020 Andrew Schmidt (https://www.andrew-schmidt.com)
* Licensed under MIT (https://github.com/aschmidt20/liquid-yield/blob/master/LICENSE.md)

* Coded by Andrew Schmidt

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import routes from './routes.js'



class Admin extends React.Component {


    componentDidUpdate(e) {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }


    /*  
Can replace Route component with options for select paths if functions/state
need to be shared between pages
 
getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.path === "/portfolio") {
        return (
          <Route
            path={prop.path}
            key={key}
            render={(props) => (
              <PortfolioHome
                {...props}
                setWalletConnect={this.setWalletConnect}
                connectWallet={this.connectWallet}
                walletConnected={this.state.walletConnected}
              />
            )}
          />
        );
      } else if (prop.path === "/zap") {
        return (
          <Route
            path={prop.path}
            key={key}
            render={(props) => (
              <ZapHome
                {...props}
                setWalletConnect={this.setWalletConnect}
                connectWallet={this.connectWallet}
                walletConnected={this.state.walletConnected}
              />
            )}
          />
        );
      }  else if (prop.layout === "admin") {
        return <Route path={prop.path} component={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  }; */

    getRoutes = (routes) => {
        return routes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} />;
        });
    }

    render() {
        return (
            <>
                <div className="main-content" ref="mainContent">
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect from="*" to="/index" />
                    </Switch>
                </div>
            </>
        );
    }
}

export default Admin;
