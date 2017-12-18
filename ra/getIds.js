import fetch from 'node-fetch'

var ids = [...Array(40).keys()].map(x => x + 401)

Promise.all(
	ids.map(i =>
		fetch(
			'https://www.residentadvisor.net/events.aspx?ai=' + i
		).then(r => ({
			[i]: {
				city: r.url.split('/').slice(-2)[1],
				region: r.url.split('/').slice(-2)[0]
			}
		}))
	)
)

//resPromise.then(console.log)
