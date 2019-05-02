import mongoose from 'mongoose';

const SiteConfigSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Site name required.'],
    default: 'My Website'
  },
  description: {
    type: String,
    required: [true, 'Description required.'],
    default: 'Welcome to my Website!'
  },
  aboutBody: {
    type: String,
    required: [true, 'About text required.'],
    default: 'Welcome to my Website!'
  },
  iconUrl: {
    type: String,
    required: true,
    default:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE' +
      'GWlDQ1BrQ0dDb2xvclNwYWNlR2VuZXJpY1JHQgAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD' +
      '8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQv' +
      'lQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4n' +
      'OHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B' +
      '8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDP' +
      'sxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G' +
      '/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwd' +
      'irqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjz' +
      'hJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFu' +
      'v6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFk' +
      'KEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I' +
      '6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW' +
      '/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+e' +
      'v8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev' +
      '9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLn' +
      'Afc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549' +
      'HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUm' +
      'kQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuro' +
      'iKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPyg' +
      'feBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8B' +
      'oJ98VQNcC+8AAADBSURBVFgJ7ZXRDkAwDEUNic/0bb4TISRL5ra2bjp7qRcqTXvc3o5b++' +
      'noGl59w953awMYcQTjPuMr1Xgblkc9MgJMeGRXCAjA1eNPCBbgTwiXOgfQE9rqvCrgx40N' +
      'Ecjnld6TANw4NCFEADUhxAC1IIgJv8iLfpH4IksBScHcHAMgPyOUsGSuWCMW2whMgeYKkJ' +
      'PwcmzsNNTeiuQa4gppw7EA+JWxpgiYG7MAWCQE0oYRAYRA2jCsCcOGtZ+br6EBnGQUNNdJ' +
      'MQRwAAAAAElFTkSuQmCC'
  },
  profileTemplate: {
    type: String,
    required: false,
    default: '<div><h1>{{displayName}}</h1><p>@{{username}}</p></div>'
  },
  stylesheet: {
    type: String,
    required: false
  },
  menuLinks: {
    type: Array,
    required: false,
    default: [{
      linkText: 'Login',
      linkUrl: '/login'
    },
    {
      linkText: 'Register',
      linkUrl: '/signup'
    }]
  },
  useSlug: {
    type: Boolean,
    required: false,
    default: false
  },
  shortcodes: {
    type: [Object],
    required: false
  },
  keywords: {
    type: [String],
    required: false
  }
});

export default mongoose.model('SiteConfig', SiteConfigSchema);
