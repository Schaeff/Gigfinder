import { GIGSCRAPR_URL, SOUNDCLOUD_CLIENT_ID } from 'react-native-dotenv'

console.log(GIGSCRAPR_URL)

import {
  SEARCH,
  SEARCH_RESULTS,
  FETCH_GIGS,
  FETCH_GIGS_RESULTS,
  HOLD_GIG,
  RELEASE_GIG,
  FETCH_PLAYLIST_RESULTS,
  SOUNDS_LOADED,
  SOUNDS_LOADING
} from './actionConstants'

const SOUNDCLOUD_BASE = 'https://soundcloud.com'
const SOUNDCLOUD_API_BASE = 'http://api.soundcloud.com'

const getTrackId = dj => {
  if (dj === null)
    return Promise.reject(new Error('Cannot get track id for null DJ'))
  return fetch(
    SOUNDCLOUD_API_BASE +
      '/resolve?url=' +
      SOUNDCLOUD_BASE +
      '/' +
      dj +
      '/tracks' +
      '&client_id=' +
      SOUNDCLOUD_CLIENT_ID
  )
    .then(res => res.json())
    .then(
      r => (r && r[0] ? r[0].id : Promise.reject(new Error('DJ has no tracks')))
    )
}

const getStreamUrl = trackId =>
  SOUNDCLOUD_API_BASE +
  '/tracks/' +
  trackId +
  '/stream?client_id=' +
  SOUNDCLOUD_CLIENT_ID

export const search = text => ({
  type: SEARCH,
  payload: {
    text
  }
})

export const searchResults = results => ({
  type: SEARCH_RESULTS,
  payload: {
    results
  }
})

export const searchAsync = text => dispatch => {
  dispatch(search(text))
  return API.fetchPlaces(text).then(places => dispatch(searchResults(places)))
}

export const fetchGigs = id => ({
  type: FETCH_GIGS,
  payload: {
    id
  }
})

export const fetchGigsAsync = id => dispatch => {
  dispatch(fetchGigs(id))
  return API.fetchGigs(id).then(gigs => {
    gigs.forEach(g =>
      g.lineup.filter(d => d.dj !== null).forEach(d => dispatch(fetchPlaylistAsync(d.dj, d.soundcloud)))
    )
    dispatch(fetchGigsResults(id, gigs))
  })
}

export const fetchPlaylistAsync = (id, djSc) => dispatch => {
  return API.fetchPlaylist(djSc)
    .then(streamUrl => {
      return dispatch(fetchPlaylistResults(id, [streamUrl]))
    })
    .catch(e => dispatch(fetchPlaylistResults(id, [])))
}

export const fetchPlaylistResults = (id, streamUrls) => ({
  type: FETCH_PLAYLIST_RESULTS,
  payload: {
    id,
    playlist: streamUrls
  }
})

export const fetchGigsResults = (id, results) => ({
  type: FETCH_GIGS_RESULTS,
  payload: {
    results,
    id
  }
})

export const onHoldGig = gigId => ({
  type: HOLD_GIG,
  payload: {
    gigId
  }
})

export const onReleaseGig = gigId => ({
  type: RELEASE_GIG,
  payload: {
    gigId
  }
})

export const onSoundsLoaded = () => ({
  type: SOUNDS_LOADED,
  payload: {}
})

export const onLoadSounds = () => ({
  type: SOUNDS_LOADING,
  payload: {}
})

const API = {
  fetchPlaces: text =>
    Promise.resolve(
      Object.keys(PLACES)
        .map(key => PLACES[key])
        .filter(
          p =>
            (p.city && p.city.indexOf(text.toLowerCase()) > -1) ||
            p.region.indexOf(text.toLowerCase()) > -1
        )
    ),
  fetchGigs: c => fetch(GIGSCRAPR_URL + '/city/' + c).then(r => r.json()),
  fetchPlaylist: dj => getTrackId(dj).then(getStreamUrl)
}

