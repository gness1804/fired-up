const sessionData = {
 key: '146789844534',
 name: 'Example session name',
 interval: 2000,
 applications: {
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
 }
}

module.exports = sessionData
