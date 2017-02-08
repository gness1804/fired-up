const mockSessionData =  {
  key: 1486587908710,
  name: 'My Session 1',
  interval: 2000,
  applications: [
    {
      name: 'Atom',
      count: 7200,
      rating: 'green'
    },
    {
      name: 'Slack',
      count: 1800,
      rating: 'yellow'
    },
    {
      name: 'iTunes',
      count: 1800,
      rating: 'red'
    },
    {
      name: 'Chrome',
      count: 7200,
      rating: 'yellow'
    },
    {
      name: 'iTerm',
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
