import React from 'react';
import moment from 'moment';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerType: 'Sesjon',
      startStop: 'START',
      secondsSession: 1500,
      secondsBreak: 300,
      time: moment().startOf('day').seconds(1500).format('mm:ss')
    }
    
    this.timer = 0;
    this.handleClick = this.handleClick.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.handleStart = this.startCountDown(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.playSound = this.playSound.bind(this);
  }
  
  startStopTimer() {
    if (this.timer == 0 && (this.state.secondsSession > 0 || this.state.secondsBreak > 0)) {
      this.setState ({
        startStop: 'PAUSE'
      });
      this.timer = setInterval(this.startCountDown, 1000);
    }
    else {
      this.stopTimer();
    }
  }
  
  stopTimer() {
    this.setState ({
      startStop: 'START'
    });
    clearInterval(this.timer);
    this.timer = 0;
  }
  
  startCountDown() {
    if(this.state.timerType == 'Sesjon') {
      let secondsSession = this.state.secondsSession - 1;
      this.setState({
        time: moment().startOf('day').seconds(secondsSession).format('mm:ss'),
        secondsSession: secondsSession
    });
      if(secondsSession < 0) {
        this.setState ({
          timerType: 'Pause',
          secondsSession: this.state.sessionLength*60,
          time: moment().startOf('day').seconds(this.state.secondsBreak).format('mm:ss')
        });
        this.playSound();
      }
    }
    else {
      let secondsBreak = this.state.secondsBreak - 1;
      this.setState({
        time: moment().startOf('day').seconds(secondsBreak).format('mm:ss'),
        secondsBreak: secondsBreak
    });
      if(secondsBreak < 0) {
        this.setState ({
          timerType: 'Sesjon',
          secondsBreak: this.state.breakLength*60,
          time: moment().startOf('day').seconds(this.state.secondsSession).format('mm:ss')
        });
        this.playSound();
      }
    }
    
  }
  
  playSound() {
    document.getElementById('beep').play();
  }
  
  handleClick(e) {
    if (this.timer == 0) {
      switch(e.target.id) {
        case "break-increment":
          if(this.state.breakLength<60) {
            this.setState({
              breakLength: this.state.breakLength+1,
              secondsBreak: (this.state.breakLength+1)*60
            });      
            if (this.state.timerType == 'Pause') {
              if(this.state.breakLength<59)
                this.setState({
                  time: moment().startOf('day').seconds(this.state.breakLength*60+60).format('mm:ss')
                });
            else
              this.setState({
                time: '60:00'
              });
            }   
          }
          break;
        case "break-decrement":
          if (this.state.breakLength>1){
            this.setState({
              breakLength: this.state.breakLength-1,
              secondsBreak: (this.state.breakLength-1)*60
            });
            if (this.state.timerType == 'Pause') {
              this.setState({
                time: moment().startOf('day').seconds(this.state.breakLength*60-60).format('mm:ss')
              });
            }
          }
          break;
        case "session-increment":
          if(this.state.sessionLength<60) {
            this.setState({
              sessionLength: this.state.sessionLength+1,
              secondsSession: (this.state.sessionLength+1)*60
            });
            if (this.state.timerType == 'Sesjon') {
              if(this.state.sessionLength<59)
                this.setState({
                  time: moment().startOf('day').seconds(this.state.sessionLength*60+60).format('mm:ss')
                });
              else
                this.setState({
                  time: '60:00'
                });
              }
            }
            break;
        case "session-decrement":
          if (this.state.sessionLength>1){
            this.setState({
              sessionLength: this.state.sessionLength-1,
              secondsSession: (this.state.sessionLength-1)*60
            });
            if (this.state.timerType == 'Sesjon') {
              this.setState({
                time: moment().startOf('day').seconds(this.state.sessionLength*60-60).format('mm:ss')
              });
            }
          }
          break;
      default:
      }
    }
  }
  
  resetTimer() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerType: 'Sesjon',
      startStop: 'START',
      secondsSession: 1500,
      secondsBreak: 300,
      time: moment().startOf('day').seconds(1500).format('mm:ss', { trunc: true })
    });
    
    clearInterval(this.timer);
    this.timer = 0;
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }

  render() {
    return(
    <div>
        <div id="keepCalm">
          <img src="https://keep-calm.net/images/keep-calm-and-take-a-break-1500-1500.jpg" alt="Keep Calm And Take A Break" width = "400px" />
        </div>
        <div className="controls">
          <div className="row">
            <div className="column">
              <span id="break-label">PAUSE LENGDE</span>
              <div className="row">
              <i class="fa fa-chevron-circle-down" id="break-decrement" onClick={this.handleClick} />
                <div id="break-length" className="length">{this.state.breakLength}</div>
              <i class="fa fa-chevron-circle-up" id="break-increment" onClick={this.handleClick} />
              </div>
            </div>
          <div className="column">
            <span id="session-label">SESJONS LENGDE</span>
            <div className="row">
            <i class="fa fa-chevron-circle-down" id="session-decrement" onClick={this.handleClick} />
              <div id="session-length" className="length">{this.state.sessionLength}</div>
            <i class="fa fa-chevron-circle-up" id="session-increment" onClick={this.handleClick} />
            </div>
          </div>
        </div>
      </div>
        <div id="timerWrapper">
          <span id="timer-label">{this.state.timerType}</span>
          <div id="time-left">{this.state.time}</div>
        </div>
        <div id="commands">
          <button id="start_stop" onClick={this.startStopTimer}>{this.state.startStop}</button>
          <button id="reset" onClick={this.resetTimer}>TILBAKESTILL</button>
        </div>
        <audio id="beep" preload="auto" src="http://www.cooperindustries.com/content/dam/public/safety/notification/Resources/Media%20Files/MARCH-MT.WAV"/>
   </div>
    );
  }
}

