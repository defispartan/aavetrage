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
import Home from './Home.js'
import { getRates } from './Data/Rates.js'
import Portfolio from './Portfolio.js'
import dayjs from "dayjs";



class Admin extends React.Component {
  state = {
    rates: JSON.parse(localStorage.getItem("rates")) || null,
    ratesLoaded: JSON.parse(localStorage.getItem("ratesLoaded")) || null,
    lastRefresh: localStorage.getItem("lastRefresh") || null,
    errorActive: false,
    errorMessage: "",
    ops: JSON.parse(localStorage.getItem("ops")) || null
  }


  async fetchRates() {
    let ret = await getRates()
    if (ret[0] === true) {
      this.setState({ errorActive: true, errorMessage: ret[1] })
    }
    else {
      this.setState({ ops: [ret[1], ret[2]] })
      this.setState({ rates: ret[0] })
      localStorage.setItem("rates", JSON.stringify(ret[0]))
      localStorage.setItem("ratesLoaded", true)
      localStorage.setItem("lastRefresh", dayjs().format())
      localStorage.setItem("ops", JSON.stringify([ret[1], ret[2]]))
      this.setState({ lastRefresh: dayjs().format(), ratesLoaded: true })
    }
  }

  rateRefresh = () => {
    this.setState({ ratesLoaded: false })
    this.fetchRates()
  }

  componentDidMount() {
    if (!this.state.ratesLoaded) {
      this.fetchRates()
    }
  }


  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.path === "/portfolio") {
        return (<Route path={prop.path} key={key} render={(props) =>
          <Portfolio
            {...props}
            rateRefresh={this.rateRefresh}
            rates={this.state.rates}
            ratesLoaded={this.state.ratesLoaded}
            lastRefresh={this.state.lastRefresh}
            errorActive={this.state.errorActive}
            errorMessage={this.state.errorMessage}
          />
        } />)
      }
      else if (prop.path === "/index") {
        return (<Route path={prop.path} key={key} render={(props) =>
          <Home
            {...props}
            rateRefresh={this.rateRefresh}
            rates={this.state.rates}
            ratesLoaded={this.state.ratesLoaded}
            lastRefresh={this.state.lastRefresh}
            ops={this.state.ops}
            errorActive={this.state.errorActive}
            errorMessage={this.state.errorMessage}
          />
        } />)
      }
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