const PLACES = {
  '1': {
    id: 1,
    city: 'sydney',
    region: 'au'
  },
  '2': {
    id: 2,
    city: 'melbourne',
    region: 'au'
  },
  '3': {
    id: 3,
    city: 'perth',
    region: 'au'
  },
  '4': {
    id: 4,
    city: 'canberra',
    region: 'au'
  },
  '5': {
    id: 5,
    city: 'adelaide',
    region: 'au'
  },
  '6': {
    id: 6,
    city: 'hobart',
    region: 'au'
  },
  '7': {
    city: 'london',
    region: 'uk',
    id: 7
  },
  '8': {
    id: 8,
    city: 'newyork',
    region: 'us'
  },
  '12': {
    id: 12,
    city: 'brisbane',
    region: 'au'
  },
  '14': {
    id: 14,
    city: 'midlands',
    region: 'uk'
  },
  '15': {
    id: 15,
    city: 'southeast',
    region: 'uk'
  },
  '16': {
    id: 16,
    city: 'north',
    region: 'uk'
  },
  '17': {
    id: 17,
    city: 'chicago',
    region: 'us'
  },
  '19': {
    id: 19,
    city: 'detroit',
    region: 'us'
  },
  '20': {
    id: 20,
    city: 'barcelona',
    region: 'es'
  },
  '22': {
    id: 22,
    city: 'washingtondc',
    region: 'us'
  },
  '23': {
    id: 23,
    city: 'losangeles',
    region: 'us'
  },
  '24': {
    id: 24,
    city: 'westwales',
    region: 'uk'
  },
  '25': {
    id: 25,
    city: 'ibiza',
    region: 'es'
  },
  '26': {
    region: 'costarica',
    id: 26
  },
  '27': {
    id: 27,
    city: 'tokyo',
    region: 'jp'
  },
  '28': {
    id: 28,
    city: 'toronto',
    region: 'ca'
  },
  '29': {
    id: 29,
    city: 'amsterdam',
    region: 'nl'
  },
  '30': {
    id: 30,
    city: 'scotland',
    region: 'uk'
  },
  '34': {
    id: 34,
    city: 'berlin',
    region: 'de'
  },
  '35': {
    id: 35,
    city: 'northernireland',
    region: 'uk'
  },
  '36': {
    id: 36,
    city: 'kualalumpur',
    region: 'my'
  },
  '37': {
    region: 'greece',
    id: 37
  },
  '38': {
    id: 38,
    city: 'miami',
    region: 'us'
  },
  '39': {
    id: 39,
    city: 'vancouver',
    region: 'ca'
  },
  '40': {
    id: 40,
    city: 'montreal',
    region: 'ca'
  },
  '41': {
    id: 41,
    city: 'madrid',
    region: 'es'
  },
  '42': {
    region: 'israel',
    id: 42
  },
  '43': {
    region: 'ireland',
    id: 43
  },
  '44': {
    id: 44,
    city: 'paris',
    region: 'fr'
  },
  '45': {
    region: 'argentina',
    id: 45
  },
  '46': {
    id: 46,
    city: 'washingtonstate',
    region: 'us'
  },
  '47': {
    id: 47,
    city: 'nevada',
    region: 'us'
  },
  '48': {
    id: 48,
    city: 'newjersey',
    region: 'us'
  },
  '49': {
    region: 'newzealand',
    id: 49
  },
  '50': {
    region: 'romania',
    id: 50
  },
  '51': {
    region: 'singapore',
    id: 51
  },
  '52': {
    id: 52,
    city: 'central',
    region: 'it'
  },
  '53': {
    id: 53,
    city: 'lisbon',
    region: 'pt'
  },
  '54': {
    id: 54,
    city: 'edmonton',
    region: 'ca'
  },
  '55': {
    region: 'taiwan',
    id: 55
  },
  '57': {
    region: 'norway',
    id: 57
  },
  '58': {
    region: 'sweden',
    id: 58
  },
  '59': {
    region: 'chile',
    id: 59
  },
  '60': {
    region: 'switzerland',
    id: 60
  },
  '61': {
    region: 'brazil',
    id: 61
  },
  '62': {
    region: 'belgium',
    id: 62
  },
  '63': {
    id: 63,
    city: 'houston',
    region: 'us'
  },
  '64': {
    id: 64,
    city: 'georgia',
    region: 'us'
  },
  '65': {
    id: 65,
    city: 'louisiana',
    region: 'us'
  },
  '66': {
    id: 66,
    city: 'kansai',
    region: 'jp'
  },
  '67': {
    region: 'thailand',
    id: 67
  },
  '68': {
    id: 68,
    city: 'shanghai',
    region: 'cn'
  },
  '69': {
    region: 'poland',
    id: 69
  },
  '70': {
    id: 70,
    city: 'center',
    region: 'mx'
  },
  '71': {
    id: 71,
    city: 'hongkong',
    region: 'cn'
  },
  '72': {
    id: 72,
    city: 'tennessee',
    region: 'us'
  },
  '73': {
    region: 'turkey',
    id: 73
  },
  '74': {
    id: 74,
    city: 'ottawa',
    region: 'ca'
  },
  '75': {
    region: 'southkorea',
    id: 75
  },
  '76': {
    region: 'indonesia',
    id: 76
  },
  '77': {
    region: 'serbia',
    id: 77
  },
  '78': {
    region: 'hungary',
    id: 78
  },
  '79': {
    id: 79,
    city: 'massachusetts',
    region: 'us'
  },
  '80': {
    id: 80,
    city: 'pennsylvania',
    region: 'us'
  },
  '81': {
    id: 81,
    city: 'minnesota',
    region: 'us'
  },
  '82': {
    id: 82,
    city: 'colorado',
    region: 'us'
  },
  '84': {
    id: 84,
    city: 'ohio',
    region: 'us'
  },
  '85': {
    id: 85,
    city: 'indiana',
    region: 'us'
  },
  '86': {
    region: 'peru',
    id: 86
  },
  '87': {
    region: 'finland',
    id: 87
  },
  '88': {
    id: 88,
    city: 'moscow',
    region: 'ru'
  },
  '90': {
    id: 90,
    city: 'kansas',
    region: 'us'
  },
  '91': {
    region: 'lithuania',
    id: 91
  },
  '92': {
    region: 'panama',
    id: 92
  },
  '93': {
    region: 'latvia',
    id: 93
  },
  '94': {
    region: 'croatia',
    id: 94
  },
  '95': {
    region: 'bulgaria',
    id: 95
  },
  '96': {
    region: 'egypt',
    id: 96
  },
  '97': {
    region: 'czechrepublic',
    id: 97
  },
  '98': {
    region: 'slovakia',
    id: 98
  },
  '99': {
    region: 'denmark',
    id: 99
  },
  '100': {
    id: 100,
    city: 'capetown',
    region: 'za'
  },
  '101': {
    region: 'lebanon',
    id: 101
  },
  '102': {
    id: 102,
    city: 'arizona',
    region: 'us'
  },
  '103': {
    id: 103,
    city: 'mississippi',
    region: 'us'
  },
  '104': {
    id: 104,
    city: 'oklahoma',
    region: 'us'
  },
  '105': {
    id: 105,
    city: 'southcarolina',
    region: 'us'
  },
  '106': {
    id: 106,
    city: 'utah',
    region: 'us'
  },
  '107': {
    id: 107,
    city: 'wisconsin',
    region: 'us'
  },
  '108': {
    id: 108,
    city: 'alabama',
    region: 'us'
  },
  '109': {
    id: 109,
    city: 'alaska',
    region: 'us'
  },
  '110': {
    id: 110,
    city: 'arkansas',
    region: 'us'
  },
  '111': {
    id: 111,
    city: 'connecticut',
    region: 'us'
  },
  '112': {
    id: 112,
    city: 'delaware',
    region: 'us'
  },
  '113': {
    id: 113,
    city: 'idaho',
    region: 'us'
  },
  '114': {
    id: 114,
    city: 'iowa',
    region: 'us'
  },
  '115': {
    id: 115,
    city: 'kentucky',
    region: 'us'
  },
  '116': {
    id: 116,
    city: 'maine',
    region: 'us'
  },
  '117': {
    id: 117,
    city: 'maryland',
    region: 'us'
  },
  '118': {
    id: 118,
    city: 'missouri',
    region: 'us'
  },
  '119': {
    id: 119,
    city: 'montana',
    region: 'us'
  },
  '120': {
    id: 120,
    city: 'nebraska',
    region: 'us'
  },
  '121': {
    id: 121,
    city: 'newhampshire',
    region: 'us'
  },
  '122': {
    id: 122,
    city: 'newmexico',
    region: 'us'
  },
  '123': {
    id: 123,
    city: 'northcarolina',
    region: 'us'
  },
  '124': {
    id: 124,
    city: 'northdakota',
    region: 'us'
  },
  '125': {
    id: 125,
    city: 'oregon',
    region: 'us'
  },
  '127': {
    id: 127,
    city: 'rhodeisland',
    region: 'us'
  },
  '128': {
    id: 128,
    city: 'southdakota',
    region: 'us'
  },
  '129': {
    id: 129,
    city: 'vermont',
    region: 'us'
  },
  '130': {
    id: 130,
    city: 'virginia',
    region: 'us'
  },
  '131': {
    id: 131,
    city: 'westvirginia',
    region: 'us'
  },
  '132': {
    id: 132,
    city: 'wyoming',
    region: 'us'
  },
  '133': {
    id: 133,
    city: 'hawaii',
    region: 'us'
  },
  '135': {
    region: 'elsalvador',
    id: 135
  },
  '136': {
    id: 136,
    city: 'dubai',
    region: 'ae'
  },
  '137': {
    id: 137,
    city: 'calgary',
    region: 'ca'
  },
  '138': {
    id: 138,
    city: 'hokkaido',
    region: 'jp'
  },
  '139': {
    id: 139,
    city: 'kyushu',
    region: 'jp'
  },
  '140': {
    id: 140,
    city: 'chubu',
    region: 'jp'
  },
  '141': {
    id: 141,
    city: 'chugoku',
    region: 'jp'
  },
  '142': {
    region: 'slovenia',
    id: 142
  },
  '143': {
    id: 143,
    city: 'cologne',
    region: 'de'
  },
  '144': {
    id: 144,
    city: 'dortmundessen',
    region: 'de'
  },
  '145': {
    id: 145,
    city: 'dusseldorf',
    region: 'de'
  },
  '146': {
    id: 146,
    city: 'hannover',
    region: 'de'
  },
  '147': {
    id: 147,
    city: 'frankfurt',
    region: 'de'
  },
  '148': {
    id: 148,
    city: 'hamburg',
    region: 'de'
  },
  '149': {
    id: 149,
    city: 'leipzig',
    region: 'de'
  },
  '150': {
    id: 150,
    city: 'dresden',
    region: 'de'
  },
  '151': {
    id: 151,
    city: 'munich',
    region: 'de'
  },
  '152': {
    id: 152,
    city: 'stuttgart',
    region: 'de'
  },
  '153': {
    id: 153,
    city: 'mannheim',
    region: 'de'
  },
  '154': {
    id: 154,
    city: 'nurnberg',
    region: 'de'
  },
  '155': {
    id: 155,
    city: 'west',
    region: 'fr'
  },
  '156': {
    id: 156,
    city: 'southeast',
    region: 'fr'
  },
  '157': {
    id: 157,
    city: 'frenchriviera',
    region: 'fr'
  },
  '158': {
    region: 'monaco',
    id: 158
  },
  '159': {
    region: 'austria',
    id: 159
  },
  '160': {
    id: 160,
    city: 'east',
    region: 'es'
  },
  '161': {
    id: 161,
    city: 'windsor',
    region: 'ca'
  },
  '162': {
    id: 162,
    city: 'otherregions',
    region: 'in'
  },
  '163': {
    region: 'colombia',
    id: 163
  },
  '164': {
    region: 'malta',
    id: 164
  },
  '165': {
    region: 'ukraine',
    id: 165
  },
  '166': {
    region: 'pakistan',
    id: 166
  },
  '167': {
    region: 'honduras',
    id: 167
  },
  '168': {
    region: 'philippines',
    id: 168
  },
  '169': {
    id: 169,
    city: 'south',
    region: 'es'
  },
  '170': {
    id: 170,
    city: 'north',
    region: 'es'
  },
  '171': {
    id: 171,
    city: 'north',
    region: 'it'
  },
  '172': {
    id: 172,
    city: 'south',
    region: 'it'
  },
  '173': {
    region: 'morocco',
    id: 173
  },
  '174': {
    id: 174,
    city: 'rotterdam',
    region: 'nl'
  },
  '175': {
    id: 175,
    city: 'utrecht',
    region: 'nl'
  },
  '176': {
    id: 176,
    city: 'otherregions',
    region: 'nl'
  },
  '177': {
    id: 177,
    city: 'eindhoven',
    region: 'nl'
  },
  '178': {
    id: 178,
    city: 'thehague',
    region: 'nl'
  },
  '179': {
    region: 'dominicanrepublic',
    id: 179
  },
  '180': {
    region: 'paraguay',
    id: 180
  },
  '181': {
    region: 'puertorico',
    id: 181
  },
  '182': {
    region: 'venezuela',
    id: 182
  },
  '183': {
    region: 'macedonia',
    id: 183
  },
  '184': {
    region: 'estonia',
    id: 184
  },
  '185': {
    region: 'ecuador',
    id: 185
  },
  '186': {
    region: 'barbados',
    id: 186
  },
  '187': {
    region: 'bosniaandherzegovina',
    id: 187
  },
  '188': {
    region: 'georgia',
    id: 188
  },
  '189': {
    region: 'belarus',
    id: 189
  },
  '190': {
    id: 190,
    city: 'guangzhou',
    region: 'cn'
  },
  '191': {
    id: 191,
    city: 'beijing',
    region: 'cn'
  },
  '192': {
    region: 'jordan',
    id: 192
  },
  '193': {
    region: 'montenegro',
    id: 193
  },
  '194': {
    region: 'uruguay',
    id: 194
  },
  '195': {
    region: 'bahrain',
    id: 195
  },
  '196': {
    region: 'tunisia',
    id: 196
  },
  '197': {
    region: 'cyprus',
    id: 197
  },
  '198': {
    region: 'moldova',
    id: 198
  },
  '199': {
    region: 'luxembourg',
    id: 199
  },
  '200': {
    region: 'bolivia',
    id: 200
  },
  '201': {
    region: 'iceland',
    id: 201
  },
  '202': {
    region: 'guatemala',
    id: 202
  },
  '203': {
    region: 'qatar',
    id: 203
  },
  '204': {
    region: 'malawi',
    id: 204
  },
  '205': {
    region: 'vietnam',
    id: 205
  },
  '206': {
    region: 'iran',
    id: 206
  },
  '207': {
    region: 'caymanislands',
    id: 207
  },
  '208': {
    id: 208,
    city: 'brandenburg',
    region: 'de'
  },
  '209': {
    id: 209,
    city: 'augsburg',
    region: 'de'
  },
  '210': {
    id: 210,
    city: 'jena',
    region: 'de'
  },
  '211': {
    id: 211,
    city: 'prairies',
    region: 'ca'
  },
  '212': {
    region: 'mongolia',
    id: 212
  },
  '213': {
    id: 213,
    city: 'abudhabi',
    region: 'ae'
  },
  '214': {
    region: 'kenya',
    id: 214
  },
  '215': {
    region: 'oman',
    id: 215
  },
  '216': {
    region: 'uzbekistan',
    id: 216
  },
  '217': {
    id: 217,
    city: 'suzhou',
    region: 'cn'
  },
  '218': {
    id: 218,
    city: 'sanfrancisco',
    region: 'us'
  },
  '219': {
    id: 219,
    city: 'heidelberg',
    region: 'de'
  },
  '220': {
    id: 220,
    city: 'karlsruhe',
    region: 'de'
  },
  '221': {
    region: 'jamaica',
    id: 221
  },
  '222': {
    region: 'seychelles',
    id: 222
  },
  '223': {
    region: 'albania',
    id: 223
  },
  '224': {
    id: 224,
    city: 'regensburg',
    region: 'de'
  },
  '225': {
    id: 225,
    city: 'bremen',
    region: 'de'
  },
  '226': {
    id: 226,
    city: 'mecklenburgvorpommern',
    region: 'de'
  },
  '227': {
    id: 227,
    city: 'saxonyanhalt',
    region: 'de'
  },
  '228': {
    id: 228,
    city: 'freiburg',
    region: 'de'
  },
  '229': {
    id: 229,
    city: 'darmstadt',
    region: 'de'
  },
  '230': {
    id: 230,
    city: 'atlanticprovinces',
    region: 'ca'
  },
  '231': {
    id: 231,
    city: 'saintpetersburg',
    region: 'ru'
  },
  '232': {
    id: 232,
    city: 'restofrussia',
    region: 'ru'
  },
  '233': {
    id: 233,
    city: 'kassel',
    region: 'de'
  },
  '234': {
    id: 234,
    city: 'hangzhou',
    region: 'cn'
  },
  '235': {
    id: 235,
    city: 'erfurt',
    region: 'de'
  },
  '236': {
    region: 'kuwait',
    id: 236
  },
  '237': {
    id: 237,
    city: 'krasnodar',
    region: 'ru'
  },
  '238': {
    region: 'cuba',
    id: 238
  },
  '242': {
    id: 242,
    city: 'okinawa',
    region: 'jp'
  },
  '243': {
    region: 'gibraltar',
    id: 243
  },
  '244': {
    id: 244,
    city: 'macau',
    region: 'cn'
  },
  '249': {
    region: 'nicaragua',
    id: 249
  },
  '250': {
    id: 250,
    city: 'quebec',
    region: 'ca'
  },
  '252': {
    id: 252,
    city: 'kanto',
    region: 'jp'
  },
  '254': {
    id: 254,
    city: 'tohoku',
    region: 'jp'
  },
  '258': {
    id: 258,
    city: 'johannesburg',
    region: 'za'
  },
  '259': {
    id: 259,
    city: 'durban',
    region: 'za'
  },
  '260': {
    id: 260,
    city: 'otherregions',
    region: 'za'
  },
  '264': {
    region: 'armenia',
    id: 264
  },
  '265': {
    id: 265,
    city: 'chemnitz',
    region: 'de'
  },
  '266': {
    id: 266,
    city: 'rhinelandpalatinate',
    region: 'de'
  },
  '269': {
    region: 'bangladesh',
    id: 269
  },
  '270': {
    region: 'azerbaijan',
    id: 270
  },
  '271': {
    region: 'tanzania',
    id: 271
  },
  '272': {
    region: 'cambodia',
    id: 272
  },
  '273': {
    id: 273,
    city: 'schleswigholstein',
    region: 'de'
  },
  '274': {
    id: 274,
    city: 'bielefeld',
    region: 'de'
  },
  '275': {
    id: 275,
    city: 'munster',
    region: 'de'
  },
  '276': {
    id: 276,
    city: 'central',
    region: 'fr'
  },
  '277': {
    id: 277,
    city: 'east',
    region: 'fr'
  },
  '278': {
    id: 278,
    city: 'north',
    region: 'fr'
  },
  '279': {
    id: 279,
    city: 'tianjin',
    region: 'cn'
  },
  '280': {
    id: 280,
    city: 'wuhan',
    region: 'cn'
  },
  '281': {
    id: 281,
    city: 'nanjing',
    region: 'cn'
  },
  '282': {
    id: 282,
    city: 'shenyang',
    region: 'cn'
  },
  '283': {
    id: 283,
    city: 'chengdu',
    region: 'cn'
  },
  '284': {
    id: 284,
    city: 'xiamen',
    region: 'cn'
  },
  '285': {
    id: 285,
    city: 'quanzhou',
    region: 'cn'
  },
  '286': {
    id: 286,
    city: 'southwest',
    region: 'fr'
  },
  '287': {
    region: 'nepal',
    id: 287
  },
  '288': {
    region: 'andorra',
    id: 288
  },
  '289': {
    region: 'srilanka',
    id: 289
  },
  '290': {
    region: 'guam',
    id: 290
  },
  '294': {
    id: 294,
    city: 'shikoku',
    region: 'jp'
  },
  '296': {
    region: 'bahamas',
    id: 296
  },
  '297': {
    region: 'kazakhstan',
    id: 297
  },
  '298': {
    id: 298,
    city: 'bochum',
    region: 'de'
  },
  '299': {
    region: 'saudiarabia',
    id: 299
  },
  '300': {
    id: 300,
    city: 'north',
    region: 'mx'
  },
  '301': {
    id: 301,
    city: 'south',
    region: 'mx'
  },
  '302': {
    id: 302,
    city: 'sicily',
    region: 'it'
  },
  '303': {
    region: 'nigeria',
    id: 303
  },
  '304': {
    region: 'mauritius',
    id: 304
  },
  '305': {
    region: 'mozambique',
    id: 305
  },
  '306': {
    region: 'uganda',
    id: 306
  },
  '307': {
    region: 'algeria',
    id: 307
  },
  '308': {
    id: 308,
    city: 'california',
    region: 'us'
  },
  '309': {
    id: 309,
    city: 'sandiego',
    region: 'us'
  },
  '310': {
    id: 310,
    city: 'sacramento',
    region: 'us'
  },
  '311': {
    id: 311,
    city: 'changsha',
    region: 'cn'
  },
  '312': {
    region: 'angola',
    id: 312
  },
  '313': {
    region: 'zimbabwe',
    id: 313
  },
  '314': {
    id: 314,
    city: 'jacksonville',
    region: 'us'
  },
  '315': {
    id: 315,
    city: 'orlando',
    region: 'us'
  },
  '316': {
    id: 316,
    city: 'tampabay',
    region: 'us'
  },
  '317': {
    id: 317,
    city: 'florida',
    region: 'us'
  },
  '318': {
    id: 318,
    city: 'texas',
    region: 'us'
  },
  '319': {
    id: 319,
    city: 'dallasfortworth',
    region: 'us'
  },
  '320': {
    id: 320,
    city: 'sanantonio',
    region: 'us'
  },
  '321': {
    id: 321,
    city: 'austin',
    region: 'us'
  },
  '322': {
    id: 322,
    city: 'elpaso',
    region: 'us'
  },
  '323': {
    id: 323,
    city: 'goa',
    region: 'in'
  },
  '324': {
    id: 324,
    city: 'delhi',
    region: 'in'
  },
  '325': {
    id: 325,
    city: 'bangalore',
    region: 'in'
  },
  '326': {
    id: 326,
    city: 'hyderabad',
    region: 'in'
  },
  '327': {
    id: 327,
    city: 'chennai',
    region: 'in'
  },
  '328': {
    id: 328,
    city: 'mumbai',
    region: 'in'
  },
  '329': {
    id: 329,
    city: 'pune',
    region: 'in'
  },
  '330': {
    region: 'bermuda',
    id: 330
  },
  '331': {
    region: 'belize',
    id: 331
  },
  '332': {
    id: 332,
    city: 'chongqing',
    region: 'cn'
  },
  '333': {
    id: 333,
    city: 'saarland',
    region: 'de'
  },
  '334': {
    region: 'curacao',
    id: 334
  },
  '335': {
    region: 'myanmar',
    id: 335
  },
  '336': {
    id: 336,
    city: 'badenwurttemberg',
    region: 'de'
  },
  '337': {
    id: 337,
    city: 'lyon',
    region: 'fr'
  },
  '338': {
    id: 338,
    city: 'marseille',
    region: 'fr'
  },
  '339': {
    id: 339,
    city: 'montpellier',
    region: 'fr'
  },
  '340': {
    id: 340,
    city: 'glasgow',
    region: 'uk'
  },
  '341': {
    id: 341,
    city: 'edinburgh',
    region: 'uk'
  },
  '342': {
    id: 342,
    city: 'aberdeen',
    region: 'uk'
  },
  '343': {
    id: 343,
    city: 'liverpool',
    region: 'uk'
  },
  '344': {
    id: 344,
    city: 'manchester',
    region: 'uk'
  },
  '345': {
    id: 345,
    city: 'newcastle',
    region: 'uk'
  },
  '346': {
    id: 346,
    city: 'leeds',
    region: 'uk'
  },
  '347': {
    id: 347,
    city: 'milan',
    region: 'it'
  },
  '348': {
    id: 348,
    city: 'turin',
    region: 'it'
  },
  '349': {
    id: 349,
    city: 'venice',
    region: 'it'
  },
  '350': {
    id: 350,
    city: 'bologna',
    region: 'it'
  },
  '351': {
    id: 351,
    city: 'rome',
    region: 'it'
  },
  '352': {
    id: 352,
    city: 'florence',
    region: 'it'
  },
  '353': {
    id: 353,
    city: 'northrhinewestphalia',
    region: 'de'
  },
  '354': {
    id: 354,
    city: 'hesse',
    region: 'de'
  },
  '355': {
    id: 355,
    city: 'thuringia',
    region: 'de'
  },
  '356': {
    id: 356,
    city: 'saxony',
    region: 'de'
  },
  '357': {
    id: 357,
    city: 'bavaria',
    region: 'de'
  },
  '358': {
    id: 358,
    city: 'lowersaxony',
    region: 'de'
  },
  '359': {
    id: 359,
    city: 'illinois',
    region: 'us'
  },
  '360': {
    id: 360,
    city: 'michigan',
    region: 'us'
  },
  '361': {
    id: 361,
    city: 'shenzhen',
    region: 'cn'
  },
  '362': {
    region: 'kosovo',
    id: 362
  },
  '363': {
    region: 'saintmartin',
    id: 363
  },
  '364': {
    id: 364,
    city: 'porto',
    region: 'pt'
  },
  '365': {
    id: 365,
    city: 'algarve',
    region: 'pt'
  },
  '366': {
    id: 366,
    city: 'other',
    region: 'pt'
  },
  '367': {
    id: 367,
    city: 'canaryislands',
    region: 'es'
  },
  '368': {
    region: 'palestine',
    id: 368
  }
}
