import React, { Component } from "react";
import { ethers } from "ethers";

import initBlockchain from "./utils/initBlockchain";
import TopBar from "./components/TopBar";
import {
  Container,
  Grid,
  Form,
  Message,
  Button,
  Icon,
  Progress
} from "semantic-ui-react";

//import TopBar from "./components/TopBar";

//
//  This is the main application page; routing is handled to render other pages in the application

class App extends Component {
  state = {
    RC: null,
    RS: null,
    RSDeployedAddress: "",
    userAddress: "",
    currentRate: 0,
    totalSupply: 0,
    userSupply: 0,
    userContributions: 0,
    weiRaised: 0,
    closeTime: "",
    hasClosed: false
  };

  // define a state variable for important connectivity data to the blockchain
  // this will then be put into the REDUX store for retrieval by other pages

  // **************************************************************************
  //
  // React will call this routine only once when App page loads; do initialization here
  //
  // **************************************************************************

  componentDidMount = async () => {

    try {
      // Connect to blockchain
      const data = await initBlockchain(); // get contract instance and user address
      this.setState({
        RC: data.RC,
        RS: data.RS,
        RSDeployedAddress: data.RSDeployedAddress,
          signer: data.signer,
        userAddress: data.userAddress
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
    console.log("first state", this.state);

    // one-time operation to transfer ownership of RAMCOIN to RAMSALE from the original creator
    // This only works for original creator (and owner) of the RAMCOIN contract

      console.log("change owner if necessary");
    let RCOwner = await this.state.RC.owner();
    console.log("ramcoin owner is", RCOwner);
    if (RCOwner != this.state.RSDeployedAddress) {
      console.log("transferring ownership to RS contract");
      await this.state.RC.connect(this.state.signer).transferOwnership(this.state.RSDeployedAddress);
    } else {
      console.log("RS already owns RC contract");
    }

    // get opening and closing times

    let blockTime = await this.state.RS.getNow();
    console.log("block time", blockTime.toString());
    let closingTime = await this.state.RS.closingTime();
    console.log("closing time:", closingTime.toString());
    let closeTime = new Date(closingTime * 1000);
    console.log("closing time", closeTime.toString());
    let hasClosed = await this.state.RS.hasClosed();

    // get coin counts, contributions from all purchasers, and current rate per ether
    let totalSupply = await this.state.RC.totalSupply();
    console.log("total supply", totalSupply);
    let userSupply = await this.state.RC.balanceOf(this.state.userAddress);
    let userContributions = await this.state.RS.contributions(this.state.userAddress);
    console.log("spent", userContributions);
    console.log("user supply", userSupply);
    let currentRate = await this.state.RS.getCurrentRate();
    console.log("Current rate", currentRate);
    let weiRaised = await this.state.RS.weiRaised();
    this.setState({
      totalSupply,
      userSupply,
      weiRaised,
      currentRate,
      userContributions,
        blockTime,
      closeTime,
      hasClosed
    });
    console.log("more state", this.state);
    console.log("wei raised", this.state.weiRaised.toString());
  };

  // **************************************************************************
  //
  // handle the submit button in the form
  //
  // **************************************************************************

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      console.log("sending", ethers.utils.parseEther(this.state.value.toString()));
      await this.state.RS.buyTokens(this.state.userAddress, {
        value: ethers.utils.parseEther(this.state.value.toString()),
      });
      this.setState({
        loading: false,
        message: "Purchase Completed"
      });
      document.location.reload(true); // show user new balance
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "User rejected transaction"
      });
    }
  };

  // **************************************************************************
  //
  // main render routine for App component;
  //
  // **************************************************************************

  render() {
    return (
      <Container>
        <TopBar state={this.state} />
        <Grid columns={2} verticalAlign="middle">
          <Grid.Column>
            <div>
              <h2> Your Account Info</h2>
              <p>
                RAMCOIN price is {this.state.currentRate.toString()} tokens per ether.
                <br />
                You currently have {this.state.userSupply.toString() / 1e18}
                &nbsp;RAMCOINs and invested {this.state.userContributions.toString() / 1e18} ether.
              </p>
              <hr />
              Account: {this.state.userAddress}
            </div>
          </Grid.Column>
          <Grid.Column>
            <div>
              <h2>ICO Details</h2>
              <p>The crowd sale ends at {this.state.closeTime.toString()}</p>
              <p>
                The price per token will steadily climb until the sale closes.
                The original rate is 500 RamCoins per ether. The final rate is
                250 RamCoins per ether.
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <br /> <hr /> <br />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>
              Enter ether value to invest (minimum first purcase is 1.0 ether)
            </label>
            <input
              placeholder="Ether Amount"
              onChange={event =>
                this.setState({
                  value: event.target.value
                })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            disabled={this.state.hasClosed}
            color={this.state.hasClosed ? "red" : "green"}
            type="submit"
            loading={this.state.loading}
          >
            <Icon name="check" />
            {this.state.hasClosed ? "Sale Closed" : "Buy RamCoins"}
          </Button>
          <hr />
          <h2>{this.state.message}</h2>
        </Form>
        <Progress
          progress="value"
          total={500}
          value={this.state.weiRaised / 1e18}
        >
          Progress towards 100 ether goal{" "}
        </Progress>
      </Container>
    );
  }
}

export default App;
