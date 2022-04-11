import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import themes from "../src/theme";
import { ApolloProvider } from "@apollo/react-hooks";
import dynamic from "next/dynamic";
import "./empty.css";
import Navbar from "../src/Navbar";

const client = dynamic(() => import("../client"), {
  ssr: false
});

class MyApp extends App {
  constructor() {
    super();
    this.state = {
      isLightTheme: false // night mode by default

    };
  }
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloProvider client={client}>
        <Head>
          <title>Canban</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider
          theme={this.state.isLightTheme ? themes.lightTheme : themes.darkTheme}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Navbar
            onToggleTheme={() => {
              this.setState({
                isLightTheme: !this.state.isLightTheme
              });
              localStorage.setItem("isLightTheme", !this.state.isLightTheme);
            }}
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default MyApp;
