const mockSessionData =  {
  key: 1486587908710,
  name: 'My Session 1',
  interval: 2000,
  applications: {
    Atom: {
      name: 'Atom',
      timeCount: 7200,
      rating: 'green'
    },
    Slack: {
      name: 'Slack',
      timeCount: 1800,
      rating: 'yellow'
    },
    iTunes: {
      name: 'iTunes',
      timeCount: 1800,
      rating: 'red'
    },
    Chrome: {
      name: 'Chrome',
      timeCount: 7200,
      rating: 'yellow'
    },
    iTerm: {
      name: 'iTerm',
      timeCount: 3600,
      rating: 'green'
    }
  }
}

const mockSessions = [
  mockSessionData,
]

Object.assign(exports,
  {
    mockSessions,
  })
