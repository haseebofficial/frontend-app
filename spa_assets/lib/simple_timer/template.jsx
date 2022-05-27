import React from "react";

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: this.props.duration };
    this.interval = null;
  }

  startTimer() {
    if (!this.interval) {
      this.interval = setInterval(() => this.setState({time: this.state.time+1}), 1000);
    }
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== "test") {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    let { hh, mm, ss } = toHMS(this.state.time);

    return (
      <div className="simple-timer">
        {hh !== "00" && 
          <React.Fragment>
            <TimerNN nn="hh" nnValue={hh}/>
            :
          </React.Fragment>
        }
        <TimerNN nn="mm" nnValue={mm}/>
        :
        <TimerNN nn="ss" nnValue={ss}/>
      </div>
    );
  }
}

function toHMS(time) {
  let hh = formatTwoDigit(Math.floor(time / 3600));
  let mm = formatTwoDigit(Math.floor((time % 3600) / 60));
  let ss = formatTwoDigit(time % 60);

  return { hh, mm, ss };
}

function formatTwoDigit(number) {
  return ("0" + number).slice(-2);
}

let TimerNN = ({nn, nnValue}) => <span className={nn}>{nnValue}</span>;
