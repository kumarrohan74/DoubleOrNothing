import React, { Component } from 'react';
import { render } from "react-dom";
import logo from './logo.svg';
import './App.css';



class App extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      searchCandidate:'',
      checked:false,
      selected_items:[],
      disabled: true,
      clicked:false,
      randomNumber:0,
      winner:"Looser",
      final_array:[],
      updated_list:false,
      items: [],
    };


  }

  myInputChange = (e) => {
    this.setState({searchCandidate:e.target.value});
  }

  handleCheck = (e,id_) => {
    var isPresent = 0;
    var maxLimit = 0;
    console.log("iiiiiiiiiiiii"+id_);


    this.setState({select:e});

    if(this.state.selected_items.length > 0)
    {
      for (var i = 0; i < this.state.selected_items.length; i++) {
          if (this.state.selected_items[i] === e) {
              isPresent = 1;
              var index = this.state.selected_items.indexOf(e);
              this.state.selected_items.splice(index, 1);
              this.state.disabled = true;
          }
        }
    }
    if(!isPresent && this.state.selected_items.length < 9)
    {
      this.state.selected_items.push(e);
      this.state.disabled = true;
    }
    if(this.state.selected_items.length === 9)
    {
        this.state.disabled = false;
    }
  }

  buttonClicked = (e) => {
    this.setState({click:e});
    this.state.clicked = true;
    this.state.randomNumber = Math.floor(Math.random() * 9) + 1;
    for(var i = 0; i<this.state.selected_items.length;i++)
    {
      var index = this.state.items.indexOf(this.state.selected_items[i]);
      this.state.items.splice(index,1);
    }
  }

  backButtonClicked = (e) => {
    for(var i=0;i<this.state.selected_items.length;i++)
    {
      this.state.items.unshift(this.state.selected_items[i]);
    }
    this.state.selected_items = [];
    this.setState({backButton:e});
    this.state.updated_list = true;
    this.state.clicked = false;
  }

  componentDidMount() {
    const headers = {
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Host": "s3-ap-southeast-1.amazonaws.com",
      }

    fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json",{headers})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
          for(var i=0;i<this.state.items.length;i++)
          {
            this.state.items[i]['Win'] = 0;
            this.state.items[i]['Fate'] = "Loss";
          }
        },

        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )


  }

  render() {
    var searched_true = 0;
    const { error, isLoaded, items,selected_items,clicked,randomNumber,final_array,updated_list } = this.state;

    var searchCandidate = this.state.searchCandidate;
    //console.log(selected_items);
    if (searchCandidate.length > 0)
      {
         searched_true = 1;
         var search_item = items.filter(item => item.Name.toLowerCase().match(searchCandidate.toLowerCase()));
      }
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    if(this.state.clicked)
    {
      console.log("hello");
      console.log("selected_items",selected_items);
      return (

        <div class="betPage">
        <center>
        {selected_items.map(item => (

          <div class="cards" >
            <img class="image_card" src={item['Profile Image']}/>
            <center>
              <strong class="font_card">{item.Name}</strong>
            </center>
            <center>
              <strong class="font_card"><i class="fa fa-inr price" aria-hidden="true"></i> {item.Price}</strong>
            </center>
            <center>
              <strong class="font_card"><i class="fa fa-crosshairs bet_" aria-hidden="true"></i> {item.Bet}</strong>
            </center>
            <div id="status" class="trapezoid trapezoid-winner">
              <h5>
                {(item.Bet == this.state.randomNumber) ? <strong class="winner">Winner</strong> : <strong class="looser">Looser</strong>}
              </h5>
            </div>
            <div class="cal">
            {(item.Bet == this.state.randomNumber) ? item.Win = item.Win + parseInt(item.Price) + parseInt(item.Price) : item.Win = item.Win }
            {(item.Bet == this.state.randomNumber) ? item.Fate = "Win" : item.Fate = "Loss" }
            {final_array.push(item)}

            </div>
          </div>

        ))}
        </center>

        <button class="btn back_button" onClick={() => this.backButtonClicked()}><strong>Back</strong></button>
        <center>
        <div class="random_number">
        <h1 class="rand">{this.state.randomNumber}</h1>
        </div>
        </center>

        </div>
      );
    }

    else if (searched_true) {

      return (
        <div>
          <div class="header">
            <h3 class="head">Double or Nothing</h3>
            <input id="search" class="form-control search" type="text" placeholder="Search Users"  value={this.state.searchCandidate} onChange={this.myInputChange}/>
          </div>
          <div class="row">
          <div class="col-md-3">
            <div class="select">
              <ul class="list-group">
              { selected_items.map(item => (
                <li class="list-group-item">
                <img class="image_left" src={item['Profile Image']}/>
                <span class="name">{item.Name}</span>
                <span class="name"><i class="fa fa-inr price" aria-hidden="true"></i>{item.Price}</span>
                <span class="name"><i class="fa fa-crosshairs bet_" aria-hidden="true"></i> {item.Bet}</span>
                </li>
                ))}
              </ul>
            </div>
            <button class="btn" disabled={this.state.disabled}  onClick={() => this.buttonClicked(this.state.disabled)}><strong>Start</strong></button>
          </div>
          <div class="col-md-9">
          <div class="list">
          <table>
          <thead>
            <tr>
              <th class="check">Select</th>
              <th>Name</th>
              <th>Avatar</th>
              <th>Price</th>
              <th class="width">Bet</th>
            </tr>
            </thead>
            <tbody>
          { search_item.map(item => (
                    <tr>
                      <td><input type="checkbox" onChange={() => this.handleCheck(item)}/></td>
                      <td class="bold">{item.Name}</td>
                      <td><img class="image" src={item['Profile Image']}/></td>
                      <td><i class="fa fa-inr" aria-hidden="true"></i> {item.Price}</td>
                      <td><i class="fa fa-crosshairs" aria-hidden="true"></i> {item.Bet}</td>
                    </tr>
          ))}
          </tbody>
          </table>
        </div>
        </div>
        </div>
        </div>
      );
    }
    else if (this.state.updated_list) {
      return (
        <div>
          <div class="header">
            <h3 class="head">Double or Nothing</h3>
            <input id="search" class="form-control search" type="text" placeholder="Search Users"  value={this.state.searchCandidate} onChange={this.myInputChange}/>
          </div>
          <div class="row">
          <div class="col-md-3">
            <div class="select">
              <ul class="list-group">
              {selected_items.map(item => (
                <li class="list-group-item">
                <img class="image_left" src={item['Profile Image']}/>
                <span class="name">{item.Name}</span>
                <span class="name"><i class="fa fa-inr price" aria-hidden="true"></i>{item.Price}</span>
                <span class="name"><i class="fa fa-crosshairs bet_" aria-hidden="true"></i> {item.Bet}</span>
                </li>
                ))}
              </ul>
            </div>
            <button class="btn" disabled={this.state.disabled}  onClick={() => this.buttonClicked(this.state.disabled)}><strong>Start</strong></button>
          </div>
          <div class="col-md-9">
          <div class="list">
          <table>
          <thead>
            <tr>
              <th class="check">Select</th>
              <th>Name</th>
              <th>Avatar</th>
              <th>Price</th>
              <th class="width">Bet</th>
              <th>Winnings</th>
              <th>Fate</th>
            </tr>
            </thead>
            <tbody>

          {items.map(item => (
                    <tr>
                      <td><input type="checkbox" onChange={() => this.handleCheck(item)}/></td>
                      <td class="bold">{item.Name}</td>
                      <td><img class="image" src={item['Profile Image']}/></td>
                      <td><i class="fa fa-inr" aria-hidden="true"></i> {item.Price}</td>
                      <td><i class="fa fa-crosshairs" aria-hidden="true"></i> {item.Bet}</td>
                      <td>{(item.Win)}</td>
                      <td>{item.Fate}</td>
                    </tr>
          ))}
          </tbody>
          </table>
        </div>
        </div>
        </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <div class="header">
            <h3 class="head">Double or Nothing</h3>
            <input id="search" class="form-control search" type="text" placeholder="Search Users"  value={this.state.searchCandidate} onChange={this.myInputChange}/>
          </div>
          <div class="row">
          <div class="col-md-3">
            <div class="select">
              <ul class="list-group">
              { selected_items.map(item => (
                <li class="list-group-item">
                <img class="image_left" src={item['Profile Image']}/>
                <span class="name">{item.Name}</span>
                <span class="name"><i class="fa fa-inr price" aria-hidden="true"></i>{item.Price}</span>
                <span class="name"><i class="fa fa-crosshairs bet_" aria-hidden="true"></i> {item.Bet}</span>
                </li>
                ))}
              </ul>
            </div>
            <button class="btn" disabled={this.state.disabled}  onClick={() => this.buttonClicked(this.state.disabled)}><strong>Start</strong></button>
          </div>
          <div class="col-md-9">
          <div class="list">
          <table>
          <thead>
            <tr>
              <th class="check">Select</th>
              <th>Name</th>
              <th>Avatar</th>
              <th>Price</th>
              <th class="width">Bet</th>
            </tr>
            </thead>
            <tbody>
          { items.map(item => (
                    <tr>
                      <td><input id = {item.Name} type="checkbox" onChange={() => this.handleCheck(item,item.Name)}/></td>
                      <td class="bold">{item.Name}</td>
                      <td><img class="image" src={item['Profile Image']}/></td>
                      <td><i class="fa fa-inr" aria-hidden="true"></i> {item.Price}</td>
                      <td><i class="fa fa-crosshairs" aria-hidden="true"></i> {item.Bet}</td>
                    </tr>
          ))}
          </tbody>
          </table>
        </div>
        </div>
        </div>
        </div>
      );
    }
  }
}
var app = (
<div>
<React.StrictMode>
  <App/>
  </React.StrictMode>
</div>

);



export default App;
