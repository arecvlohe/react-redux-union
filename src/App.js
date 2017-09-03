import React, { Component } from "react";
import { getGif, gifUrl } from "./store";
import { connect } from "react-redux";

const mapStateToProps = state => ({ gifUrl: gifUrl(state) });

class App extends Component {
  componentDidMount() {
    getGif();
  }

  render() {
    return (
      <div>
        {this.props.gifUrl && <img src={this.props.gifUrl} alt="Giphy!" />}
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
