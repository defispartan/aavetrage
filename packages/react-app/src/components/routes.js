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
import Home from "./Home.js";
import About from "./About.js";
import Portfolio from "./Portfolio.js";



var routes = [
    {
        path: "/index",
        name: "Home",
        component: Home,
    },

    {
        path: "/portfolio",
        name: "Portfolio",
        component: Portfolio,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },


];
export default routes;
