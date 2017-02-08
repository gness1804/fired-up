const mockSessionData =  {
  key: UID,
  name: userInput,
  interval: 2000,
  applications: [
    atom: {
      count: 7200,
      rating: 'green'
    },
    slack: {
      count: 1800,
      rating: 'yellow'
    },
    iTunes: {
      count: 1800,
      rating: 'red'
    },
    chrome: {
      count: 7200,
      rating: 'yellow'
    },
    iTerm: {
      count: 3600,
      rating: 'green'
    }
  ]
}

const sessions = [
  mockSessionData,
]

Object.assign(exports,
  {
    sessions,
  })
